import type { JavaInfo, RunRequest, RunResult, SubmitRequest, SubmitResult } from './api-types';

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getHealth(): Promise<{ java: JavaInfo } | null> {
  try {
    const res = await fetch('/api/health');
    return res.ok ? ((await res.json()) as { java: JavaInfo }) : null;
  } catch {
    return null;
  }
}

export const runCode = (req: RunRequest) => post<RunResult>('/api/run', req);
export const submitCode = (req: SubmitRequest) => post<SubmitResult>('/api/submit', req);
