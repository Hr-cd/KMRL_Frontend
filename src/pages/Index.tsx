import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DocumentChart } from "@/components/dashboard/DocumentChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { getDashboard } from "@/lib/api";

interface DashboardStats {
  totalDocuments: number;
  approved: number;
  rejected: number;
  pending: number;
}

interface MonthlyTrend {
  month: string;
  uploads: number;
  approved: number;
  rejected: number;
  pending: number;
}

interface PieData {
  name: string;
  value: number;
  fill: string;
}

interface ActivityItem {
  id: string;
  action: string;
  document: string;
  user: string;
  time: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [barData, setBarData] = useState<MonthlyTrend[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await getDashboard();

        // Set stats
        setStats(data.stats);

        // Map monthly trends
        setBarData(
          data.monthlyTrends.map((t) => ({
            month: t.month,
            uploads: t.uploads,
            approved: t.approved ?? 0,
            rejected: t.rejected ?? 0,
            pending: t.uploads - ((t.approved ?? 0) + (t.rejected ?? 0)),
          }))
        );

        // Status breakdown for pie chart
        setPieData(data.statusBreakdown);

        // Recent activity
        setActivity(data.recentActivity ?? []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/documents" className="gap-2 flex items-center">
              <FileText className="h-4 w-4" /> View Pending
            </Link>
          </Button>
          <DocumentUploadDialog />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-muted-foreground">Loading dashboard...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts */}
          <DocumentChart barData={barData} pieData={pieData} />

          {/* Recent Activity */}
          <RecentActivity items={activity} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
