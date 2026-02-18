"use client";

import {
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  User,
  Tag,
} from "lucide-react";

import { ShieldAlert, BookOpen, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { StatusBadge } from "./StatusBadge";
import RiskAnalysisCard from "./RiskAnalysisCard";
import { useState } from "react";
import SummaryCard from "./SummaryCard";
import { updateStatus, analyzeRisk, summarizeDocument } from "@/lib/api";


interface Approval {
  approver?: string;
  date?: string;
  comment?: string;
}

// ✅ Document structure
interface DocumentData {
  id: number;
  title: string;
  code: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  category: string;
  status: string;
  tags: string[];
  description: string;
  approvals: Approval[];
}

interface DocumentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any | null;
  onActionSuccess: () => void;
}

const riskColors: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
  critical: "text-destructive",
};

const riskBg: Record<string, string> = {
  low: "bg-success/10",
  medium: "bg-warning/10",
  high: "bg-destructive/10",
  critical: "bg-destructive/20",
};

export function DocumentDetailDialog({
  document: doc,
  open,
  onOpenChange,
  onActionSuccess,
}: DocumentDetailDialogProps) {

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  if (!doc) return null;

   async function handleAnalyzeRisk() {
      if (!doc) return;
      try {
        setLoadingRisk(true);
        const response = await analyzeRisk(doc.id);
        setAiResponse(response);
      } catch (err) {
        console.error("Risk analysis failed:", err);
      } finally {
        setLoadingRisk(false);
      }
    }

    const handleGenerateSummary = async () => {
      setLoadingSummary(true);
      try {
        const result = await summarizeDocument(doc.id);
        setSummary(result.data); // <--- assign the `data` object from API response
      } finally {
        setLoadingSummary(false);
      }
    };


  const approvals = doc.approvals ?? doc.comments ?? [];
  const tags = doc.tags ?? [];

  async function handleAction(status: "approve" | "reject") {
    try {
      setLoading(true);

      await updateStatus(doc.id, status);

      await onActionSuccess();
      onOpenChange(false);

    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-display text-lg">
                {(doc.title ?? doc.name ?? "Untitled").replace(/\.[^/.]+$/, "")}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {doc.code ?? `DOC-${doc.id}`}
              </p>
            </div>
            <StatusBadge status={doc.status ?? "pending"} />
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm">

            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              Uploaded by
              <span className="text-foreground font-medium">
                {doc.uploadedBy ?? "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {doc.uploadedAt ? new Date(doc.uploadedAt).toISOString().split("T")[0] : ""}
            </div>
    
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : "N/A"} · {doc.category ?? "Document"}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <div className="flex gap-1 flex-wrap">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

          </div>

          {/* Description */}
          <p className="text-sm">{doc.description ?? "No description."}</p>

          <Separator />

          {/* AI Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleAnalyzeRisk}>
              {loadingRisk ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              Analyze Risk
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleGenerateSummary}>
              {loadingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              Generate Summary
            </Button>
          </div>
          <Separator /> 
          {/* Risk Analysis Result */}
          {aiResponse?.data && (
            <RiskAnalysisCard riskData={aiResponse.data} />
          )}
          {/* --- Document Summary --- */}
          {summary && summary.summary && (
            <SummaryCard summaryData={summary} />
          )}
          <Separator />

          {/* Approval History */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Approval History</h4>

            {approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No review comments yet.
              </p>
            ) : (
              <div className="space-y-4">
                {approvals.map((c: any, i: number) => {
                  const action = c.action ?? "approved";

                  return (
                    <div key={i} className="flex gap-3 text-sm">
                      {/* Icon */}
                      <div className="mt-1">
                        {action === "approve" && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {action === "reject" && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {action !== "approve" && action !== "reject" && (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <p>
                          <span className="font-medium">
                            {c.approver ?? c.author ?? "Reviewer"}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {c.date ?? c.createdAt ?? "—"}
                          </span>
                        </p>

                        <p className="text-muted-foreground mt-1">
                          {c.comment ?? c.text ?? ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Approval Actions */}
          {doc.status === "pending" && (
            <>
              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Review Document
                </h4>

                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                />

                <div className="flex gap-3">

                  <Button
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      const result = await updateStatus(Number(doc.id), "approve");
                      if (result.success) {
                        await onActionSuccess();
                        onOpenChange(false);
                      } else {
                        console.error(result.message);
                        alert(result.message); // or show UI toast
                      }
                      setLoading(false);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {loading ? "Processing..." : "Approve"}
                  </Button>

                  <Button
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    const result = await updateStatus(Number(doc.id), "reject");
                    if (result.success) {
                      await onActionSuccess();
                      onOpenChange(false);
                    } else {
                      console.error(result.message);
                      alert(result.message); // or show UI toast
                    }
                    setLoading(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  {loading ? "Processing..." : "Reject"}
                </Button>

                </div>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
