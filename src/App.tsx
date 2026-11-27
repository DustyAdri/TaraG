import { useEffect, useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { navigate, useRoute, type Route } from "./lib/router";
import { useTheme } from "./lib/theme";
import { CalendarPage } from "./pages/CalendarPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FundsPage } from "./pages/FundsPage";
import { GroupsPage } from "./pages/GroupsPage";
import { LoginPage } from "./pages/LoginPage";
import { PlannerPage } from "./pages/PlannerPage";

// Mock sign-in only: real accounts are future work.
const SESSION_KEY = "tarag.signedIn";
const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};
const writeSession = (on: boolean) => {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage blocked */
  }
};

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "dashboard":
      return <DashboardPage />;
    case "groups":
      return <GroupsPage />;
    case "funds":
      return <FundsPage id={route.id} />;
    case "calendar":
      return <CalendarPage />;
    case "planner":
      return <PlannerPage />;
    default:
      return (
        <div className="card empty-card">
          <h2>Page not found</h2>
          <p>That page doesn't exist.</p>
          <a className="btn btn-primary" href="#/dashboard">
            Go to Dashboard
          </a>
        </div>
      );
  }
}

export function App() {
  const route = useRoute();
  const [signedIn, setSignedIn] = useState(readSession);
  const [theme, setTheme] = useTheme();

  // Signed-out visitors go to the login page; signed-in ones skip it.
  useEffect(() => {
    if (!signedIn && route.name !== "login") navigate("/login");
    if (signedIn && route.name === "login") navigate("/dashboard");
  }, [signedIn, route.name]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name]);

  if (!signedIn || route.name === "login") {
    return (
      <LoginPage
        onLogin={() => {
          writeSession(true);
          setSignedIn(true);
        }}
      />
    );
  }

  return (
    <AppLayout
      route={route}
      theme={theme}
      onThemeChange={setTheme}
      onLogout={() => {
        writeSession(false);
        setSignedIn(false);
      }}
    >
      <ErrorBoundary resetKey={window.location.hash}>
        <Page route={route} />
      </ErrorBoundary>
    </AppLayout>
  );
}
