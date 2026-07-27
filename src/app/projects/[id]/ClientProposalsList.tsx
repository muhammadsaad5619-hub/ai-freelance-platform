"use client";

import { useState } from "react";
import { acceptProposal, rejectProposal } from "@/app/actions/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, User, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Proposal {
  id: string;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  status: string;
  createdAt: Date;
  freelancer: {
    name: string | null;
    avatar: string | null;
  };
}

interface ClientProposalsListProps {
  projectId: string;
  proposals: Proposal[];
  projectStatus: string;
}

export function ClientProposalsList({
  projectId,
  proposals,
  projectStatus,
}: ClientProposalsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (proposalId: string) => {
    setLoadingId(proposalId);
    await acceptProposal(proposalId, projectId);
    setLoadingId(null);
  };

  const handleReject = async (proposalId: string) => {
    setLoadingId(proposalId);
    await rejectProposal(proposalId, projectId);
    setLoadingId(null);
  };

  if (proposals.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6">Proposals Received</h2>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center">
              No proposals have been submitted for this project yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-xl font-bold text-white">Proposals Received ({proposals.length})</h2>
      
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="border-white/10 bg-white/[0.03] overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Freelancer Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">
                      {proposal.freelancer.name || "Anonymous Freelancer"}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {proposal.status === "PENDING" && <Badge variant="warning">Pending</Badge>}
                  {proposal.status === "ACCEPTED" && <Badge variant="success">Accepted</Badge>}
                  {proposal.status === "REJECTED" && <Badge variant="secondary">Rejected</Badge>}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Cover Letter (Takes up 2/3 on md screens) */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Letter</h3>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {proposal.coverLetter}
                  </p>
                </div>

                {/* Meta details & Actions (Takes up 1/3 on md screens) */}
                <div className="space-y-6">
                  <div className="space-y-3.5 bg-white/5 rounded-xl p-5 border border-white/[0.05]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Bid</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400 text-right whitespace-nowrap">
                        ${proposal.bidAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Delivery</span>
                      </div>
                      <span className="text-sm font-semibold text-white text-right whitespace-nowrap">
                        {proposal.deliveryDays} days
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {projectStatus === "OPEN" && proposal.status === "PENDING" && (
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={loadingId === proposal.id}
                        onClick={() => handleAccept(proposal.id)}
                      >
                        {loadingId === proposal.id ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        )}
                        Accept Proposal
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        disabled={loadingId === proposal.id}
                        onClick={() => handleReject(proposal.id)}
                      >
                        {loadingId === proposal.id ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1.5" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
