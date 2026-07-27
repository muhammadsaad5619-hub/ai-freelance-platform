import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  skills: string[];
  status: string;
  createdAt: Date;
  client: {
    name: string | null;
    avatar: string | null;
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "secondary" | "outline"; dotColor: string }> = {
  OPEN: { label: "Open", variant: "success", dotColor: "bg-emerald-400" },
  DRAFT: { label: "Draft", variant: "secondary", dotColor: "bg-gray-400" },
  IN_PROGRESS: { label: "In Progress", variant: "default", dotColor: "bg-violet-400" },
  COMPLETED: { label: "Completed", variant: "outline", dotColor: "bg-blue-400" },
  CANCELLED: { label: "Cancelled", variant: "secondary", dotColor: "bg-red-400" },
};

export function ProjectCard({
  id,
  title,
  description,
  budget,
  skills,
  status,
  createdAt,
  client,
}: ProjectCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.OPEN;
  const visibleSkills = skills.slice(0, 4);
  const extraSkillsCount = skills.length - visibleSkills.length;

  return (
    <Link href={`/projects/${id}`} className="group block">
      <Card className="h-full border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/5 overflow-hidden">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-violet-500/60 via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base font-semibold text-white leading-snug group-hover:text-violet-200 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <Badge variant={statusInfo.variant} className="shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} mr-1.5`} />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-gray-300"
                >
                  {skill}
                </span>
              ))}
              {extraSkillsCount > 0 && (
                <span className="inline-flex items-center rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                  +{extraSkillsCount} more
                </span>
              )}
            </div>
          )}

          {/* Footer: budget, time, client */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-4">
              {/* Budget */}
              {budget !== null && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">
                    {budget.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{getRelativeTime(createdAt)}</span>
              </div>
            </div>

            {/* Client */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center">
                <User className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 max-w-[100px] truncate">
                {client.name || "Anonymous"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
