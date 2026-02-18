export type DocumentCategory = "Policy" | "Report" | "Contract" | "Invoice" | "Memo" | "Circular" | "Technical" | "HR";

export interface DocumentComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  action?: "approved" | "rejected" | "comment";
}

export interface DashboardStats {
  totalDocuments: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const mockStats: DashboardStats = {
  totalDocuments: 6,
  pending: 6,
  approved: 0,
  rejected: 0,
};

// export const mockDocuments: KMRLDocument[] = [
//   {
//     id: "DOC-001",
//     name: "Q4 Financial Report 2025",
//     category: "Report",
//     status: "approved",
//     uploadedBy: "Anjali Menon",
//     uploadedAt: "2026-01-15",
//     fileSize: "2.4 MB",
//     description: "Quarterly financial performance report for Q4 2025 covering revenue, expenditure, and projections.",
//     tags: ["finance", "quarterly", "2025"],
//     reviewedBy: "Rajesh Kumar",
//     reviewedAt: "2026-01-18",
//     comments: [
//       { id: "c1", author: "Rajesh Kumar", text: "Approved. All figures verified.", createdAt: "2026-01-18", action: "approved" },
//     ],
//   },
//   {
//     id: "DOC-002",
//     name: "Station Maintenance Policy v3",
//     category: "Policy",
//     status: "pending",
//     uploadedBy: "Suresh Nair",
//     uploadedAt: "2026-02-01",
//     fileSize: "1.1 MB",
//     description: "Updated maintenance policy for all metro stations including new safety protocols.",
//     tags: ["maintenance", "policy", "safety"],
//     comments: [],
//   },
//   {
//     id: "DOC-003",
//     name: "Vendor Contract - CleanTech Services",
//     category: "Contract",
//     status: "approved",
//     uploadedBy: "Priya Sharma",
//     uploadedAt: "2026-01-20",
//     fileSize: "3.8 MB",
//     description: "Service contract with CleanTech Services for station cleaning and sanitation.",
//     tags: ["vendor", "cleaning", "contract"],
//     reviewedBy: "Anjali Menon",
//     reviewedAt: "2026-01-25",
//     comments: [
//       { id: "c2", author: "Anjali Menon", text: "Reviewed and approved. Terms are acceptable.", createdAt: "2026-01-25", action: "approved" },
//     ],
//   },
//   {
//     id: "DOC-004",
//     name: "Employee Leave Policy Update",
//     category: "HR",
//     status: "rejected",
//     uploadedBy: "Deepa Krishnan",
//     uploadedAt: "2026-01-28",
//     fileSize: "540 KB",
//     description: "Proposed changes to the employee leave policy for 2026.",
//     tags: ["hr", "leave", "policy"],
//     reviewedBy: "Suresh Nair",
//     reviewedAt: "2026-02-02",
//     comments: [
//       { id: "c3", author: "Suresh Nair", text: "Needs revision. Section 4.2 conflicts with existing labor regulations.", createdAt: "2026-02-02", action: "rejected" },
//     ],
//   },
//   {
//     id: "DOC-005",
//     name: "Monthly Ridership Report - Jan 2026",
//     category: "Report",
//     status: "approved",
//     uploadedBy: "Arun Pillai",
//     uploadedAt: "2026-02-03",
//     fileSize: "1.8 MB",
//     description: "January 2026 ridership statistics across all stations.",
//     tags: ["ridership", "monthly", "statistics"],
//     reviewedBy: "Rajesh Kumar",
//     reviewedAt: "2026-02-05",
//     comments: [
//       { id: "c4", author: "Rajesh Kumar", text: "Good report. Numbers align with projections.", createdAt: "2026-02-05", action: "approved" },
//     ],
//   },
//   {
//     id: "DOC-006",
//     name: "Signal System Technical Specification",
//     category: "Technical",
//     status: "pending",
//     uploadedBy: "Vikram Das",
//     uploadedAt: "2026-02-06",
//     fileSize: "5.2 MB",
//     description: "Technical specifications for the upgraded signaling system for Phase 2 extension.",
//     tags: ["technical", "signaling", "phase2"],
//     comments: [],
//   },
//   {
//     id: "DOC-007",
//     name: "Internal Circular - Office Timings",
//     category: "Circular",
//     status: "approved",
//     uploadedBy: "Deepa Krishnan",
//     uploadedAt: "2026-01-10",
//     fileSize: "120 KB",
//     description: "Updated office timings effective from February 2026.",
//     tags: ["circular", "office", "timings"],
//     reviewedBy: "Anjali Menon",
//     reviewedAt: "2026-01-12",
//     comments: [
//       { id: "c5", author: "Anjali Menon", text: "Approved for circulation.", createdAt: "2026-01-12", action: "approved" },
//     ],
//   },
//   {
//     id: "DOC-008",
//     name: "Budget Proposal FY 2026-27",
//     category: "Report",
//     status: "pending",
//     uploadedBy: "Anjali Menon",
//     uploadedAt: "2026-02-08",
//     fileSize: "4.1 MB",
//     description: "Annual budget proposal for the financial year 2026-27.",
//     tags: ["budget", "finance", "annual"],
//     comments: [],
//   },
// ];

// export const mockActivity = [
//   { id: "a1", action: "uploaded", document: "Budget Proposal FY 2026-27", user: "Anjali Menon", time: "2 hours ago" },
//   { id: "a2", action: "approved", document: "Monthly Ridership Report - Jan 2026", user: "Rajesh Kumar", time: "5 hours ago" },
//   { id: "a3", action: "uploaded", document: "Signal System Technical Specification", user: "Vikram Das", time: "1 day ago" },
//   { id: "a4", action: "rejected", document: "Employee Leave Policy Update", user: "Suresh Nair", time: "1 day ago" },
//   { id: "a5", action: "approved", document: "Internal Circular - Office Timings", user: "Anjali Menon", time: "3 days ago" },
// ];

// export const mockChartData = [
//   { month: "Sep", uploads: 42, approved: 38, rejected: 4 },
//   { month: "Oct", uploads: 56, approved: 49, rejected: 7 },
//   { month: "Nov", uploads: 61, approved: 54, rejected: 5 },
//   { month: "Dec", uploads: 38, approved: 34, rejected: 3 },
//   { month: "Jan", uploads: 72, approved: 63, rejected: 8 },
//   { month: "Feb", uploads: 19, approved: 12, rejected: 2 },
// ];

export const mockStatusData = [
  { name: "Approved", value: 1189, fill: "hsl(152, 69%, 31%)" },
  { name: "Pending", value: 47, fill: "hsl(38, 92%, 50%)" },
  { name: "Rejected", value: 48, fill: "hsl(0, 72%, 51%)" },
];
