import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { completeOnboarding } from "../actions/onboarding";
import { AutoSyncCookie } from "./AutoSyncCookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  // Check if user already exists in the database
  const userInDb = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (userInDb) {
    // If they exist but somehow landed here (e.g. cookie was cleared), 
    // sync the cookie and redirect to dashboard via a Client Component
    return <AutoSyncCookie />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to FreelanceAI</CardTitle>
          <CardDescription className="text-lg mt-2">
            How would you like to use the platform?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData: FormData) => {
              "use server";
              await completeOnboarding(formData);
            }} className="space-y-6 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Client Option */}
              <label className="relative cursor-pointer">
                <input type="radio" name="role" value="CLIENT" className="peer sr-only" required />
                <div className="h-full rounded-xl border-2 border-white/10 bg-white/5 p-6 hover:bg-white/10 peer-checked:border-violet-500 peer-checked:bg-violet-500/10 transition-all text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">I&apos;m a Client</h3>
                  <p className="text-sm text-gray-400">
                    I want to hire talent and manage projects
                  </p>
                </div>
              </label>

              {/* Freelancer Option */}
              <label className="relative cursor-pointer">
                <input type="radio" name="role" value="FREELANCER" className="peer sr-only" required />
                <div className="h-full rounded-xl border-2 border-white/10 bg-white/5 p-6 hover:bg-white/10 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">I&apos;m a Freelancer</h3>
                  <p className="text-sm text-gray-400">
                    I want to find work and submit proposals
                  </p>
                </div>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
