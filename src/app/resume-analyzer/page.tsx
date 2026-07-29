import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ResumeAnalyzerClient from "./ResumeAnalyzerClient";
import { FileText } from "lucide-react";

export default async function ResumeAnalyzerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) redirect("/onboarding");
  if (dbUser.role !== "FREELANCER") redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Resume Analyzer</h1>
          <p className="text-sm text-gray-400 mt-1">
            Get instant feedback on your resume using our AI model.
          </p>
        </div>
      </div>

      <ResumeAnalyzerClient />
    </div>
  );
}
