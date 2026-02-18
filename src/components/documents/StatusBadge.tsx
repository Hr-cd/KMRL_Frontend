import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/lib/utils";

const variants: Record<DocumentStatus, { className: string; label: string }> = {
  pending: { className: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20", label: "Pending" },
  approved: { className: "bg-success/15 text-success border-success/30 hover:bg-success/20", label: "Approved" },
  rejected: { className: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20", label: "Rejected" },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const v = variants[status] ?? {
    className: "bg-muted text-muted-foreground",
    label: "Unknown",
  };

  return (
    <Badge variant="outline" className={v.className}>
      {v.label}
    </Badge>
  );
}
