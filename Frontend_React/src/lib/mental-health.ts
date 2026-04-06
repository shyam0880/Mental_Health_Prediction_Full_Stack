// ---------------------------------------------------------------------------
// AI mode & model selection API helpers
// Used by: chat.tsx, checkup.tsx
// ---------------------------------------------------------------------------

const FLASK_API = "http://localhost:5000";

export interface AiStatus {
  current_mode: "local" | "cloud";
  available_modes: string[];
  cloud_available: boolean;
}

export interface ModelList {
  models: string[];
  default: string;
  ready: boolean;
}

export async function getAiStatus(): Promise<AiStatus> {
  const res = await fetch(`${FLASK_API}/ai/status`);
  if (!res.ok) throw new Error("Failed to fetch AI status");
  return res.json();
}

export async function setAiMode(
  mode: "local" | "cloud"
): Promise<{ mode: string; message: string }> {
  const res = await fetch(`${FLASK_API}/ai/mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to set AI mode");
  }
  return res.json();
}

export async function getAvailableModels(): Promise<ModelList> {
  const res = await fetch(`${FLASK_API}/ai/models`);
  if (!res.ok) throw new Error("Failed to fetch model list");
  return res.json();
}
