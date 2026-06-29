import type { Application, ApplicationCreate, Status } from "./types";

const BASE = "https://job-tracker-api-1sca.onrender.com";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  list: (status?: Status) =>
    request<Application[]>(`/applications/${status ? `?status=${status}` : ""}`),

  create: (data: ApplicationCreate) =>
    request<Application>("/applications/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: Status) =>
    request<Application>(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: number) =>
    request<void>(`/applications/${id}`, { method: "DELETE" }),
};
