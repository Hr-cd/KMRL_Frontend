import { CheckCircle2, Upload, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap = {
  uploaded: Upload,
  approved: CheckCircle2,
  rejected: XCircle,
};

const colorMap = {
  uploaded: "text-primary",
  approved: "text-success",
  rejected: "text-destructive",
};

interface ActivityItem {
  id: string;
  action: string;
  document: string;
  user: string;
  time: string;
}

export function RecentActivity({ items = [] }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">
            No recent activity
          </div>
        ) : (
          items.map((item) => {
            const Icon =
              iconMap[item.action as keyof typeof iconMap] || Upload;
            const color =
              colorMap[item.action as keyof typeof colorMap] || "text-primary";

            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-muted-foreground">
                      {item.action}
                    </span>{" "}
                    <span className="font-medium truncate">
                      {(item.document ?? "Untitled").replace(/\.[^/.]+$/, "")}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Math.floor(
                      (new Date().getTime() - new Date(item.time).getTime()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours ago
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
