import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function FindWorkPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Find Work</h1>
          <p className="text-sm text-gray-500">Browse available projects</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass rounded-xl p-2 mb-8 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-500 ml-3" />
        <input
          type="text"
          placeholder="Search projects by title, skill, or keyword..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-2 px-2"
          disabled
        />
        <Button size="sm">Search</Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <CardTitle className="text-lg mb-2">No projects available</CardTitle>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Projects posted by clients will appear here. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
