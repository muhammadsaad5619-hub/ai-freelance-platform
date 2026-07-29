import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SubmitProposalSection } from "./SubmitProposalSection";
import { ClientProposalsList } from "./ClientProposalsList";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  User,
  Calendar,
  Briefcase,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "success" | "warning" | "secondary" | "outline";
    dotColor: string;
    bgColor: string;
  }
> = {
  OPEN: {
    label: "Open",
    variant: "success",
    dotColor: "bg-emerald-400",
    bgColor: "from-emerald-500 to-teal-600",
  },
  DRAFT: {
    label: "Draft",
    variant: "secondary",
    dotColor: "bg-gray-400",
    bgColor: "from-gray-500 to-gray-600",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default",
    dotColor: "bg-violet-400",
    bgColor: "from-violet-500 to-indigo-600",
  },
  COMPLETED: {
    label: "Completed",
    variant: "outline",
    dotColor: "bg-blue-400",
    bgColor: "from-blue-500 to-cyan-600",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "secondary",
    dotColor: "bg-red-400",
    bgColor: "from-red-500 to-rose-600",
  },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  return "Just now";
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          proposals: true,
        },
      },
      proposals: {
        include: {
          freelancer: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const statusInfo = statusConfig[project.status] || statusConfig.OPEN;

  // Check viewer's identity, role, and existing proposals
  let isOwner = false;
  let isFreelancer = false;
  let hasSubmittedProposal = false;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    });

    if (dbUser) {
      isOwner = dbUser.id === project.clientId;
      isFreelancer = dbUser.role === "FREELANCER";

      if (isFreelancer) {
        const existingProposal = await prisma.proposal.findUnique({
          where: {
            projectId_freelancerId: {
              projectId: project.id,
              freelancerId: dbUser.id,
            },
          },
          select: { id: true },
        });
        hasSubmittedProposal = !!existingProposal;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* ── Header Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-8 mb-6">
        {/* Background glow */}
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${statusInfo.bgColor} opacity-10 blur-3xl`}
        />

        <div className="relative">
          {/* Status + Time Row */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
              <span
                className={`w-2 h-2 rounded-full ${statusInfo.dotColor} mr-2`}
              />
              {statusInfo.label}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Posted {getRelativeTime(project.createdAt)}
            </span>
            {isOwner && (
              <Badge variant="warning" className="text-sm px-3 py-1">
                Your Project
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-5 mt-4">
            {project.budget !== null && (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-lg font-bold">
                  {project.budget.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">USD</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-gray-400">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">
                {project._count.proposals} proposal
                {project._count.proposals !== 1 ? "s" : ""}
              </span>
            </div>

            {project.deadline && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Due {formatDate(project.deadline)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Project Description
              </h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {project.skills.length > 0 && (
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} className="text-sm px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proposals List (Clients only) */}
          {isOwner && (
            <ClientProposalsList
              projectId={project.id}
              proposals={project.proposals}
              projectStatus={project.status}
            />
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                About the Client
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {project.client.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Member since {formatDate(project.client.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Project Details
              </h2>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant={statusInfo.variant}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} mr-1.5`}
                  />
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Budget</span>
                <span className="text-white font-medium">
                  {project.budget
                    ? `$${project.budget.toLocaleString()}`
                    : "Negotiable"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Proposals</span>
                <span className="text-white font-medium">
                  {project._count.proposals}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Posted</span>
                <span className="text-white font-medium">
                  {formatDate(project.createdAt)}
                </span>
              </div>

              {project.deadline && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Deadline</span>
                  <span className="text-white font-medium">
                    {formatDate(project.deadline)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action — Submit Proposal (freelancers only) */}
          {!isOwner && isFreelancer && project.status === "OPEN" && (
            <SubmitProposalSection
              projectId={project.id}
              alreadySubmitted={hasSubmittedProposal}
              projectBudget={project.budget}
              projectTitle={project.title}
              projectDescription={project.description}
              projectSkills={project.skills}
            />
          )}
        </div>
      </div>
    </div>
  );
}
