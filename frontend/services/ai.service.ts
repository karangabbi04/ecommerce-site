import { api } from "@/lib/api";

export interface AIConversationMessage {
  role: "user" | "model";
  content: string;
}

export interface AIChatResponse {
  reply: string;
  actions: Array<{
    function: string;
    args: Record<string, unknown>;
  }> | null;
  requestId: string;
}


export type EnhancePayload = {
  name: string;
  description: string;
  category: string;
};

type EnhanceResponse = {
  description: string;
  longDescription: string;
  suggestedTags: string[];
};



export const aiService = {
  async enhanceProductDescription(payload: EnhancePayload): Promise<EnhanceResponse> {
    const response = await api.post(`/ai/generate-product-description`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const data = response.data;

    if (response.status < 200 || response.status >= 300) {
      throw new Error(data?.message || "AI enhancement failed");
    }

    return data.data;
  },
};

export const  aiAssistant ={

  async chatWithAdminAssistant(message: string, conversationHistory: AIConversationMessage[]): Promise<AIChatResponse> {
    const response = await api.post(`/admin/ai`, {
      message,
      conversationHistory,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const data = response.data;

    if (response.status < 200 || response.status >= 300) {
      throw new Error(data?.message || "AI chat failed");
    }

    return data.data;
  }
};