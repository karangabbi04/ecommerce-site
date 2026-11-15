import { FunctionCallingConfigMode, GoogleGenAI } from "@google/genai";
import { ToolExecutor } from "../tools/tool.executor.js";
import { getAllowedToolNames, getExecutorByName,getToolDefinitions } from "../tools/tool-registry.js";


// ========================================
// INTERFACES
// ========================================
interface User {
  id: string;
  email: string;
  role: string;
}

interface ConversationMessage {
  role: 'user' | 'model';
  content: string;
}

interface AIResponse {
  reply: string;
  actions: Array<{
    function: string;
    args: any;
  }> | null;
}

// ========================================
// AI SERVICE CLASS
// ========================================
export class AIService {
  private genAI: GoogleGenAI;
  private readonly MODEL_NAME = "gemini-3.5-flash-lite";

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
    });
  }

  // ========================================
  // MAIN METHOD: Process User Message
  // ========================================
  async processMessage(
    userMessage: string, 
    user: User, 
    conversationHistory: ConversationMessage[] = []
  ): Promise<AIResponse> {
    console.log('\n🤖 ========== AI SERVICE START ==========');
    console.log('📩 User Message:', userMessage);
    
    try {
      const availableTools = getAllowedToolNames(user.role);
      const allToolDefinitions = getToolDefinitions();
      const toolDefinitions = allToolDefinitions.filter((tool) =>
        availableTools.some((allowedTool) => allowedTool.name === tool.name)
      );
      const toolNames = toolDefinitions.map((tool) => tool.name);

      console.log(`📋 Tools Available for ${user.role}:`, toolNames.join(', '));

      const systemInstruction = this.buildSystemInstruction(user.role, toolNames);

      console.log('\n📞 Making FIRST Gemini call...');
      const response = await this.callGemini(
        userMessage,
        systemInstruction,
        toolDefinitions,
        conversationHistory
      );
      
      console.log('✅ First response received');

      // 1. Get ALL parts from the response
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      // 2. Filter the EXACT 'part' objects that contain functionCall (preserves thought_signature)
      const functionCallParts = parts.filter((part: any) => part.functionCall);
      
      // 3. Get text parts if any
      const textResponse = parts
        .filter((part: any) => part.text)
        .map((part: any) => part.text)
        .join("");

      console.log('🔍 Parsed Function Call Parts:', functionCallParts.length);

      if (functionCallParts && functionCallParts.length > 0) {
        console.log('\n🔧 Function calls detected:', functionCallParts.map((p: any) => p.functionCall.name));
        
        // Pass the WHOLE part objects, not just the inner functionCall
        return await this.handleFunctionCalls(
          functionCallParts, 
          user,
          userMessage,
          systemInstruction,
          conversationHistory
        );
      } else {
        console.log('💬 Simple text response (No tool call needed)');
        console.log('🤖 ========== AI SERVICE END ==========\n');
        
        return {
          reply: textResponse || "Sorry, I couldn't process that.",
          actions: null
        };
      }

    } catch (error: any) {
      console.error('❌ AI Service Error:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  private async callGemini(
    userMessage: string,
    systemInstruction: string,
    toolDefinitions: any[],
    conversationHistory: ConversationMessage[]
  ) {
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await this.genAI.models.generateContent({
      model: this.MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction,
        tools: toolDefinitions.length > 0 ? [{ functionDeclarations: toolDefinitions }] : undefined,
        toolConfig: {
          functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO }
        },
      }
    });

    return response;
  }

  private async handleFunctionCalls(
    functionCallParts: any[], // <-- CHANGED: Now receives the whole part objects
    user: User,
    originalMessage: string,
    systemInstruction: string,
    conversationHistory: ConversationMessage[]
  ): Promise<AIResponse> {
    console.log('\n🔧 ========== HANDLING FUNCTION CALLS ==========');
    
    const functionResponses: any[] = [];
    const actions: Array<{ function: string; args: any }> = [];

    for (const part of functionCallParts) {
      // Extract inner object ONLY for execution
      const fc = part.functionCall; 
      const functionName = fc.name;
      const args = fc.args;
      
      console.log(`\n⚙️ Executing: ${functionName}`);
      console.log('📥 Args:', args);

      try {
        const result = await ToolExecutor.execute(functionName, args, user);
        console.log('✅ Result:', result);
        
        functionResponses.push({
          name: functionName,
          response: result
        });
        
        if (result.success) {
          actions.push({ function: functionName, args: args });
        }

      } catch (error: any) {
        console.error(`❌ Error executing ${functionName}:`, error.message);
        functionResponses.push({
          name: functionName,
          response: { success: false, error: error.message }
        });
      }
    }

    console.log('\n📞 Making SECOND Gemini call with results...');
    
    const finalResponse = await this.callGeminiWithResults(
      originalMessage,
      systemInstruction,
      functionCallParts, // <-- PASS THE ORIGINAL PARTS HERE
      functionResponses,
      conversationHistory
    );
    
    const finalParts = finalResponse.candidates?.[0]?.content?.parts || [];
    const finalText = finalParts
      .filter((part: any) => part.text)
      .map((part: any) => part.text)
      .join("") || "Task completed successfully.";
    
    console.log('💬 Final reply:', finalText);
    console.log('🔧 ========== FUNCTION CALLS END ==========\n');

    return {
      reply: finalText,
      actions: actions.length > 0 ? actions : null
    };
  }

  private async callGeminiWithResults(
    originalMessage: string,
    systemInstruction: string,
    functionCallParts: any[], // <-- CHANGED: Receives original parts
    functionResponses: any[],
    conversationHistory: ConversationMessage[]
  ) {
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: originalMessage }]
      },
      {
        role: 'model',
        // ✅ FIX: Use the EXACT original parts array. This preserves the thought_signature!
        parts: functionCallParts 
      },
      {
        role: 'user',
        parts: functionResponses.map((fr: any) => ({
          functionResponse: {
            name: fr.name,
            response: fr.response
          }
        }))
      }
    ];

    const response = await this.genAI.models.generateContent({
      model: this.MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction,
        toolConfig: {
          functionCallingConfig: { mode: FunctionCallingConfigMode.NONE }
        },
      },
    });
    
    console.log('✅ Second Gemini response received');
    return response;
  }

  private buildSystemInstruction(userRole: string, toolNames: string[]): string {
    const toolsList = toolNames.length > 0 ? toolNames.join(', ') : 'None';
    
    return `You are an expert AI assistant for an admin dashboard. You help admins manage coupons, products, and view sales data.

AVAILABLE TOOLS: ${toolsList}

CRITICAL RULES:
1. When an admin explicitly asks to create a coupon, call the 'create_coupon' tool. Do not respond with coupon copy or suggestions.
2. When asked to create a product, use 'create_product' ONLY when name, description, price, stock, category, and image URL are available. Ask for missing details.
3. NEVER claim an action succeeded unless the tool response has "success: true".
4. If required details are missing, ask the admin for them before calling the tool.
5. Respond in the same language as the user (Hindi/English mix is perfectly fine).
6. Be concise, professional, and helpful.
7. If a tool fails, explain the error in simple terms to the admin.
8. NEVER expose sensitive data like passwords, API keys, or raw database errors.
9. After successful tool execution, briefly confirm what was done.
10. If the user wants to CREATE, UPDATE, DELETE, or FETCH data → YOU MUST USE THE AVAILABLE TOOLS.
11. NEVER write marketing descriptions unless explicitly asked to do so.
12. When in doubt, ASK for clarification instead of guessing.

USER ROLE: ${userRole}`;
  }
}

export const aiService = new AIService();