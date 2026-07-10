import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm text-gray-500">Your conversations</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-gray-600" />
          </div>
          <CardTitle className="text-lg mb-2">No messages yet</CardTitle>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Start a conversation by accepting a proposal or reaching out on a project.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
