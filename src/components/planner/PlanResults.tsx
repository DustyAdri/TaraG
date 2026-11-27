import { formatPeso } from "../../lib/format";
import type { TripPlan, TripRequest } from "../../lib/types";
import { HealthBadge } from "./HealthBadge";

interface PlanResultsProps {
  plan: TripPlan;
  request: TripRequest;
  onEdit: () => void;
}

/** 5.1d results: health badge, summary, money cards, expense table, savings bar. */
export function PlanResults({ plan, request, onEdit }: PlanResultsProps) {
  if (plan.financial_health_status === "Out of Scope") {
    return (
      <section className="card results out-of-scope-card" aria-labelledby="results-title">
        <HealthBadge status="Out of Scope" />
        <h2 id="results-title">Please enter a trip budgeting request</h2>
        <p className="muted">
          Tara, G! can only help plan savings for a trip. Try a real destination, like
          <em> "Siargao, 8 weeks, 4 friends"</em>.
        </p>
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Edit trip details
        </button>
      </section>
    );
  }

  const total = plan.estimated_total_cost;
  const saved = request.currentSavings;
  const progress = total > 0 ? Math.min(100, (saved / total) * 100) : 0;
  const left = Math.max(0, total - saved);

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="card">
        <div className="results-head">
          <h2 id="results-title" className="card-title">
            Your plan for {request.destination}
          </h2>
          <HealthBadge status={plan.financial_health_status} />
        </div>
        {plan.trip_summary && <p className="summary">{plan.trip_summary}</p>}
      </div>

      <div className="money-cards">
        <div className="card money-card">
          <p className="money-label">Estimated total cost</p>
          <p className="money-value">{formatPeso(total)}</p>
          <p className="tiny muted">For the whole group, extra cushion included</p>
        </div>
        <div className="card money-card highlight">
          <p className="money-label">Extra for surprises</p>
          <p className="money-value">{formatPeso(plan.recommended_misc_buffer)}</p>
          <p className="tiny">Misc buffer for things like price hikes or a last-minute tour</p>
        </div>
        <div className="card money-card">
          <p className="money-label">Each person saves weekly</p>
          <p className="money-value">{formatPeso(plan.weekly_savings_target_per_person)}</p>
          <p className="tiny muted">
            for {request.weeksLeft} {request.weeksLeft === 1 ? "week" : "weeks"}, {request.groupSize}{" "}
            {request.groupSize === 1 ? "person" : "people"}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="progress-head">
          <h3>Savings progress</h3>
          <span className="muted">
            {formatPeso(saved)} of {formatPeso(total)} saved
          </span>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Group savings progress"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="tiny muted">
          {Math.round(progress)}% saved ·{" "}
          {left > 0 ? `${formatPeso(left)} left to save` : "You've already saved enough!"}
        </p>
      </div>

      {plan.expense_breakdown.length > 0 && (
        <div className="card">
          <h3>Where the money goes</h3>
          <table className="expense-table">
            <thead>
              <tr>
                <th scope="col">Expense</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col">Tip to save</th>
              </tr>
            </thead>
            <tbody>
              {plan.expense_breakdown.map((item, i) => (
                <tr key={i}>
                  <th scope="row" data-label="Expense">
                    {item.category}
                  </th>
                  <td className="num" data-label="Amount">
                    {formatPeso(item.estimated_amount)}
                  </td>
                  <td data-label="Tip to save">{item.saving_tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
