"use client";

import { useState, useRef } from "react";
import { submitProposal } from "@/app/actions/projects";
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
} from "lucide-react";

interface SubmitProposalSectionProps {
  projectId: string;
  alreadySubmitted: boolean;
  projectBudget: number | null;
}

export function SubmitProposalSection({
  projectId,
  alreadySubmitted,
  projectBudget,
}: SubmitProposalSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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
                  id="coverLetter"
                  name="coverLetter"
                  required
                  rows={4}
                  placeholder="Introduce yourself, explain why you're a great fit for this project, and outline your approach..."
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200 resize-none leading-relaxed text-sm"
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
