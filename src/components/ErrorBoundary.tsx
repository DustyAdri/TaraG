import { Component, type ReactNode } from "react";

interface State {
  failed: boolean;
}

/** Last line of defence: shows a friendly card instead of a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    console.error("UI error:", error);
  }

  override componentDidUpdate(prev: { resetKey?: string }) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="card crash-card" role="alert">
        <h2>Oops, something went wrong.</h2>
        <p>This page ran into a problem. Your data is safe. Reload to try again.</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}
