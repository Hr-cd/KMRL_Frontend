import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export type DocumentStatus = "pending" | "approved" | "rejected";

export interface KMRLDocument {
  id: string;
  name: string;
  category: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  fileSize: string;
  tags: string[];
  comments: any[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
