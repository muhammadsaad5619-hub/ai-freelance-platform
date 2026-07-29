import {
  Brain,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsSection } from "@/components/ui/stats-section";
import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our intelligent algorithm connects you with the perfect freelancers or projects based on skills, experience, and preferences.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Escrow-protected transactions ensure both clients and freelancers are fully covered on every project.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Sparkles,
    title: "AI Proposal Writer",
    description:
      "Generate compelling, personalized proposals in seconds using advanced AI that understands project requirements.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Globe,
    title: "Global Talent Pool",
    description:
      "Access world-class freelancers from 150+ countries, vetted and ready to deliver exceptional results.",
    gradient: "from-blue-500 to-cyan-600",
  },
];



export default function Home() {
  return (
    <div className="relative">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-300 font-medium">
              AI-Powered Platform — Now in Beta
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-white">Find Talent.</span>
            <br />
            <span className="gradient-text">Powered by AI.</span>
          </h1>

          {/* Subheading */}
          <p
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            The next-generation freelancing platform where artificial
            intelligence meets human creativity. Connect, collaborate, and
            create without limits.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button size="lg" className="group">
              Start Hiring
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Find Work
            </Button>
          </div>

          {/* Stats Row */}
          <StatsSection />
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="gradient-text">succeed</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Powerful tools and intelligent features designed to streamline your
              freelancing workflow from start to finish.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 pt-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative glass rounded-2xl p-12 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px]" />

            <div className="relative">
              <div className="relative w-16 h-16 mx-auto mb-6 glow-md">
                <Image src="/logo.png" alt="FreelanceAI Logo" fill className="object-contain rounded-2xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of freelancers and clients who are already using
                AI to transform how they work together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button size="lg" className="group">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignUpButton>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
