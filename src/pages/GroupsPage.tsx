import { ComingSoonButton } from "../components/ComingSoonButton";
import { Donut } from "../components/Donut";
import { PlusIcon } from "../components/Icons";
import { formatLongDate, formatNumber, parseDate } from "../lib/format";
import { groups, percent, type Group } from "../lib/mockData";

export function GroupsPage() {
  return (
    <div className="page">
      <h1 className="section-title">Your groups:</h1>
      <div className="grid-2">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} />
        ))}
      </div>
      <ComingSoonButton className="add-group" aria-label="Create a fund or join through a group code">
        <PlusIcon size={22} />
      </ComingSoonButton>
      <p className="tiny muted center">Create a fund or join through a group code!</p>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const pct = percent(group.contributed, group.quota);
  return (
    <article className="card group-card">
      <h2 className="group-name">{group.name}</h2>
      <div className="inner-card group-body">
        <Donut percent={pct} size={128} label={`${group.name}: ${pct}% of the quota saved`} />
        <dl className="stat-list">
          <div>
            <dt>Group Quota:</dt>
            <dd className="value">{formatNumber(group.quota)}</dd>
          </div>
          <div>
            <dt>Total Group Contributions:</dt>
            <dd className="value">{formatNumber(group.contributed)}</dd>
          </div>
          <div>
            <dt>Next Group Contribution:</dt>
            <dd className="date">{formatLongDate(parseDate(group.nextContribution))}</dd>
          </div>
          <div className="target">
            <dt>Target Date:</dt>
            <dd>{formatLongDate(parseDate(group.targetDate))}</dd>
          </div>
        </dl>
      </div>
      <a className="btn btn-dark btn-block" href={`#/funds/${group.id}`}>
        See details
      </a>
    </article>
  );
}
