import { useEffect, useState, type ReactNode } from "react";
import type { Route } from "../lib/router";
import type { Theme } from "../lib/theme";
import { PanelIcon, SparkleIcon } from "./Icons";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  route: Route;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLogout: () => void;
  children: ReactNode;
}

const MOBILE_QUERY = "(max-width: 900px)";

/**
 * Sidebar + top bar shell. On desktop the panel button collapses the
 * sidebar to an icon rail; on phones it opens the sidebar as a drawer.
 */
export function AppLayout({ route, theme, onThemeChange, onLogout, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer with Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const toggleSidebar = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) setDrawerOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  return (
    <div className={`shell${collapsed ? " collapsed" : ""}${drawerOpen ? " drawer-open" : ""}`}>
      <Sidebar
        route={route}
        theme={theme}
        onThemeChange={onThemeChange}
        onNavigate={() => setDrawerOpen(false)}
        onLogout={onLogout}
      />
      <div className="backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-controls="sidebar"
            aria-expanded={drawerOpen || !collapsed}
          >
            <PanelIcon size={20} />
          </button>
          <span className="topbar-brand">TaraG!</span>
          <a
            href="#/planner"
            className={`planner-link${route.name === "planner" ? " active" : ""}`}
            aria-label="AI Trip Planner"
            title="AI Trip Planner"
          >
            <SparkleIcon size={22} />
            <span className="planner-link-text">AI Planner</span>
          </a>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
