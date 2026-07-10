import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-sm text-gray-500">Manage your projects</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-gray-600" />
          </div>
          <CardTitle className="text-lg mb-2">No projects yet</CardTitle>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
            Create your first project to start receiving proposals from talented freelancers.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
