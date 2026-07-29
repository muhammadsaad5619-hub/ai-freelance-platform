"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT =
  "You are an expert freelance proposal writer. Using the freelancer's stated skills and experience below, write an honest, professional cover letter proposal for this project. If their skills clearly do not match the project's requirements, write a proposal that honestly reflects this mismatch or highlights only genuinely transferable skills, rather than inventing unrelated expertise.";

interface GenerateProposalInput {
  projectTitle: string;
  projectDescription: string;
  projectSkills: string[];
  projectBudget: number | null;
  freelancerSkillsAndExperience: string;
}

export async function generateProposal(input: GenerateProposalInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in." };

  // ── Auth & role check ──
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) return { error: "User not found in database." };
  if (dbUser.role !== "FREELANCER") {
    return { error: "Only freelancers can generate proposals." };
  }

  // ── Build the user prompt ──
  let userPrompt = `Project Title: ${input.projectTitle}\n`;
  userPrompt += `Project Description: ${input.projectDescription}\n`;
  userPrompt += `Required Skills: ${input.projectSkills.join(", ")}\n`;
  if (input.projectBudget) {
    userPrompt += `Budget: $${input.projectBudget.toLocaleString()}\n`;
  }

  // Include freelancer's stated skills and experience
  userPrompt += `\n--- Freelancer Skills & Experience ---\n`;
  userPrompt += `${input.freelancerSkillsAndExperience}\n`;

  userPrompt += `\nWrite a professional cover letter proposal for this project based on the above information.`;

  // ── Call Gemini API ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "AI service is not configured. Missing GEMINI_API_KEY." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return { error: "AI returned an empty response. Please try again." };
    }

    // ── Log to AIHistory table ──
    await prisma.aIHistory.create({
      data: {
        userId: dbUser.id,
        prompt: `[System]: ${SYSTEM_PROMPT}\n\n[User]: ${userPrompt}`,
        response: text,
        model: GEMINI_MODEL,
        context: "proposal_generation",
      },
    });

    return { success: true, proposal: text };
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      error: `Failed to generate proposal: ${message}`,
    };
  }
}
