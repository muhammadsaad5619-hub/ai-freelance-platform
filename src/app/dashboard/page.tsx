import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Star,
  TrendingUp,
  MessageSquare,
  FileText,
  Plus,
  Search,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const clerkUser = await currentUser();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const isFreelancer = dbUser?.role === "FREELANCER";
  const isClient = dbUser?.role === "CLIENT";
  const userName =
    dbUser?.name ||
    clerkUser?.firstName ||
    clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "there";

  const roleLabel = isFreelancer ? "Freelancer" : isClient ? "Client" : "User";
  const roleColor = isFreelancer
    ? "from-emerald-500 to-teal-600"
    : "from-violet-500 to-indigo-600";
  const roleBadgeBg = isFreelancer
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
    : "bg-violet-500/10 border-violet-500/30 text-violet-400";
  const RoleIcon = isFreelancer ? Briefcase : User;

  // Stats differ by role
  let stats = [];

  if (dbUser) {
    if (isFreelancer) {
      const [totalProposals, pendingProposals, acceptedProposals] = await Promise.all([
        prisma.proposal.count({ where: { freelancerId: dbUser.id } }),
        prisma.proposal.count({ where: { freelancerId: dbUser.id, status: "PENDING" } }),
        prisma.proposal.count({ where: { freelancerId: dbUser.id, status: "ACCEPTED" } }),
      ]);
      const successRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

      stats = [
        { title: "Total Proposals", value: totalProposals.toString(), sub: "Submitted proposals", icon: FileText, color: "text-violet-400" },
        { title: "Pending Proposals", value: pendingProposals.toString(), sub: "Awaiting response", icon: TrendingUp, color: "text-amber-400" },
        { title: "Accepted Proposals", value: acceptedProposals.toString(), sub: "Jobs won", icon: CheckCircle, color: "text-emerald-400" },
        { title: "Success Rate", value: `${successRate}%`, sub: "Accepted / Total", icon: Star, color: "text-blue-400" },
      ];
    } else if (isClient) {
      const [totalProjects, openProjects, inProgressProjects, totalProposalsReceived] = await Promise.all([
        prisma.project.count({ where: { clientId: dbUser.id } }),
        prisma.project.count({ where: { clientId: dbUser.id, status: "OPEN" } }),
        prisma.project.count({ where: { clientId: dbUser.id, status: "IN_PROGRESS" } }),
        prisma.proposal.count({ where: { project: { clientId: dbUser.id } } }),
      ]);

      stats = [
        { title: "Total Projects", value: totalProjects.toString(), sub: "Projects posted", icon: Briefcase, color: "text-violet-400" },
        { title: "Open Projects", value: openProjects.toString(), sub: "Accepting proposals", icon: Search, color: "text-amber-400" },
        { title: "In Progress", value: inProgressProjects.toString(), sub: "Active contracts", icon: CheckCircle, color: "text-blue-400" },
        { title: "Proposals Received", value: totalProposalsReceived.toString(), sub: "Across all projects", icon: FileText, color: "text-emerald-400" },
      ];
    }
  }

  const quickActions = isFreelancer
    ? [
        { label: "Find Work", href: "/find-work", icon: Search, desc: "Browse available projects", color: "from-violet-500 to-indigo-600" },
        { label: "My Proposals", href: "/my-proposals", icon: FileText, desc: "Track your proposals", color: "from-emerald-500 to-teal-600" },
        { label: "Messages", href: "/messages", icon: MessageSquare, desc: "View conversations", color: "from-blue-500 to-cyan-600" },
      ]
    : [
        { label: "Post a Project", href: "/projects", icon: Plus, desc: "Hire top freelancers", color: "from-violet-500 to-indigo-600" },
        { label: "Browse Talent", href: "/find-work", icon: Search, desc: "Find skilled freelancers", color: "from-emerald-500 to-teal-600" },
        { label: "Messages", href: "/messages", icon: MessageSquare, desc: "View conversations", color: "from-blue-500 to-cyan-600" },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-8">
        {/* Background glow */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${roleColor} opacity-10 blur-3xl`} />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar + Role Badge */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColor} flex items-center justify-center shadow-lg`}>
              <RoleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {userName}!
                </h1>
              </div>
              {/* Role Badge — most prominent element */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${roleBadgeBg}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                You are a <span className="font-bold">{roleLabel}</span>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <div className="sm:ml-auto">
            {isFreelancer ? (
              <Link href="/find-work">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 hover:opacity-90">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Projects
                </Button>
              </Link>
            ) : (
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-violet-500 to-indigo-600 border-0 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Project
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Role description */}
        <div className="relative mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400">
            {isFreelancer
              ? "🚀 As a Freelancer you can browse projects, submit proposals, and get hired by clients around the world."
              : "🎯 As a Client you can post projects, review proposals from talented freelancers, and manage your hiring workflow."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Overview</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-white/10 bg-white/5 hover:bg-white/8 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{action.label}</h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
