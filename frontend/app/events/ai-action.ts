'use server';

import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY;

export async function generateEventContent(
    eventName: string,
    date: string,
    location: string,
    userContext: string
) {
    if (!apiKey) {
        console.error("GROQ_API_KEY is not set");
        // Fallback or throw error. For now, let's throw to make it obvious.
        // But maybe the user hasn't set it yet.
        throw new Error("GROQ_API_KEY is not set. Please add it to your .env.local file.");
    }

    console.log("Starting Groq Cloud Generation with BaseURL: https://api.groq.com/openai/v1");
    // Debug: Check if key exists (don't log the full key)
    if (apiKey) console.log("GROQ_API_KEY is present, length:", apiKey.length);
    else console.error("GROQ_API_KEY is MISSING in process.env");

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Using Llama 3 on Groq
            messages: [
                {
                    role: "system",
                    content: `You are a professional event copywriter and organizer's assistant.
Task: Transform raw event notes into a polished, high-conversion landing page summary.
Strict Constraints:
Truthfulness: Use ONLY the facts provided by the user. Do not invent dates, times, amenities, or features.
Missing Info: If a vital piece of information is missing, do not guess. Write "[Details to be confirmed by Admin]".
Tone: Professional, welcoming, and concise.

Formatting Requirement:
You must return only a valid JSON object. No markdown blocks.
Structure:
{
  "summary": "A professional, engaging 5 sentence description",
  "body": "A brief description (100-150 words) using user input",
  "key_details": ["Detail 1", "Detail 2", "Detail 3"]
}`
                },
                {
                    role: "user",
                    content: `
Input Data:
Event Name: ${eventName}
Date/Time: ${date}
Location: ${location}
Additional Notes/Context: ${userContext}
`
                }
            ],
            temperature: 0.7,
        });

        console.log("Groq Response Received");
        const text = completion.choices[0].message.content || "{}";
        console.log("Groq Raw Content:", text);

        // Cleanup if markdown code blocks are returned (some models still do it)
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);

        return {
            summary: data.summary,
            body: data.body,
            key_details: data.key_details
        };
    } catch (error: any) {
        console.error("Critical AI Generation Error:", error);
        if (error?.response) {
            console.error("API Response Data:", error.response.data);
            console.error("API Response Status:", error.response.status);
        }
        throw new Error(`AI generation failed: ${error.message}`);
    }
}
