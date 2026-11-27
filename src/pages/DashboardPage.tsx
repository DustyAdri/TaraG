import { ComingSoonButton } from "../components/ComingSoonButton";
import { CalendarClockIcon, PlusCircleIcon, UsersIcon } from "../components/Icons";
import { formatDayLine, greeting } from "../lib/format";
import { currentUser } from "../lib/mockData";

const STEPS = [
  {
    Icon: PlusCircleIcon,
    title: "Create a sinking fund",
    text: "Start your own personal or group sinking fund and invite friends through the group code.",
  },
  {
    Icon: CalendarClockIcon,
    title: "Contribute on time",
    text: "Add your share on the schedule your group picks: weekly, monthly or yearly.",
  },
  {
    Icon: UsersIcon,
    title: "Meet the goal with your barkada",
    text: "Reach your dream destination with friends or family through regular contributions.",
  },
];

export function DashboardPage() {
  const now = new Date();
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="greeting">
          {greeting(now)}, {currentUser.firstName}!
        </h1>
        <p className="muted">{formatDayLine(now)}</p>
      </header>

      <section className="card welcome-card" aria-labelledby="welcome-title">
        <h2 id="welcome-title" className="card-title center">
          Welcome to TaraG!
        </h2>
        <p className="muted center">Let's get started! Create a fund, or join a group sinking fund.</p>
        <div className="grid-2">
          <div className="inner-card action-card">
            <PlusCircleIcon size={30} />
            <h3>Create a sinking fund</h3>
            <p className="tiny muted">
              Start your own personal or group sinking fund! Invite friends with a group code later.
            </p>
            <ComingSoonButton className="btn btn-primary btn-block">Create fund</ComingSoonButton>
          </div>
          <div className="inner-card action-card">
            <UsersIcon size={30} />
            <h3>Join a group sinking fund</h3>
            <p className="tiny muted">Ask your barkada's fund admin for the group code!</p>
            <ComingSoonButton className="btn btn-primary btn-block">Enter group code</ComingSoonButton>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="how-title">
        <h2 id="how-title" className="eyebrow center">
          How it works
        </h2>
        <ol className="grid-3 steps">
          {STEPS.map(({ Icon, title, text }) => (
            <li key={title} className="inner-card step-card">
              <Icon size={28} />
              <h3>{title}</h3>
              <p className="tiny muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <a className="card planner-promo" href="#/planner">
        <span className="planner-promo-icon" aria-hidden="true">
          ✦
        </span>
        <span>
          <strong>Not sure how much to save?</strong>
          <span className="muted block">
            Try the AI Trip Planner. Tell it where you're going and it builds a weekly savings plan.
          </span>
        </span>
      </a>
    </div>
  );
}
