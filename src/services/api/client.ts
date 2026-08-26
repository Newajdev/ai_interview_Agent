import type {
  Candidate,
  Evaluation,
  Interview,
  InterviewResponse,
} from "@/types/interview";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "error" in payload ? String(payload.error) : "Something went wrong.";
    throw new Error(message);
  }
  return payload as T;
}

const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const api = {
  analyzeCv(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ candidate: Candidate }>("/cv/analyze", { method: "POST", body: formData });
  },
  createInterview(candidateId: string) {
    return request<{ interview: Interview }>("/interviews", json({ candidateId }));
  },
  startInterview(id: string) {
    return request<{ interview: Interview }>(`/interviews/${id}/start`, { method: "POST" });
  },
  getInterview(id: string) {
    return request<{ interview: Interview }>(`/interviews/${id}`);
  },
  submitAnswer(interviewId: string, audio: Blob) {
    const formData = new FormData();
    formData.append("audio", audio, "answer.webm");
    formData.append("interviewId", interviewId);
    return request<InterviewResponse>("/voice/interview-response", { method: "POST", body: formData });
  },
  completeInterview(id: string) {
    return request<{ interview: Interview }>(`/interviews/${id}/complete`, { method: "POST" });
  },
  createEvaluation(interviewId: string) {
    return request<{ evaluation: Evaluation }>(`/evaluations/${interviewId}`, { method: "POST" });
  },
  sendReport(interviewId: string, recipient?: string) {
    return request(`/email/interview-report`, json({ interviewId, recipient }));
  },
};
