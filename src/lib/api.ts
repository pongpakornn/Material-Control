import type { Category, Part } from "./types";
import { sampleCategories } from "./data";

// Base URL of the ASP.NET backend, e.g. https://localhost:5001
// Configure via .env.local:  NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${init?.method ?? "GET"} ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * Pull the store list from the backend.
 * Falls back to bundled sample data when no backend is configured yet,
 * so the UI works standalone during development.
 */
export async function fetchStore(): Promise<Category[]> {
  if (!API_BASE) return sampleCategories;
  try {
    // Expected endpoint on the ASP.NET side, e.g. [HttpGet] /api/store
    return await request<Category[]>("/api/store");
  } catch (err) {
    console.warn("fetchStore: falling back to sample data.", err);
    return sampleCategories;
  }
}

/** Push a single part update back to the backend (e.g. PUT /api/store/{id}). */
export async function updatePart(part: Part): Promise<Part> {
  return request<Part>(`/api/store/${encodeURIComponent(part.id)}`, {
    method: "PUT",
    body: JSON.stringify(part),
  });
}

/** Create a new part (e.g. POST /api/store). */
export async function createPart(part: Omit<Part, "id">): Promise<Part> {
  return request<Part>("/api/store", {
    method: "POST",
    body: JSON.stringify(part),
  });
}
