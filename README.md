# Job Tracker Dashboard

A React dashboard for tracking job applications — built as the frontend companion to the [Job Application Tracker API](https://github.com/BuhleB/job-tracker-api).

**Live demo:** _add your Netlify URL here_
**API docs:** https://job-tracker-api-1sca.onrender.com/docs

## Features

- **Pipeline overview** — see counts of applications at each stage (applied, interviewing, offer, accepted) at a glance
- **Status workflow** — move an application forward with a "Move to…" dropdown that only shows valid next states (e.g. you can't jump from "applied" straight to "accepted")
- **Overdue follow-up indicator** — the stats bar flags applications you haven't followed up on
- **Filter by status** — quickly narrow the list down to one stage of the pipeline
- **Inline delete with confirmation** — no accidental deletions
- **Add applications** — log a new application with company, role, date applied, and optional notes

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Deployed on Netlify

## Architecture

This dashboard is a static single-page app that talks to the [Job Tracker API](https://github.com/BuhleB/job-tracker-api) over HTTP. The API (FastAPI, Render) owns the business logic, including the status state machine that enforces valid transitions and rejects invalid ones with a 409. The dashboard is a thin client that renders state and calls the API.

## Running locally

```bash
git clone https://github.com/BuhleB/job-tracker-dashboard.git
cd job-tracker-dashboard
npm install
npm run dev
```

## Project structure

```
src/
├── App.tsx                  # Main app: filters, stats, application list
├── api.ts                   # All API calls
├── types.ts                 # TypeScript types, status colors, valid transitions
├── components/
│   ├── StatsBar.tsx          # Pipeline counts + overdue indicator
│   ├── ApplicationRow.tsx    # Card with status dropdown + delete
│   ├── AddModal.tsx          # Log application form
│   └── StatusBadge.tsx       # Colored status pill
└── index.css                 # Tailwind + custom component styles
```

## Coming next

- JWT authentication so this can be used as a real multi-user app
- Alembic migrations on the API side for safer schema changes
