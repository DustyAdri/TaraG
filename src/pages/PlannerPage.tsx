import { useEffect, useRef, useState } from "react";
import { SparkleIcon } from "../components/Icons";
import { PlanResults } from "../components/planner/PlanResults";
import { PlannerError } from "../components/planner/PlannerError";
import { StreamPanel } from "../components/planner/StreamPanel";
import { TripForm } from "../components/planner/TripForm";
import { friendlyErrors, PlanRequestError, streamPlan, type PlanErrorKind } from "../lib/planApi";
import type { TripPlan, TripRequest } from "../lib/types";

type State =
  | { status: "idle" }
  | { status: "streaming" }
  | { status: "done"; plan: TripPlan }
  | { status: "error"; kind: PlanErrorKind; title: string; message: string };

/** AI Trip Planner: form → POST /api/plan → live stream → results. */
export function PlannerPage() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [streamText, setStreamText] = useState("");
  const [lastRequest, setLastRequest] = useState<TripRequest | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Stop any running request when leaving the page.
  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async (request: TripRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLastRequest(request);
    setStreamText("");
    setState({ status: "streaming" });
    // On phones the output sits below the form, so bring it into view.
    requestAnimationFrame(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

    try {
      const plan = await streamPlan(request, (text) => setStreamText((t) => t + text), controller.signal);
      if (!controller.signal.aborted) setState({ status: "done", plan });
    } catch (err) {
      if (controller.signal.aborted) return;
      const kind = err instanceof PlanRequestError ? err.kind : "server";
      if (!(err instanceof PlanRequestError)) console.error(err);
      setState({ status: "error", kind, ...friendlyErrors[kind] });
    }
  };

  const focusForm = () => {
    const input = document.getElementById("destination");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  const busy = state.status === "streaming";

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="greeting">
          <SparkleIcon size={24} /> AI Trip Planner
        </h1>
        <p className="muted">
          Tell us about your trip and Gemini will work out how much your barkada needs to save each week.
        </p>
      </header>

      <div className="planner-grid">
        <TripForm busy={busy} onSubmit={run} />

        <div className="planner-output" ref={outputRef}>
          {(busy || state.status === "done") && <StreamPanel text={streamText} streaming={busy} />}

          {state.status === "idle" && (
            <div className="card placeholder-card">
              <span className="placeholder-icon" aria-hidden="true">
                ✦
              </span>
              <h2>Your plan will appear here</h2>
              <p className="muted">
                Fill in the form and press <strong>Analyze &amp; Plan with AI</strong>. You'll see the AI's answer
                come in live.
              </p>
            </div>
          )}

          {state.status === "error" && (
            <PlannerError
              title={state.title}
              message={state.message}
              // Resending bad input would fail the same way, so send the user back to the form.
              onRetry={() => (lastRequest && state.kind !== "invalid" ? run(lastRequest) : focusForm())}
            />
          )}

          {state.status === "done" && lastRequest && (
            <PlanResults plan={state.plan} request={lastRequest} onEdit={focusForm} />
          )}
        </div>
      </div>
    </div>
  );
}
