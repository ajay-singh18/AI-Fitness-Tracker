import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY as string});

export const analyzeImage = async (filePath: string) => {
    try {
        const base64ImageFile = fs.readFileSync(filePath, {
            encoding: "base64",
        });

        const contents: any[] = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64ImageFile,
                },
            },
            { text: "Extract the food name and estimated calories from this image in a JSON object." },
        ];

        const config = {
            responseMimeType : "application/json",
            responseJsonSchema:{
                type: "object",
                properties: {
                    name: {type: "string"},
                    calories: {type: "number"},
                }
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config
        });

        if (!response.text) {
            throw new Error("No text returned from Gemini API");
        }

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
