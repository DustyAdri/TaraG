import { AlertIcon } from "../Icons";

interface PlannerErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

/** Friendly error card with a Try again button (TC-05). */
export function PlannerError({ title, message, onRetry }: PlannerErrorProps) {
  return (
    <section className="card planner-error" role="alert">
      <AlertIcon size={28} />
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </section>
  );
}
