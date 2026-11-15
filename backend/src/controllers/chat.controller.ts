import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { aiService } from "../services/ai.service.js";
import { ZodError } from "zod";

interface ChatResponseBody {
  success: boolean;
  data?: {
    reply: string;
    actions: AIServiceResult["actions"];
    requestId: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AIServiceResult {
  reply: string;
  actions: Array<{
    function: string;
    args: Record<string, unknown>;
  }> | null;
}

const AI_TIMEOUT_MS= 45000; // 45 seconds

const MAX_HISTORY_MESSAGES = 10; // Limit the number of messages to send to the AI model

class ChatController {

    chatWithAI = asyncHandler(async (req: Request, res: Response) => {
      const requestId = randomUUID();

        const user =req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        const { message, conversationHistory } = req.body; 

        if (!message || typeof message !== "string") {
            throw new ApiError(400, "Message is required and must be a string");
        }

        if (conversationHistory !== undefined && !Array.isArray(conversationHistory)) {
          throw new ApiError(400, "conversationHistory must be an array");
        }

        let timeoutId: NodeJS.Timeout | undefined;

        try {
          const timeout = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(
              () => reject(new Error("AI request timed out")),
              AI_TIMEOUT_MS,
            );
          });
          const history = (conversationHistory ?? []).slice(-MAX_HISTORY_MESSAGES);
          const result = await Promise.race([
            aiService.processMessage(message, user, history),
            timeout,
          ]);

          res.status(200).json({
            success: true,
            data: { ...result, requestId },
          });
        } catch (error) {
          this.handleError(error, res, requestId);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
    })

     private handleError(error: unknown, res: Response, requestId: string): void {
    // Full error server logs mein (debugging ke liye)
    console.error(`[${requestId}] Chat error:`, error);

    // Zod error (agar service ke andar se aaya)
    if (error instanceof ZodError) {
      this.sendError(res, 400, "VALIDATION_ERROR", "Invalid data", requestId);
      return;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const lower = message.toLowerCase();

    // Timeout
    if (lower.includes("timed out")) {
      this.sendError(
        res,
        504,
        "AI_TIMEOUT",
        "AI took too long to respond. Please try again.",
        requestId
      );
      return;
    }

    // Gemini rate limit
    if (lower.includes("rate limit") || lower.includes("429") || lower.includes("quota")) {
      this.sendError(
        res,
        429,
        "AI_RATE_LIMIT",
        "AI service is busy. Please retry in a few seconds.",
        requestId
      );
      return;
    }

    // Gemini API key / config problem
    if (lower.includes("api key") || lower.includes("permission denied")) {
      // ⚠️ User ko mat batao ki key galat hai — internal detail hai
      this.sendError(
        res,
        503,
        "AI_UNAVAILABLE",
        "AI service is temporarily unavailable.",
        requestId
      );
      return;
    }

    // Generic fallback — stack trace kabhi expose mat karo
    this.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Something went wrong while processing your message.",
      requestId
    );
  }


  private sendError(
    res: Response,
    status: number,
    code: string,
    message: string,
    requestId: string,
    details?: unknown
  ): void {
    const body: ChatResponseBody = {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
      // requestId error mein bhi bhejo — support ticket mein kaam aayega
      data: undefined,
    };

    res.status(status).json({ ...body, requestId });
  }

}


export const chatController = new ChatController();