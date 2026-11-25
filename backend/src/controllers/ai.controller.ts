import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateProductDescription = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, description, category, tags } = req.body;


      if (!name || !description || !category) {
        throw new ApiError(400, "Name, description and category are required");
      }

      const prompt = `You are an expert e-commerce copywriter. Your job is to write one attractive, human-friendly product description.
      INPUT YOU WILL GET:
- Product Name 
- Short Description
- Category
input is 
Name: ${name}
Description: ${description}
Category: ${category}

YOUR TASK:
Using only the input above, write a warm, catchy product description that makes customers want to buy.

RULES:

1. Maximum 90 words. Never go above this limit.
2. Use simple English. Short sentences, easy words, no difficult vocabulary.
3. Start with a strong hook line that grabs attention.
4. Mention the product's main benefits, not just features.
5. Show how the product can be used for DECORATION (home, table, shelf, party, or festival setup).
6. If the product is a glass, cup, plate, bowl, or any serving item, mention that it can be used to SERVE GUESTS on special occasions.
7. If the product is a food or drink item, mention that it can be SERVED TO GUESTS on special occasions like birthdays, festivals, weddings, or family gatherings.
8. Mention that the product makes a lovely GIFT for family, friends, or loved ones (birthday, anniversary, wedding, festival, housewarming).
9. Only apply rules 5 to 8 where they make sense for the product. Do not force a use that does not fit (for example, do not suggest serving guests with a non-food decor item).
10. Do not invent facts, materials, sizes, certifications, or health claims that are not in the input.
11. Do not use fake discounts, false promises, or exaggerated claims like "best in the world".
12. Tone: friendly, warm, and trustworthy. Make the reader imagine using the product.
13. End with a short call to action, like "Order now and make your moments special."
14. Output only the final description as plain paragraphs. No headings, no bullet points, no emojis, no word count, no extra explanation.
15: always response in json

OUTPUT FORMAT:
One description of under 90 words, `;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      console.log("FULL AI RESPONSE:", JSON.stringify(aiResponse, null, 2));

      const text = aiResponse.text || "";


      if (!text.trim()) {
        throw new ApiError(500, "AI returned empty response");
      }

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();


      let parsed;

      try {
        parsed = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("JSON PARSE ERROR:", parseError);
        console.error("TEXT THAT FAILED TO PARSE:", cleanedText);

        throw new ApiError(500, "Failed to parse AI response");
      }

      console.log("PARSED AI RESPONSE:", parsed);
       res
        .status(200)
        .json(
          new ApiResponse(
            200,
            parsed,
            "Product description generated successfully"
          )
        );
    } catch (error: any) {
      console.error("GENERATE PRODUCT DESCRIPTION ERROR:", error);

      if (error?.response) {
        console.error("API ERROR RESPONSE DATA:", error.response.data);
        console.error("API ERROR STATUS:", error.response.status);
        console.error("API ERROR HEADERS:", error.response.headers);
      }

      if (error?.message) {
        console.error("ERROR MESSAGE:", error.message);
      }

      if (error?.stack) {
        console.error("ERROR STACK:", error.stack);
      }

      throw error;
    }
  }
);




export { generateProductDescription };