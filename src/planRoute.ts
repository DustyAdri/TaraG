// POST /api/plan: validates the trip, then streams Gemini's answer as
// server-sent events: `chunk` events while it writes, then `done` or `error`.
import { generateTripBudgetPlan } from "./geminiService.js";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_EXPENSES = 30;

export interface TripData {
  destination: string;
  weeksLeft: number;
  groupSize: number;
  currentSavings: number;
  expectedExpenses: { category: string; amount: number }[];
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Returns a cleaned copy of the trip data, or null when anything is invalid. */
export function validateTripData(body: unknown): TripData | null {
  if (!body || typeof body !== "object") return null;
  const { destination, weeksLeft, groupSize, currentSavings, expectedExpenses = [] } = body as Record<
    string,
    unknown
  >;

  if (typeof destination !== "string" || !destination.trim() || destination.length > 200) return null;
  if (!isNum(weeksLeft) || weeksLeft <= 0) return null;
  if (!isNum(groupSize) || groupSize <= 0) return null;
  if (!isNum(currentSavings) || currentSavings < 0) return null;
  if (!Array.isArray(expectedExpenses) || expectedExpenses.length > MAX_EXPENSES) return null;

  const expenses: TripData["expectedExpenses"] = [];
  for (const item of expectedExpenses) {
    if (!item || typeof item !== "object") return null;
    const { category, amount } = item as Record<string, unknown>;
    if (typeof category !== "string" || !category.trim() || category.length > 100) return null;
    if (!isNum(amount) || amount < 0) return null;
    expenses.push({ category: category.trim(), amount });
  }

  return { destination: destination.trim(), weeksLeft, groupSize, currentSavings, expectedExpenses: expenses };
}

const invalid = () => Response.json({ error: "Invalid input" }, { status: 400 });

export async function handlePlan(req: Request): Promise<Response> {
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return invalid();
    body = JSON.parse(text);
  } catch {
    return invalid();
  }

  const tripData = validateTripData(body);
  if (!tripData) return invalid();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Stop writing if the browser goes away mid-stream.
      const send = (obj: unknown) => {
        if (req.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        } catch {
          /* stream already closed */
        }
      };

      try {
        const plan = await generateTripBudgetPlan(tripData, (text: string) => send({ type: "chunk", text }));
        send({ type: "done", plan });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
      }
      try {
        controller.close();
      } catch {
        /* already closed */
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
