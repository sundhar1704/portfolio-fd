import { useEffect, useState } from "react";
import { fallbackProjects } from "../data/fallbackProjects";

export type ProjectKind = "react" | "react-native" | "js-html";

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  kind: ProjectKind;
  summary: string;
  description: string;
  highlights: string[];
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  imageUrl: string;
  accent: string;
  year: number | null;
};

const API = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");

type ProjectsState = {
  projects: Project[];
  loading: boolean;
  source: "api" | "local";
};

export function useProjects(): ProjectsState {
  const [state, setState] = useState<ProjectsState>({
    projects: fallbackProjects,
    loading: Boolean(API),
    source: "local",
  });

  useEffect(() => {
    if (!API) return;
    const controller = new AbortController();

    fetch(`${API}/api/projects/`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setState({ projects: data.projects, loading: false, source: "api" });
        } else {
          setState((s) => ({ ...s, loading: false }));
        }
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setState((s) => ({ ...s, loading: false }));
      });

    return () => controller.abort();
  }, []);

  return state;
}

export class ApiError extends Error {
  fields: Record<string, string>;
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.fields = fields;
  }
}

export type ContactPayload = {
  name: string;
  email: string;
  topic?: string;
  message: string;
  website?: string; // honeypot: leave empty
};

export async function submitContact(payload: ContactPayload): Promise<void> {
  if (!API) throw new ApiError("Backend is not configured (missing VITE_API_URL).");
  let res: Response;
  try {
    res = await fetch(`${API}/api/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? "Something went wrong.", data.fields ?? {});
}

export type TrackEvent =
  | "page_view"
  | "project_view"
  | "github_click"
  | "live_click"
  | "resume_download";

// Anonymous random id for this browser tab. Lets the backend ignore quick duplicates.
function sessionId(): string {
  try {
    let id = sessionStorage.getItem("sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

// Fire-and-forget analytics. Never throws and never blocks the page.
export function trackEvent(eventType: TrackEvent, projectSlug?: string): void {
  if (!API) return;
  try {
    fetch(`${API}/api/analytics/track/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        ...(projectSlug ? { project_slug: projectSlug } : {}),
        session_id: sessionId(),
        source: "web",
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
