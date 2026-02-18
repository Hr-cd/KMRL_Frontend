import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldAlert } from "lucide-react";

interface RiskAnalysisCardProps {
  riskData: {
    doc_id: number;
    risk_analysis: string; // the long AI response
  };
}

export default function RiskAnalysisCard({ riskData }: RiskAnalysisCardProps) {
  if (!riskData) return null;

  // Optional: simple colors or styling
  const cardBg = "bg-muted/50";
  const headingClass = "font-semibold text-sm flex items-center gap-2";

  // Split the AI response into paragraphs and headings
  const lines = riskData.risk_analysis.split("\n").filter((line) => line.trim() !== "");

  return (
    <Card className={`p-4 space-y-3 ${cardBg}`}>
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="h-4 w-4 text-red-500" />
        <h4 className={headingClass}>Risk Assessment — Document #{riskData.doc_id}</h4>
      </div>
      <ScrollArea className="max-h-[400px] overflow-y-auto space-y-2">
        {lines.map((line, idx) => {
          // Markdown-like formatting for headings and lists
          if (line.startsWith("### ")) {
            return (
              <h5 key={idx} className="font-semibold text-sm mt-2">
                {line.replace("### ", "")}
              </h5>
            );
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <strong key={idx} className="text-sm">
                {line.replace(/\*\*/g, "")}
              </strong>
            );
          } else if (line.startsWith("* ")) {
            return (
              <li key={idx} className="text-sm list-disc ml-5">
                {line.replace("* ", "")}
              </li>
            );
          } else {
            return (
              <p key={idx} className="text-sm text-muted-foreground">
                {line}
              </p>
            );
          }
        })}
      </ScrollArea>
    </Card>
  );
}
