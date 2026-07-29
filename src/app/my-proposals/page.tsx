import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Calendar, DollarSign, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function MyProposalsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) redirect("/onboarding");

  if (dbUser.role !== "FREELANCER") {
    redirect("/dashboard");
  }

  const proposals = await prisma.proposal.findMany({
    where: { freelancerId: dbUser.id },
    include: {
      project: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Accepted
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Proposals</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track all the proposals you have submitted across projects.
          </p>
        </div>
      </div>

      {/* Proposals Grid */}
      {proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {proposal.project.title}
                      </h3>
                      <div className="md:hidden">
                        {getStatusBadge(proposal.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-gray-300">${proposal.bidAmount}</span> bid
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-300">{proposal.deliveryDays}</span> days delivery
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-violet-500" />
                        <span>Submitted on {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0">
                    <div className="hidden md:block">
                      {getStatusBadge(proposal.status)}
                    </div>
                    <Link href={`/projects/${proposal.projectId}`}>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 border border-white/5">
                        View Project
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/20">
              <FileText className="w-8 h-8 text-emerald-500" />
            </div>
            <CardTitle className="text-xl mb-2 text-white">No proposals yet</CardTitle>
            <p className="text-gray-400 mb-6 max-w-sm">
              You haven't submitted any proposals yet. Browse available projects to start earning!
            </p>
            <Link href="/find-work">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
                Browse Projects
              </div>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
