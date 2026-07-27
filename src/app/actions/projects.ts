"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const budgetStr = (formData.get("budget") as string)?.trim();
  const budget = budgetStr ? parseFloat(budgetStr) : null;
  const skillsRaw = formData.get("skills") as string;
  const skills = skillsRaw
    ? skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // ── Validation ──
  if (!title || title.length < 5) {
    return { error: "Title must be at least 5 characters." };
  }
  if (!description || description.length < 20) {
    return { error: "Description must be at least 20 characters." };
  }
  if (budget === null || isNaN(budget) || budget <= 0) {
    return { error: "Budget is required and must be a positive number." };
  }
  if (skills.length === 0) {
    return { error: "At least one skill is required." };
  }

  // ── Auth check ──
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) return { error: "User not found in database." };
  if (dbUser.role !== "CLIENT") {
    return { error: "Only clients can post projects." };
  }

  // ── Create ──
  let projectId: string;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        skills,
        status: "OPEN",
        clientId: dbUser.id,
      },
    });
    projectId = project.id;
  } catch (error) {
    console.error("Create project error:", error);
    return { error: "Failed to create project. Please try again." };
  }

  revalidatePath("/projects");
  revalidatePath("/find-work");
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}`);
}

export async function submitProposal(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in." };

  const projectId = (formData.get("projectId") as string)?.trim();
  const coverLetter = (formData.get("coverLetter") as string)?.trim();
  const bidAmountStr = (formData.get("bidAmount") as string)?.trim();
  const deliveryDaysStr = (formData.get("deliveryDays") as string)?.trim();

  const bidAmount = bidAmountStr ? parseFloat(bidAmountStr) : null;
  const deliveryDays = deliveryDaysStr ? parseInt(deliveryDaysStr, 10) : null;

  // ── Validation ──
  if (!projectId) {
    return { error: "Project ID is missing." };
  }
  if (!coverLetter || coverLetter.length < 20) {
    return { error: "Cover letter must be at least 20 characters." };
  }
  if (bidAmount === null || isNaN(bidAmount) || bidAmount <= 0) {
    return { error: "Bid amount must be a positive number." };
  }
  if (deliveryDays === null || isNaN(deliveryDays) || deliveryDays <= 0) {
    return { error: "Delivery days must be a positive number." };
  }

  // ── Auth check ──
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) return { error: "User not found in database." };
  if (dbUser.role !== "FREELANCER") {
    return { error: "Only freelancers can submit proposals." };
  }

  // ── Check project exists and is open ──
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { status: true, clientId: true },
  });

  if (!project) return { error: "Project not found." };
  if (project.status !== "OPEN") {
    return { error: "This project is no longer accepting proposals." };
  }
  if (project.clientId === dbUser.id) {
    return { error: "You cannot submit a proposal to your own project." };
  }

  // ── Check for existing proposal ──
  const existing = await prisma.proposal.findUnique({
    where: {
      projectId_freelancerId: {
        projectId,
        freelancerId: dbUser.id,
      },
    },
  });

  if (existing) {
    return { error: "You have already submitted a proposal for this project." };
  }

  // ── Create ──
  try {
    await prisma.proposal.create({
      data: {
        projectId,
        freelancerId: dbUser.id,
        coverLetter,
        bidAmount,
        deliveryDays,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Submit proposal error:", error);
    return { error: "Failed to submit proposal. Please try again." };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/find-work");
  return { success: true };
}
