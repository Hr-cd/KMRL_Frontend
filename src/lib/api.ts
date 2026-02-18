import axios from "axios";
  
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

function mapDocument(apiDoc: any) {
  return {
    id: String(apiDoc.id ?? ""),
    name: apiDoc.name ?? "",
    category: apiDoc.category ?? "Unknown",
    status: apiDoc.status ?? "pending",
    uploadedBy: apiDoc.uploadedBy ?? "Unknown",
    uploadedAt: apiDoc.uploadedAt ?? "",
    description: apiDoc.description ?? "",
    fileSize: apiDoc.fileSize ?? "",
    tags: apiDoc.tags ?? [],
    comments: apiDoc.comments ?? [],
  };
} 

export const uploadDocument = async (
  file: File,
  name?: string,
  category?: string,
  tags?: string,
  description?: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);
  if (category) formData.append("category", category);
  if (tags) formData.append("tags", tags);
  if (description) formData.append("description", description);
  const res = await API.post("/upload-document", formData);
  return res.data;
};

export async function getDocuments() {
  const res = await API.get(`/documents`);
  const data = res.data;
  return data.map(mapDocument);
}

export const getDocument = async (id: number) => {
  const res = await API.get(`/document/${id}`);
  return mapDocument(res.data);
};

export const deleteDocument = async (id: string) => {
  const res = await API.delete(`/document/${id}`);
  return res.data;
};

export const searchDocuments = async (q: string) => {
  const res = await API.get(`/search-documents?q=${q}`);
  return res.data.map((item: any) => mapDocument(item));
};

type StatusAction = "approve" | "reject" | "pending";

interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  updatedStatus?: string;
}

export async function updateStatus(
  id: number,
  action: StatusAction
): Promise<UpdateStatusResponse> {
  try {
    const res = await API.post<UpdateStatusResponse>(
      `/documents/${id}/status`,
      {}, // empty body
      { params: { action } }
    );

    return res.data;
  } catch (error: any) {
    console.error("Failed to update status:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unknown error",
    };
  }
}


export const getDashboard = async () => {
  const res = await API.get("/dashboard/stats");
  return res.data;
};
  
export async function askAI(question: string, documentId: string) {
  if (!documentId) throw new Error("Document ID is required");

  const res = await API.post(`/ask-document/${Number(documentId)}`, { question });
  console.log("ID:", res.data.document_id, "Question:", res.data.question, "Answer:", res.data.answer);
  if (!res.data) throw new Error("AI request failed");

  return res.data; // returns { success, data: { document_id, question, answer, sources } }
}

export async function analyzeRisk(id: string) {
  const res = await API.post(`/analyze-risk/${id}`);
  return res.data;
}

export async function summarizeDocument(id: string) {
  const res = await API.post(`/summarize-document/${id}`);
  return res.data;
}

export default API;