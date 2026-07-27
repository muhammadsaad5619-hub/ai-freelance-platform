"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Use a global prisma client to prevent connection limit in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not logged in" };

  const role = formData.get("role") as string;
  if (role !== "CLIENT" && role !== "FREELANCER") {
    return { error: "Invalid role selected." };
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) return { error: "No email address found for this user." };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
          role: role as "CLIENT" | "FREELANCER",
          avatar: user.imageUrl,
        }
      });
    }

    // Store the userId in the cookie so the middleware can validate it per-user
    cookies().set("onboarded", userId, { maxAge: 60 * 60 * 24 * 365 });

  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Failed to create user account." };
  }

  redirect("/dashboard");
}

export async function syncOnboardingCookie() {
  const { userId } = await auth();
  if (!userId) return;
  cookies().set("onboarded", userId, { maxAge: 60 * 60 * 24 * 365 });
  redirect("/dashboard");
}
