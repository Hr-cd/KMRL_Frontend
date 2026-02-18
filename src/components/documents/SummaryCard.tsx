"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

export interface SummaryCardProps {
  summaryData: {
    doc_id?: number;
    summary: string;
  };
}

export default function SummaryCard({ summaryData }: SummaryCardProps) {
  if (!summaryData || !summaryData.summary) return null;

  const lines = summaryData.summary.split("\n").filter((line) => line.trim() !== "");

  return (
    <Card className="p-4 space-y-3 bg-primary/5">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h4 className="font-semibold text-sm flex-1">Document Summary</h4>
        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {summaryData.summary.split(/\s+/).length} words
        </span>
      </div>

      <ScrollArea className="max-h-[400px] overflow-y-auto space-y-2">
        {lines.map((line, idx) => {
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
                {line.replace("* ", "").replace(/\*\*/g, "")}
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
