import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectCard } from "@/components/ui/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, Plus, FolderOpen } from "lucide-react";

export default async function ProjectsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) redirect("/onboarding");

  const isClient = dbUser.role === "CLIENT";

  // Client sees their own projects; Freelancer sees all OPEN projects
  const projects = await prisma.project.findMany({
    where: isClient
      ? { clientId: dbUser.id }
      : { status: "OPEN" },
    include: {
      client: {
        select: { name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pageTitle = isClient ? "My Projects" : "Open Projects";
  const pageDesc = isClient
    ? "Manage your posted projects"
    : "Browse available projects and submit proposals";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
              {projects.length > 0 && (
                <Badge variant="secondary">{projects.length}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{pageDesc}</p>
          </div>
        </div>

        {isClient && (
          <Link href="/projects/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Project Grid */}
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              budget={project.budget}
              skills={project.skills}
              status={project.status}
              createdAt={project.createdAt}
              client={{
                name: project.client.name,
                avatar: project.client.avatar,
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <FolderOpen className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-lg mb-2">
              {isClient ? "No projects yet" : "No open projects"}
            </CardTitle>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
              {isClient
                ? "Create your first project to start receiving proposals from talented freelancers."
                : "There are no open projects at the moment. Check back soon!"}
            </p>
            {isClient && (
              <Link href="/projects/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
