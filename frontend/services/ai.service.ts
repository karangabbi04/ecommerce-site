import { api } from "@/lib/api";

type EnhancePayload = {
  name: string;
  description: string;
  category: string;
  tags: string[];
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