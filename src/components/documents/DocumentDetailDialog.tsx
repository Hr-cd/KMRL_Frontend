import { CheckCircle2, XCircle, FileText, Calendar, User, Tag, ShieldAlert, BookOpen, Loader2 } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import type { KMRLDocument } from "@/lib/mock-data";
import { analyzeDocumentRisk, generateDocumentSummary, type RiskAnalysisResult, type DocumentSummary } from "@/lib/api";
import { useState } from "react";

interface Props {
  document: KMRLDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function DocumentDetailDialog({ document: doc, open, onOpenChange }: Props) {
  const [comment, setComment] = useState("");
  const [risk, setRisk] = useState<RiskAnalysisResult | null>(null);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  if (!doc) return null;

  const handleAnalyzeRisk = async () => {
    setLoadingRisk(true);
    try {
      const result = await analyzeDocumentRisk(doc.id);
      setRisk(result);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const result = await generateDocumentSummary(doc.id);
      setSummary(result);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setRisk(null); setSummary(null); } }}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-display text-lg">{doc.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{doc.id}</p>
            </div>
            <StatusBadge status={doc.status} />
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" /> <span>Uploaded by <span className="text-foreground font-medium">{doc.uploadedBy}</span></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> <span>{doc.uploadedAt}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" /> <span>{doc.fileSize} · {doc.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <div className="flex gap-1 flex-wrap">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm">{doc.description}</p>

          {/* AI Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleAnalyzeRisk} disabled={loadingRisk}>
              {loadingRisk ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              Analyze Risk
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleGenerateSummary} disabled={loadingSummary}>
              {loadingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              Generate Summary
            </Button>
          </div>

          {/* Risk Analysis Result */}
          {risk && (
            <Card className={`p-4 space-y-3 ${riskBg[risk.riskLevel]}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <ShieldAlert className={`h-4 w-4 ${riskColors[risk.riskLevel]}`} />
                  Risk Assessment
                </h4>
                <Badge variant="outline" className={riskColors[risk.riskLevel]}>
                  {risk.riskLevel.toUpperCase()} — {risk.score}/100
                </Badge>
              </div>
              <Progress value={risk.score} className="h-2" />
              <div className="space-y-2">
                {risk.factors.map((f, i) => (
                  <div key={i} className="text-sm">
                    <span className={`font-medium ${riskColors[f.severity]}`}>{f.label}:</span>{" "}
                    <span className="text-muted-foreground">{f.detail}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">💡 {risk.recommendation}</p>
            </Card>
          )}

          {/* Summary Result */}
          {summary && (
            <Card className="p-4 space-y-3 bg-primary/5">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Document Summary
                <Badge variant="secondary" className="text-xs ml-auto">{summary.wordCount} words</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Points</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {summary.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          <Separator />

          {/* Comments Timeline */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Approval History</h4>
            {doc.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No review comments yet.</p>
            ) : (
              <div className="space-y-3">
                {doc.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 text-sm">
                    <div className="mt-0.5">
                      {c.action === "approved" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : c.action === "rejected" ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{c.author}</span>{" "}
                        <span className="text-muted-foreground">· {c.createdAt}</span>
                      </p>
                      <p className="text-muted-foreground mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approval Actions */}
          {doc.status === "pending" && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Review Document</h4>
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-3">
                  <Button className="gap-2 bg-success hover:bg-success/90">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" /> Reject
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