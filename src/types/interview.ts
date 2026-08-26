export type Candidate = { id?: string; name: string | null; email: string | null; phone: string | null; professionalTitle: string | null; skills: string[]; experience: { summary: string }[]; projects: { name: string; description: string }[] };
export type Interview = { id: string; status: "DRAFT" | "IN_PROGRESS" | "COMPLETED"; startedAt: string | null; completedAt: string | null; firstQuestion?: string; messages?: InterviewMessage[]; timer?: InterviewTimer };
export type InterviewMessage = { id: string; role: "AI" | "CANDIDATE" | "SYSTEM"; content: string; createdAt: string };
export type InterviewTimer = { durationSeconds: number; elapsedSeconds: number; remainingSeconds: number; isExpired: boolean };
export type Evaluation = { id: string; overallScore: number | null; technicalScore: number | null; communicationScore: number | null; problemSolvingScore: number | null; strengths: string[] | null; weaknesses: string[] | null; recommendations: string[] | null; summary: string | null };
export type InterviewResponse = { transcript: string; question: string; audio: { contentType: string; base64: string } };
export type InterviewState = 'idle' | 'uploading' | 'processing-cv' | 'profile-ready' | 'requesting-microphone' | 'testing-microphone' | 'ready' | 'countdown' | 'ai-speaking' | 'listening' | 'processing' | 'completed' | 'error';
