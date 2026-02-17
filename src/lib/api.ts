/**
 * API Service Layer for KMRL Document Management System
 * 
 * Replace the mock implementations below with your actual API calls.
 * All functions return promises so swapping in real fetch/axios calls is seamless.
 */

import {
  mockDocuments,
  mockStats,
  mockActivity,
  mockChartData,
  mockStatusData,
  type KMRLDocument,
  type DashboardStats,
} from "./mock-data";

// const API_BASE = "/api"; // Uncomment and set your API base URL

export async function fetchDashboardStats(): Promise<DashboardStats> {
  // return fetch(`${API_BASE}/stats`).then(r => r.json());
  return mockStats;
}

export async function fetchDocuments(): Promise<KMRLDocument[]> {
  // return fetch(`${API_BASE}/documents`).then(r => r.json());
  return mockDocuments;
}

export async function fetchDocument(id: string): Promise<KMRLDocument | undefined> {
  // return fetch(`${API_BASE}/documents/${id}`).then(r => r.json());
  return mockDocuments.find((d) => d.id === id);
}

export async function fetchActivity() {
  return mockActivity;
}

export async function fetchChartData() {
  return mockChartData;
}

export async function fetchStatusData() {
  return mockStatusData;
}

export async function uploadDocument(_formData: FormData): Promise<{ success: boolean }> {
  // return fetch(`${API_BASE}/documents/upload`, { method: "POST", body: formData }).then(r => r.json());
  return { success: true };
}

export async function approveDocument(_id: string, _comment: string): Promise<{ success: boolean }> {
  return { success: true };
}

export async function rejectDocument(_id: string, _comment: string): Promise<{ success: boolean }> {
  return { success: true };
}

export async function deleteDocument(_id: string): Promise<{ success: boolean }> {
  return { success: true };
}

// ── AI Features ──────────────────────────────────────────────

export interface RiskAnalysisResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number; // 0-100
  factors: { label: string; severity: "low" | "medium" | "high"; detail: string }[];
  recommendation: string;
}

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export async function chatWithAI(
  _message: string,
  _documentId?: string,
): Promise<{ reply: string }> {
  // return fetch(`${API_BASE}/ai/chat`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ message, documentId }) }).then(r => r.json());
  await new Promise((r) => setTimeout(r, 1200));
  return {
    reply:
      "This is a mock AI response. Connect your backend API in `src/lib/api.ts` → `chatWithAI()` to enable real document-aware conversations.",
  };
}

export async function analyzeDocumentRisk(_id: string): Promise<RiskAnalysisResult> {
  // return fetch(`${API_BASE}/ai/risk/${id}`).then(r => r.json());
  await new Promise((r) => setTimeout(r, 1500));
  return {
    riskLevel: "medium",
    score: 58,
    factors: [
      { label: "Compliance Gap", severity: "high", detail: "Missing mandatory regulatory references in section 3." },
      { label: "Version Conflict", severity: "medium", detail: "Supersedes a document still referenced by 4 active contracts." },
      { label: "Approval Delay", severity: "low", detail: "Document has been pending review for 12 days." },
    ],
    recommendation:
      "Address the compliance gap before approval. Cross-reference dependent contracts and update references accordingly.",
  };
}

export async function generateDocumentSummary(_id: string): Promise<DocumentSummary> {
  // return fetch(`${API_BASE}/ai/summary/${id}`).then(r => r.json());
  await new Promise((r) => setTimeout(r, 1300));
  return {
    summary:
      "This document outlines updated operational procedures and policy amendments for Q1 2026. It covers key changes to maintenance schedules, vendor management protocols, and compliance requirements aligned with recent regulatory updates.",
    keyPoints: [
      "Revised maintenance schedules for all Phase 1 stations",
      "New vendor onboarding process effective March 2026",
      "Compliance updates per Kerala Metro Railway Act amendments",
      "Budget allocation adjustments for operational expenditure",
    ],
    wordCount: 4280,
  };
}
