import { FunctionCallingConfigMode, GoogleGenAI } from "@google/genai";
import { ToolExecutor } from "../tools/tool.executor.js";
import { getAllowedToolNames, getExecutorByName,getToolDefinitions } from "../tools/tool-registry.js";
import { buildAdminAssistantPrompt } from "../prompts/admin-assistant.prompt.js";


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

    const maxToolCalls = 5;
    const actions: Array<{ function: string; args: any }> = [];
    const toolResults: Array<{
      name: string;
      args: Record<string, unknown>;
      result: any;
      executed: boolean;
    }> = [];
    
    try {
      const availableTools = getAllowedToolNames(user.role);
      const allToolDefinitions = getToolDefinitions();
      const toolDefinitions = allToolDefinitions.filter((tool) =>
        availableTools.some((allowedTool) => allowedTool.name === tool.name)
      );
      const toolNames = toolDefinitions.map((tool) => tool.name);

      console.log(`📋 Tools Available for ${user.role}:`, toolNames.join(', '));

      const systemInstruction = buildAdminAssistantPrompt(user.role, toolNames);

      console.log('\n📞 Making FIRST Gemini call...');
      const contents: any[] = [
        ...conversationHistory.map((message) => ({
          role: message.role,
          parts: [{ text: message.content }],
        })),
        { role: "user", parts: [{ text: userMessage }] },
      ];

      let response = await this.callGemini(contents, systemInstruction, toolDefinitions);
      let toolCallsExecuted = 0;

      while (true) {
        const parts = response.candidates?.[0]?.content?.parts || [];
        const functionCallParts = parts.filter((part: any) => part.functionCall);
        const textResponse = parts
          .filter((part: any) => part.text)
          .map((part: any) => part.text)
          .join("");

        console.log("🔍 Parsed Function Call Parts:", functionCallParts.length);

        if (functionCallParts.length === 0) {
          console.log("🤖 ========== AI SERVICE END ==========\n");
          return {
            reply: textResponse || "Sorry, I couldn't process that.",
            actions: actions.length ? actions : null,
          };
        }

        if (toolCallsExecuted >= maxToolCalls) {
          return {
            reply: textResponse || `I reached the limit of ${maxToolCalls} tool calls for this request.`,
            actions: actions.length ? actions : null,
          };
        }

        console.log(`🔧 Tool call round ${toolCallsExecuted + 1}; calls: ${functionCallParts.length}`);
        const functionResponses: any[] = [];

        for (const part of functionCallParts) {
          const functionCall = part.functionCall;
          const functionName = functionCall?.name;

          if (!functionCall || typeof functionName !== "string") {
            functionResponses.push({
              name: "unknown_tool",
              response: { success: false, error: "The model returned an invalid tool call." },
            });
            continue;
          }

          if (toolCallsExecuted >= maxToolCalls) {
            const result = {
              success: false,
              error: `Not executed because the ${maxToolCalls}-tool-call limit was reached.`,
            };
            functionResponses.push({
              name: functionName,
              response: result,
            });
            toolResults.push({ name: functionName, args: functionCall.args ?? {}, result, executed: false });
            continue;
          }

          toolCallsExecuted += 1;
          console.log(`⚙️ Executing tool ${toolCallsExecuted}/${maxToolCalls}: ${functionName}`);

          const args = functionCall.args ?? {};
          const result = await ToolExecutor.execute(functionName, args, user);
          functionResponses.push({ name: functionName, response: result });
          toolResults.push({ name: functionName, args, result, executed: true });

          if (result.success) {
            actions.push({ function: functionName, args });
          }
        }

        // Keep Gemini's original function-call parts (including thought signatures),
        // then let it choose the next tool based on the results.
        contents.push({ role: "model", parts: functionCallParts });
        contents.push({
          role: "user",
          parts: functionResponses.map((functionResponse) => ({
            functionResponse: {
              name: functionResponse.name,
              response: functionResponse.response,
            },
          })),
        });

        if (toolCallsExecuted >= maxToolCalls) {
          const finalResponse = await this.callGemini(
            contents,
            `${systemInstruction}\n\nFINAL RESPONSE: The tool-call budget is exhausted. Do not request or claim any more tool actions. Summarize which requested actions succeeded, which failed, and whether the user's full request was completed. If only some matching records were updated, clearly say the operation is partial. Use only the tool results in the conversation; do not guess counts or claim unfinished work succeeded.`,
            [],
          );
          const finalParts = finalResponse.candidates?.[0]?.content?.parts || [];
          const finalText = finalParts
            .filter((part: any) => part.text)
            .map((part: any) => part.text)
            .join("")
            .trim();

          return {
            reply: finalText || this.buildToolLimitSummary(toolResults, maxToolCalls),
            actions: actions.length ? actions : null,
          };
        }

        response = await this.callGemini(contents, systemInstruction, toolDefinitions);
      }

    } catch (error: any) {
      console.error('❌ AI Service Error:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  private buildToolLimitSummary(
    toolResults: Array<{
      name: string;
      args: Record<string, unknown>;
      result: any;
      executed: boolean;
    }>,
    maxToolCalls: number,
  ): string {
    const completed = toolResults.filter((item) => item.executed && item.result?.success);
    const failed = toolResults.filter((item) => item.executed && !item.result?.success);
    const notExecuted = toolResults.filter((item) => !item.executed);
    const completedNames = completed.map((item) =>
      typeof item.result?.message === "string" ? item.result.message : item.name,
    );

    let summary = `I completed ${completed.length} tool action${completed.length === 1 ? "" : "s"} before reaching the ${maxToolCalls}-call limit.`;
    if (completedNames.length) summary += ` Completed: ${completedNames.join("; ")}.`;
    if (failed.length) summary += ` ${failed.length} action${failed.length === 1 ? "" : "s"} failed and need review.`;
    if (notExecuted.length) {
      summary += ` The full request was not completed; ${notExecuted.length} requested action${notExecuted.length === 1 ? " was" : "s were"} not run. Please ask me to continue.`;
    }
    return summary;
  }

  private async callGemini(
    contents: any[],
    systemInstruction: string,
    toolDefinitions: any[],
  ) {
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

}

export const aiService = new AIService();