import type { HealthStatus, TripPlan, TripRequest } from "./types";

export type PlanErrorKind = "invalid" | "network" | "server" | "ai" | "interrupted" | "bad-response";

export class PlanRequestError extends Error {
  constructor(public kind: PlanErrorKind, detail?: string) {
    super(detail ?? kind);
    this.name = "PlanRequestError";
  }
}

const STATUSES: HealthStatus[] = ["On Track", "Needs Adjustment", "High Risk", "Out of Scope"];
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

/** Makes sure the plan has the shape the results view expects, so a bad reply can't crash the page. */
function normalizePlan(raw: unknown): TripPlan {
  if (!raw || typeof raw !== "object") throw new PlanRequestError("bad-response");
  const p = raw as Record<string, unknown>;
  const status = STATUSES.includes(p.financial_health_status as HealthStatus)
    ? (p.financial_health_status as HealthStatus)
    : null;
  if (!status) throw new PlanRequestError("bad-response");

  const breakdown = Array.isArray(p.expense_breakdown) ? p.expense_breakdown : [];
  return {
    trip_summary: typeof p.trip_summary === "string" ? p.trip_summary : "",
    estimated_total_cost: num(p.estimated_total_cost),
    recommended_misc_buffer: num(p.recommended_misc_buffer),
    weekly_savings_target_per_person: num(p.weekly_savings_target_per_person),
    financial_health_status: status,
    expense_breakdown: breakdown
      .filter((i): i is Record<string, unknown> => !!i && typeof i === "object")
      .map((i) => ({
        category: String(i.category ?? "Other"),
        estimated_amount: num(i.estimated_amount),
        saving_tip: String(i.saving_tip ?? ""),
      })),
  };
}

type ServerEvent =
  | { type: "chunk"; text: string }
  | { type: "done"; plan: unknown }
  | { type: "error"; message?: string };

function parseEvent(block: string): ServerEvent | null {
  const data = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) return null;
  try {
    return JSON.parse(data) as ServerEvent;
  } catch {
    return null;
  }
}

/**
 * POSTs the trip to /api/plan and reads the server-sent event stream.
 * Calls onChunk for every piece of text as it arrives and resolves with the
 * final plan. Every failure becomes a PlanRequestError with a `kind`.
 */
export async function streamPlan(
  trip: TripRequest,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<TripPlan> {
  let res: Response;
  try {
    res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new PlanRequestError("network");
  }

  if (res.status === 400) throw new PlanRequestError("invalid");
  if (!res.ok || !res.body) throw new PlanRequestError("server", `HTTP ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value.replace(/\r\n/g, "\n");

      let end: number;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const event = parseEvent(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
        if (!event) continue;
        if (event.type === "chunk") onChunk(event.text ?? "");
        else if (event.type === "done") return normalizePlan(event.plan);
        else if (event.type === "error") throw new PlanRequestError("ai", event.message);
      }
    }
  } catch (err) {
    if (err instanceof PlanRequestError || signal?.aborted) throw err;
    throw new PlanRequestError("interrupted");
  } finally {
    reader.cancel().catch(() => {});
  }
  // The stream closed without a `done` event.
  throw new PlanRequestError("interrupted");
}

/** Plain-language messages for each failure (no technical jargon). */
export const friendlyErrors: Record<PlanErrorKind, { title: string; message: string }> = {
  invalid: {
    title: "Some trip details look off",
    message: "Please check the form (destination, weeks, people and savings) and try again.",
  },
  network: {
    title: "We couldn't reach Tara, G!",
    message: "Check your internet connection, then try again.",
  },
  server: {
    title: "Something went wrong on our side",
    message: "The planner had a hiccup. Please try again in a moment.",
  },
  ai: {
    title: "Gemini couldn't finish your plan",
    message:
      "This can happen when the AI is busy or the request was blocked. Try again, or reword your trip details.",
  },
  interrupted: {
    title: "The connection dropped",
    message: "Your plan stopped loading before it was finished. Please try again.",
  },
  "bad-response": {
    title: "We got an incomplete plan",
    message: "The AI's answer was missing some parts. Please try again.",
  },
};
