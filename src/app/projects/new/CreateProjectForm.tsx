"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Loader2,
  DollarSign,
  Type,
  FileText,
  Tags,
  AlertCircle,
} from "lucide-react";

export function CreateProjectForm() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(formRef.current!);

    // Client-side validation
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const budgetVal = (formData.get("budget") as string)?.trim();

    if (!title || title.length < 5) {
      setError("Title must be at least 5 characters.");
      setLoading(false);
      return;
    }

    if (!description || description.length < 20) {
      setError("Description must be at least 20 characters.");
      setLoading(false);
      return;
    }

    if (!budgetVal || isNaN(Number(budgetVal)) || Number(budgetVal) <= 0) {
      setError("Budget is required and must be a valid positive number.");
      setLoading(false);
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one required skill.");
      setLoading(false);
      return;
    }

    formData.set("skills", skills.join(","));

    const result = await createProject(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If no error, the server action redirects automatically
  };

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardContent className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Title ── */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium text-gray-300"
            >
              <Type className="w-4 h-4 text-violet-400" />
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Build a Modern E-commerce Dashboard"
              className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200"
            />
          </div>

          {/* ── Description ── */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium text-gray-300"
            >
              <FileText className="w-4 h-4 text-violet-400" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Describe your project in detail — goals, deliverables, timeline expectations, and any technical requirements..."
              className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>

          {/* ── Budget ── */}
          <div className="space-y-2">
            <label
              htmlFor="budget"
              className="flex items-center gap-2 text-sm font-medium text-gray-300"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Budget (USD)
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                id="budget"
                name="budget"
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="5000"
                onKeyDown={(e) => {
                  // Block non-numeric keys (allow backspace, tab, arrows, delete, period)
                  if (
                    ["e", "E", "+", "-"].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 pl-8 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* ── Skills ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Tags className="w-4 h-4 text-amber-400" />
              Required Skills
              <span className="text-red-400 ml-1">*</span>
              <span className="text-gray-600 font-normal">
                — press Enter or comma to add
              </span>
            </label>
            <div
              className="flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 min-h-[48px] cursor-text focus-within:ring-2 focus-within:ring-violet-500/40 focus-within:border-violet-500/40 transition-all duration-200"
              onClick={() => skillInputRef.current?.focus()}
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg bg-violet-500/15 border border-violet-500/25 px-2.5 py-1 text-xs font-medium text-violet-300 animate-fade-in"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSkill(skill);
                    }}
                    className="ml-0.5 rounded-full hover:bg-violet-500/30 p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                ref={skillInputRef}
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={addSkill}
                placeholder={
                  skills.length === 0
                    ? "React, Node.js, TypeScript..."
                    : "Add more..."
                }
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm"
              />
            </div>
            {skills.length > 0 && (
              <p className="text-xs text-gray-600">
                {skills.length} skill{skills.length !== 1 ? "s" : ""} added
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Project"
              )}
            </Button>
            <p className="text-xs text-gray-600 text-center mt-3">
              Your project will be immediately visible to freelancers.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
