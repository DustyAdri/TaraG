// Demo data for the static pages (Dashboard, Groups, Funds, Calendar).
// Accounts and real group storage are future work.

import { parseDate, toISO } from "./format";

export const currentUser = {
  firstName: "Uly",
  name: "Ulyxis Perez",
  initials: "UP",
  email: "ulyxis@tarag.app",
};

export type Role = "Owner" | "Admin" | "Treasurer" | "Member";

export interface Member {
  name: string;
  role: Role;
}

export interface Contribution {
  name: string;
  amount: number;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  quota: number;
  contributed: number;
  nextContribution: string; // ISO date
  frequency: "Weekly" | "Monthly";
  targetDate: string; // ISO date
  yourQuota: number;
  yourContributed: number;
  members: Member[];
  recentContributions: Contribution[];
}

const members: Member[] = [
  { name: "Ulyxis Perez", role: "Owner" },
  { name: "Natalie Calandaba", role: "Admin" },
  { name: "Adrian Cauguiran", role: "Treasurer" },
  { name: "Shawn Sabas", role: "Member" },
];

export const groups: Group[] = [
  {
    id: "boracay-27",
    name: "BORACAY 27'",
    code: "B7WXeY",
    quota: 20000,
    contributed: 10400,
    nextContribution: "2026-12-09",
    frequency: "Weekly",
    targetDate: "2027-04-02",
    yourQuota: 2000,
    yourContributed: 2000,
    members,
    recentContributions: [
      { name: "Ulyxis Perez", amount: 2000 },
      { name: "Natalie Calandaba", amount: 1500 },
      { name: "Adrian Cauguiran", amount: 1000 },
      { name: "Shawn Sabas", amount: 500 },
    ],
  },
  {
    id: "siargao-28",
    name: "SIARGAO 28'",
    code: "S4RgQ8",
    quota: 12000,
    contributed: 0,
    nextContribution: "2027-01-15",
    frequency: "Monthly",
    targetDate: "2028-04-02",
    yourQuota: 3000,
    yourContributed: 0,
    members,
    recentContributions: [],
  },
];

export const findGroup = (id?: string) => groups.find((g) => g.id === id);

export const percent = (part: number, whole: number) =>
  whole > 0 ? Math.min(100, Math.round((part / whole) * 100)) : 0;

export interface CalendarEvent {
  date: string; // ISO
  label: string;
  kind: "payment" | "trip";
}

/** Payment reminders from each group's schedule, plus the trip dates. */
function buildEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const g of groups) {
    const shortName = g.name.charAt(0) + g.name.slice(1).toLowerCase();
    const end = parseDate(g.targetDate);
    const d = parseDate(g.nextContribution);
    while (d < end) {
      events.push({ date: toISO(d), label: `Payment for ${shortName}`, kind: "payment" });
      if (g.frequency === "Weekly") d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + 1);
    }
    events.push({ date: g.targetDate, label: `${shortName} trip!`, kind: "trip" });
  }
  return events;
}

export const calendarEvents = buildEvents();
