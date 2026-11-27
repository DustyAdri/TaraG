import type { ComponentType } from "react";
import { currentUser } from "../lib/mockData";
import type { Route } from "../lib/router";
import type { Theme } from "../lib/theme";
import { BellIcon, CalendarIcon, DashboardIcon, FundsIcon, GroupsIcon, LogoutIcon } from "./Icons";

const NAV: { name: Route["name"]; href: string; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { name: "dashboard", href: "#/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { name: "groups", href: "#/groups", label: "Groups", Icon: GroupsIcon },
  { name: "funds", href: "#/funds", label: "Funds", Icon: FundsIcon },
  { name: "calendar", href: "#/calendar", label: "Calendar", Icon: CalendarIcon },
];

const THEMES: Theme[] = ["default", "light", "dark"];

interface SidebarProps {
  route: Route;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onNavigate: () => void;
  onLogout: () => void;
}

export function Sidebar({ route, theme, onThemeChange, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar" id="sidebar">
      <a className="brand" href="#/dashboard" onClick={onNavigate}>
        TaraG!
      </a>

      <nav aria-label="Main">
        <p className="nav-heading">Main</p>
        <ul className="nav-list">
          {NAV.map(({ name, href, label, Icon }) => {
            const active = route.name === name;
            return (
              <li key={name}>
                <a
                  href={href}
                  className={`nav-link${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  title={label}
                >
                  <Icon size={18} />
                  <span className="nav-text">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="avatar" aria-hidden="true">
            {currentUser.initials}
          </span>
          <span className="user-text">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-email">{currentUser.email}</span>
          </span>
        </div>

        <div className="theme-switch" role="radiogroup" aria-label="Color theme">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={theme === t}
              className={theme === t ? "active" : ""}
              onClick={() => onThemeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="sidebar-actions">
          <button type="button" className="icon-btn" aria-label="Notifications" title="Notifications">
            <BellIcon size={16} />
          </button>
          <button type="button" className="icon-btn" aria-label="Log out" title="Log out" onClick={onLogout}>
            <LogoutIcon size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
