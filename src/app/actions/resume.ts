"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText, getDocumentProxy } from "unpdf";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

const RESUME_SYSTEM_PROMPT =
  'You are an expert resume reviewer for freelance/tech job seekers. Analyze the following resume text and respond ONLY with valid JSON in this exact format: {"score": number (0-100), "strengths": [string, string, string], "weaknesses": [string, string, string], "suggestions": [string, string, string]}. Do not include any text outside the JSON.';

export async function extractPdfText(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in." };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided." };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text } = await extractText(pdf);
    const parsedText = Array.isArray(text) ? text.join("\n") : text;

    if (!parsedText || parsedText.trim() === "") {
      return { error: "Could not extract text. This might be a scanned image or corrupted PDF. Please paste your resume text manually." };
    }

    return { success: true, text: parsedText.trim() };
  } catch (error) {
    console.error("PDF parse error:", error);
    return { error: "Failed to parse PDF. Please paste your resume text manually." };
  }
}

export async function analyzeResume(resumeText: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in." };

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) return { error: "User not found in database." };
  if (dbUser.role !== "FREELANCER") {
    return { error: "Only freelancers can use the resume analyzer." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "AI service is not configured. Missing GEMINI_API_KEY." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: RESUME_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(resumeText);
    const response = result.response;
    let text = response.text();

    if (!text) {
      return { error: "AI returned an empty response. Please try again." };
    }

    // Clean up potential markdown formatting in JSON response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Log to AIHistory table
    await prisma.aIHistory.create({
      data: {
        userId: dbUser.id,
        prompt: `[System]: ${RESUME_SYSTEM_PROMPT}\n\n[User]:\n${resumeText}`,
        response: text,
        model: GEMINI_MODEL,
        context: "resume_analysis",
      },
    });

    return { success: true, analysis: JSON.parse(text) };
  } catch (error: unknown) {
    console.error("Resume analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      error: `Failed to analyze resume: ${message}`,
    };
  }
}
