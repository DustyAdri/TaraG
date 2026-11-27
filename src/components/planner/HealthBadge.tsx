import type { HealthStatus } from "../../lib/types";

const META: Record<HealthStatus, { className: string; hint: string }> = {
  "On Track": { className: "on-track", hint: "Your plan looks doable" },
  "Needs Adjustment": { className: "needs-adjustment", hint: "Doable with a few changes" },
  "High Risk": { className: "high-risk", hint: "Hard to reach in time" },
  "Out of Scope": { className: "out-of-scope", hint: "Not a trip budget request" },
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  const meta = META[status];
  return (
    <span className={`health-badge ${meta.className}`}>
      <span className="health-dot" aria-hidden="true" />
      <span>
        <strong>{status}</strong>
        <span className="health-hint">{meta.hint}</span>
      </span>
    </span>
  );
}
