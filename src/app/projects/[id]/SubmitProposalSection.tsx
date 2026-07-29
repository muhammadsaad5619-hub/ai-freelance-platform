"use client";

import { useState, useRef } from "react";
import { submitProposal } from "@/app/actions/projects";
import { generateProposal } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Send,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface SubmitProposalSectionProps {
  projectId: string;
  alreadySubmitted: boolean;
  projectBudget: number | null;
  projectTitle: string;
  projectDescription: string;
  projectSkills: string[];
}

export function SubmitProposalSection({
  projectId,
  alreadySubmitted,
  projectBudget,
  projectTitle,
  projectDescription,
  projectSkills,
}: SubmitProposalSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiSuccess, setAiSuccess] = useState(false);
  const [showAiForm, setShowAiForm] = useState(false);
  const [freelancerSkills, setFreelancerSkills] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-emerald-300">Proposal Submitted</p>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              The client will review your proposal and get back to you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateAI = async () => {
    if (!freelancerSkills.trim()) {
      setError("Please describe your skills and experience first.");
      return;
    }

    setAiLoading(true);
    setError("");
    setAiSuccess(false);

    try {
      const result = await generateProposal({
        projectTitle,
        projectDescription,
        projectSkills,
        projectBudget,
        freelancerSkillsAndExperience: freelancerSkills,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.proposal) {
        // Populate the textarea with the AI-generated proposal
        if (textareaRef.current) {
          textareaRef.current.value = result.proposal;
          // Trigger a visual highlight to show the textarea was populated
          setAiSuccess(true);
          setShowAiForm(false);
          setTimeout(() => setAiSuccess(false), 3000);
        }
      }
    } catch {
      setError("Failed to generate proposal. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(formRef.current!);
    formData.set("projectId", projectId);

    // Client-side validation
    const coverLetter = (formData.get("coverLetter") as string)?.trim();
    const bidAmount = (formData.get("bidAmount") as string)?.trim();
    const deliveryDays = (formData.get("deliveryDays") as string)?.trim();

    if (!coverLetter || coverLetter.length < 20) {
      setError("Cover letter must be at least 20 characters.");
      setLoading(false);
      return;
    }
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      setError("Bid amount must be a valid positive number.");
      setLoading(false);
      return;
    }
    if (
      !deliveryDays ||
      isNaN(Number(deliveryDays)) ||
      Number(deliveryDays) <= 0
    ) {
      setError("Delivery days must be a valid positive number.");
      setLoading(false);
      return;
    }

    const result = await submitProposal(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={() => setShowForm(!showForm)}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Proposal
        {showForm ? (
          <ChevronUp className="w-4 h-4 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-2" />
        )}
      </Button>

      {/* Proposal Form */}
      {showForm && (
        <Card className="border-white/10 bg-white/[0.03] animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* AI Success Banner */}
              {aiSuccess && (
                <div className="flex items-start gap-3 rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3 text-sm text-violet-300 animate-in fade-in duration-300">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  AI proposal generated! Review and edit it before submitting.
                </div>
              )}

              {/* AI Generate Button / Form */}
              {!showAiForm ? (
                <button
                  type="button"
                  onClick={() => setShowAiForm(true)}
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 px-4 py-3.5 text-sm font-medium text-violet-300 transition-all duration-300 hover:border-violet-500/50 hover:from-violet-500/20 hover:via-indigo-500/20 hover:to-purple-500/20 hover:text-violet-200 hover:shadow-lg hover:shadow-violet-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/5 to-violet-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Proposal with AI</span>
                  </div>
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-violet-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Briefly describe your relevant skills and experience
                    </label>
                    <textarea
                      value={freelancerSkills}
                      onChange={(e) => setFreelancerSkills(e.target.value)}
                      rows={3}
                      placeholder="e.g. 3 years experience in React and Node.js or Math tutor, strong in statistics, no coding background..."
                      className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-300 resize-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={aiLoading || !freelancerSkills.trim()}
                      className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAiForm(false)}
                      disabled={aiLoading}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              <div className="space-y-2">
                <label
                  htmlFor="coverLetter"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300"
                >
                  <FileText className="w-4 h-4 text-violet-400" />
                  Cover Letter
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  id="coverLetter"
                  name="coverLetter"
                  required
                  rows={6}
                  placeholder="Introduce yourself, explain why you're a great fit for this project, and outline your approach..."
                  className={`w-full rounded-xl bg-white/[0.05] border px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-300 resize-none leading-relaxed text-sm ${
                    aiSuccess
                      ? "border-violet-500/40 ring-2 ring-violet-500/20 bg-violet-500/5"
                      : "border-white/10"
                  }`}
                />
              </div>

              {/* Bid Amount + Delivery Days Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Bid Amount */}
                <div className="space-y-2">
                  <label
                    htmlFor="bidAmount"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Bid Amount (USD)
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      id="bidAmount"
                      name="bidAmount"
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      placeholder={
                        projectBudget
                          ? projectBudget.toString()
                          : "1000"
                      }
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full rounded-xl bg-white/[0.05] border border-white/10 pl-8 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                {/* Delivery Days */}
                <div className="space-y-2">
                  <label
                    htmlFor="deliveryDays"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    Delivery (days)
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="deliveryDays"
                    name="deliveryDays"
                    type="number"
                    required
                    min="1"
                    step="1"
                    placeholder="14"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
