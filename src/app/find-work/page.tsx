import prisma from "@/lib/prisma";
import { ProjectCard } from "@/components/ui/project-card";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase } from "lucide-react";

export default async function FindWorkPage() {
  const projects = await prisma.project.findMany({
    where: { status: "OPEN" },
    include: {
      client: {
        select: { name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Find Work</h1>
            {projects.length > 0 && (
              <Badge variant="success">{projects.length} open</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Browse available projects and find your next opportunity
          </p>
        </div>
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
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-lg mb-2">
              No open projects yet
            </CardTitle>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Projects posted by clients will appear here. Check back soon for
              new opportunities!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
