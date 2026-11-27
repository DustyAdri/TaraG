import { useMemo, useState } from "react";
import { formatDayLine, isSameDay, toISO } from "../lib/format";
import { calendarEvents } from "../lib/mockData";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Always 6 weeks (42 days), starting on the Sunday on or before the 1st. */
function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

export function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const days = useMemo(() => monthGrid(view.year, view.month), [view]);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof calendarEvents>();
    for (const e of calendarEvents) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, []);

  const shiftMonth = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  const shiftYear = (delta: number) => setView(({ year, month }) => ({ year: year + delta, month }));

  return (
    <div className="page">
      <p className="muted">{formatDayLine(today)}</p>

      <section className="calendar card" aria-label={`${MONTHS[view.month]} ${view.year}`}>
        <header className="calendar-head">
          <div className="calendar-nav">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              ←
            </button>
            <h1 aria-live="polite">{MONTHS[view.month]}</h1>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
              →
            </button>
          </div>
          <div className="calendar-nav">
            <button type="button" onClick={() => shiftYear(-1)} aria-label="Previous year">
              ←
            </button>
            <span className="calendar-year">{view.year}</span>
            <button type="button" onClick={() => shiftYear(1)} aria-label="Next year">
              →
            </button>
          </div>
        </header>

        <div className="calendar-grid" role="grid">
          <div className="calendar-row" role="row">
            {WEEKDAYS.map((d) => (
              <div key={d} className="weekday" role="columnheader">
                {d}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, w) => (
            <div className="calendar-row" role="row" key={w}>
              {days.slice(w * 7, w * 7 + 7).map((d) => {
                const events = eventsByDay.get(toISO(d)) ?? [];
                const outside = d.getMonth() !== view.month;
                const isToday = isSameDay(d, today);
                return (
                  <div
                    key={toISO(d)}
                    role="gridcell"
                    className={`day${outside ? " outside" : ""}${isToday ? " today" : ""}`}
                    aria-label={`${d.toDateString()}${events.length ? `, ${events.map((e) => e.label).join(", ")}` : ""}`}
                  >
                    <span className="day-number">{d.getDate()}</span>
                    {events.map((e) => (
                      <span key={e.label} className={`event ${e.kind}`}>
                        {e.label}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
