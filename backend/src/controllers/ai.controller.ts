import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
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

      const prompt = `Generate a detailed product description for an e-commerce website based on the following information:
Name: ${name}
Description: ${description}
Category: ${category}
Tags: ${Array.isArray(tags) ? tags.join(", ") : tags || "None"}

JSON format:
{
  "description": "short product card description under 180 characters",

}

Rules:
- Return only valid JSON
- No markdown
- No code block
- Keep it clean and premium
- Mention handmade/recycled glass naturally
- Do not overhype
- Use simple English`;

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
      return res
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