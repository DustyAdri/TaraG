import { ComingSoonButton } from "../components/ComingSoonButton";
import { Donut } from "../components/Donut";
import { ArrowLeftIcon } from "../components/Icons";
import { formatLongDate, formatNumber, parseDate } from "../lib/format";
import { findGroup, groups, percent } from "../lib/mockData";

const ACTIONS = ["Change Target Date", "Kick Member", "Edit Roles", "Edit Quota", "Contribution History"];

/** Group detail page. #/funds shows the first group, #/funds/<id> a specific one. */
export function FundsPage({ id }: { id?: string }) {
  const group = id ? findGroup(id) : groups[0];

  if (!group) {
    return (
      <div className="card empty-card">
        <h2>We couldn't find that fund</h2>
        <a className="btn btn-primary" href="#/groups">
          Return to Groups
        </a>
      </div>
    );
  }

  const pct = percent(group.contributed, group.quota);
  const youPaid = group.yourContributed >= group.yourQuota;

  return (
    <div className="page">
      <div className="fund-header">
        <div>
          <a className="pill-link" href="#/groups">
            <ArrowLeftIcon size={14} /> Return to Groups
          </a>
          <div className="fund-title-row">
            <h1 className="group-name large">{group.name}</h1>
            <span className="date-pill">Target Date: {formatLongDate(parseDate(group.targetDate))}</span>
          </div>
        </div>
        <p className="group-code">
          Group code: <strong>{group.code}</strong>
        </p>
      </div>

      <section className="card fund-summary" aria-label="Fund progress">
        <dl className="fund-stats">
          <div>
            <dt>
              <strong>Group</strong> Quota:
            </dt>
            <dd className="value">{formatNumber(group.quota)}</dd>
          </div>
          <div>
            <dt>
              Total <strong>Group</strong> Contributions:
            </dt>
            <dd className="value">{formatNumber(group.contributed)}</dd>
          </div>
          <div>
            <dt>
              Next <strong>Group</strong> contribution:
            </dt>
            <dd className="date">{formatLongDate(parseDate(group.nextContribution))}</dd>
            <dd className="tiny muted">{group.frequency} payment*</dd>
          </div>
        </dl>

        <div className="fund-center">
          <Donut percent={pct} size={140} label={`${pct}% of the group quota saved`} />
          <ComingSoonButton className="btn btn-primary">Add contribution</ComingSoonButton>
        </div>

        <dl className="fund-stats">
          <div>
            <dt>
              <strong>Your</strong> Quota:
            </dt>
            <dd className="value">{formatNumber(group.yourQuota)}</dd>
          </div>
          <div>
            <dt>
              <strong>Your</strong> total contributions:
            </dt>
            <dd className="value">{formatNumber(group.yourContributed)}</dd>
          </div>
          <div>
            <dt>
              <strong>Your</strong> next contribution:
            </dt>
            {youPaid ? (
              <>
                <dd className="date strong">FULLY PAID</dd>
                <dd className="tiny muted">Paid in advance*</dd>
              </>
            ) : (
              <dd className="date">{formatLongDate(parseDate(group.nextContribution))}</dd>
            )}
          </div>
        </dl>
      </section>

      <div className="fund-lower">
        <section className="card" aria-labelledby="recent-title">
          <h2 id="recent-title" className="card-title center">
            Recent Contributions
          </h2>
          {group.recentContributions.length === 0 ? (
            <p className="muted center tiny">No contributions yet. Be the first!</p>
          ) : (
            <ul className="row-list">
              {group.recentContributions.map((c, i) => (
                <li key={i}>
                  <span>{c.name}</span>
                  <span className="chip">+ {formatNumber(c.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-labelledby="members-title">
          <h2 id="members-title" className="card-title center">
            Group Members
          </h2>
          <ul className="row-list">
            {group.members.map((m) => (
              <li key={m.name}>
                <span className="chip role">{m.role}</span>
                <span>{m.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="fund-actions">
          {ACTIONS.map((a) => (
            <ComingSoonButton key={a} className="btn btn-outline">
              {a}
            </ComingSoonButton>
          ))}
        </div>
      </div>
    </div>
  );
}
