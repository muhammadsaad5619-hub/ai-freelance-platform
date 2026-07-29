"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Sparkles, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { extractPdfText, analyzeResume } from "@/app/actions/resume";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function ResumeAnalyzerClient() {
  const [resumeText, setResumeText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await extractPdfText(formData);

    setIsExtracting(false);

    if (response.error) {
      setError(response.error);
    } else if (response.text) {
      setResumeText(response.text);
    }
    
    // Reset file input
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste or upload your resume text first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const response = await analyzeResume(resumeText);

    setIsAnalyzing(false);

    if (response.error) {
      setError(response.error);
    } else if (response.analysis) {
      setResult(response.analysis);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };
  
  const getScoreBadgeBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Input Resume</CardTitle>
          <CardDescription>Upload a PDF or paste your resume text manually.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block w-full border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 hover:border-white/30 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={isExtracting || isAnalyzing}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                {isExtracting ? (
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-300">
                    {isExtracting ? "Extracting text..." : "Click or drag to upload PDF"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
                </div>
              </div>
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-gray-500">Or paste text</span>
            </div>
          </div>

          <Textarea 
            placeholder="Paste your resume text here..." 
            className="min-h-[250px] bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isExtracting || isAnalyzing}
          />

          {error && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
            onClick={handleAnalyze}
            disabled={isExtracting || isAnalyzing || !resumeText.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-white/10 bg-white/5 overflow-hidden">
          {/* Top glow */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Analysis Results</h2>
                <p className="text-gray-400 text-sm">Here is what our AI thinks of your resume.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={cn("text-5xl font-extrabold tracking-tighter", getScoreColor(result.score))}>
                  {result.score}<span className="text-2xl text-gray-500">/100</span>
                </div>
                <div className={cn("mt-2 px-3 py-1 rounded-full border text-xs font-semibold", getScoreBadgeBg(result.score), getScoreColor(result.score))}>
                  {result.score >= 80 ? "Excellent" : result.score >= 50 ? "Needs Work" : "Requires Overhaul"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-white">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {result.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-white">Weaknesses</h3>
                </div>
                <ul className="space-y-3">
                  {result.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="md:col-span-2 space-y-4 pt-6 mt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-white">Actionable Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {result.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
