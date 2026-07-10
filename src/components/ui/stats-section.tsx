"use client";

import { Users, TrendingUp, Star, Globe } from "lucide-react";
import { CountUp } from "./count-up";

const stats = [
  { label: "Active Freelancers", value: 50, suffix: "K+", icon: Users },
  { label: "Projects Completed", value: 120, suffix: "K+", icon: TrendingUp },
  { label: "Average Rating", value: 4.9, suffix: "", decimals: 1, icon: Star },
  { label: "Countries", value: 150, suffix: "+", icon: Globe },
];

export function StatsSection() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto animate-fade-in-up"
      style={{ animationDelay: "0.4s" }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 p-4"
        >
          <stat.icon className="w-5 h-5 text-violet-400 mb-1" />
          <span className="text-2xl font-bold text-white">
            <CountUp
              end={stat.value}
              suffix={stat.suffix}
              duration={2000}
              decimals={"decimals" in stat ? stat.decimals : 0}
            />
          </span>
          <span className="text-xs text-gray-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
