# Tara, G!

Group sinking funds and an AI trip budget planner for your barkada. Built with Bun + React. The AI Planner calls Google Gemini from the Bun server (`POST /api/plan`), so the API key never reaches the browser.

## Setup

Install [Bun](https://bun.sh), then:

```bash
bun install
cp .env.example .env   # then put your key in GEMINI_API_KEY (Bun loads .env automatically)
```

## Run

```bash
bun dev            # development server with hot reload
bun start          # production mode
bun run build      # static bundle in dist/
bun run typecheck  # TypeScript check
```

## Project layout

```
src/
  index.ts              Bun server: serves the app and POST /api/plan
  planRoute.ts          validates the trip and streams the plan as server-sent events
  geminiService.js      Gemini call + server-side math check
  index.html, main.tsx  React entry
  App.tsx               routing (#/dashboard, #/groups, #/funds/<id>, #/calendar, #/planner) and mock login
  components/           sidebar, layout, donut, icons
  components/planner/   trip form, live stream panel, results, error card
  pages/                Login, Dashboard, Groups, Funds, Calendar, AI Planner
  lib/                  API client (SSE parsing), validation, formatting, demo data
  styles/               theme tokens (default / light / dark) and page styles
tests/                  edge-case request bodies (TC-01 … TC-06)
```

## Notes

- Login, groups, funds and calendar use demo data. Real accounts and saved groups are future work.
- The planner checks the form before sending (blank destination, zero or negative weeks / people, negative savings or amounts) and the server checks again.
