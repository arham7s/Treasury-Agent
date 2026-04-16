# Treasury AI Agent

> **A live treasury operations cockpit** — cash visibility, liquidity monitoring, bank alert review, workflow actions, and calendar scheduling in one control center.

Built with React + Express, integrated with Gmail and Google Calendar, and deployed on Vercel.

https://frontend-omega-roan-64.vercel.app

---

## Dashboard Overview

![Treasury AI Agent – Dashboard Overview](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Dashboard%20Overview.png)

The main dashboard surfaces four KPI cards (Total Cash, Available Liquidity, Pending Outflows, 7-Day Forecast), a cash position trend chart with variance indicator, a daily inflow/outflow breakdown, forecast notes, and a Quick Actions sidebar — all in one view.

---

## What This Project Does

Treasury AI Agent is a working control center, not a static mock. Core capabilities:

- **Cash & liquidity monitoring** — KPI cards, trend charts, and account health indicators
- **Account-level visibility** — operating, corporate, FX, and reserve balance tracking with thresholds and coverage percentages
- **Operational anomaly queue** — payment exceptions, low balance alerts, and forecast variance incidents with severity tagging
- **Daily cash report** — generated and delivered via Gmail with full position snapshot
- **Gmail bank alert scanning** — scans inbox for treasury-relevant messages
- **Google Calendar review booking** — creates calendar events and sends confirmation emails
- **Forecast workspace** — trend visualization with variance summary and next-action notes
- **No-cost treasury chatbot** — mock treasury assistant with suggestion chips, no LLM spend required
- **Dark / light theme** — full toggle with a control-center aesthetic

---

## Screenshots

### Accounts & Allocation View

![Treasury AI Agent – Accounts and Allocation View](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Accounts%20and%20Allocation%20View.png)

Compact account cards with balance, health status (Healthy / Below Threshold / Stable), threshold vs. target bar, and coverage percentage. Allocation mix donut on the right, plus a priority queue surfacing the next approvals above the fold.

---

### Accounts Management

![Treasury AI Agent – Accounts Management](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Accounts%20Management.png)

Dedicated account view with connector health diagnostics in the sidebar and two account action shortcuts — Create payment instruction and Refresh forecast for liquidity balances.

---

### Forecast Monitoring View

![Treasury AI Agent – Forecast Monitoring View](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Forecast%20Monitoring%20View.png)

Focused forecast workspace showing actual cash (blue) vs. forecast (red dashed) across the week. Variance snapshot card (-14%, below weekly target) and next-steps panel with a direct action button.

---

### Alerts & Incident Queue

![Treasury AI Agent – Alerts and Incident Queue](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Alerts%20and%20Incident%20Queue.png)

Three live anomalies — Unusual vendor payment (High), Low balance alert (Med), Forecast variance (Info) — each with source, amount, detection time, and Review / Assign / Escalate actions. Trigger a fresh Gmail bank alert scan with one button.

---

### Payment Action Console

![Treasury AI Agent – Payment Action Console](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Payment%20Action%20Console.png)

Left panel is the Action Console — five workflow cards covering Daily Cash Report, Draft Payment, Run Anomaly Scan, Generate Forecast, Review Bank Alerts, and Schedule Treasury Review. Right panel renders a live Draft Payment detail for Apex Logistics with beneficiary, amount, debit account, and hold control.

---

### Schedule Review Workflow

![Treasury AI Agent – Schedule Review Workflow](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Schedule%20Review%20Workflow.png)

Slot picker with three quick-select times, manual date/time/duration/email fields, and a Book Slot button that creates a Google Calendar event and dispatches a confirmation email with the full treasury agenda.

---

### Assistant Interaction Panel

![Treasury AI Agent – Assistant Interaction Panel](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Assistant%20Interaction%20Panel.png)

No-cost mock treasury assistant running locally. Opens with a cash position brief, suggestion chips for common queries, and a conversational thread. No paid LLM usage.

---

### Audit Log Overview

![Treasury AI Agent – Audit Log Overview](https://github.com/arham7s/Treasury-Agent/blob/main/Website/Treasury%20AI%20Agent%20–%20Audit%20Log%20Overview.png)

Timestamped operational event log covering calendar bookings, bank alert scans, daily report deliveries, and forecast flags — with category labels (Calendar workflow, Monitoring, Reporting, Forecast engine).

---

## Key Workflows

### 1 · Daily Cash Report
Generates a formatted position report and delivers it via Gmail. Includes total cash, available liquidity, pending outflows, forecast snapshot, account balances, and detected anomalies.

### 2 · Bank Email Review
Scans the Gmail inbox and filters treasury-relevant messages using keyword matching across bank alerts, statements, balances, payments, and treasury terms.

### 3 · Treasury Review Scheduling
User selects date, time, and duration. The system creates a Google Calendar event, adds a treasury-focused agenda, and sends a confirmation email with slot details and event link.

### 4 · Forecast Review
Trend chart with actual vs. forecast lines, variance summary card, recommended next actions, and a direct button into the forecast action workflow.

### 5 · Treasury Agent
Runs in no-cost local mock mode. Supports treasury-aware guidance with suggestion chips for cash position summary, forecast variance review, payment exception review, bank alert review, and schedule review.

---

## Architecture

```
treasury-agent/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── .env.production
│   └── .gitignore
└── README.md
```

### Frontend
React 19 · Create React App · CSS-in-JS style objects · Deployed on Vercel

### Backend
Node.js · Express 5 · Google APIs client (Gmail + Calendar + OAuth2) · Deployed on Vercel

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, React DOM, Create React App |
| Backend | Express, CORS, Google APIs |
| Auth | Google OAuth2 |
| Deployment | Vercel (frontend + backend) |

---

## Environment Variables

### Frontend

```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app
```

### Backend

```env
PORT=3001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.vercel.app/auth/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_SCOPE=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly
DEFAULT_NOTIFICATION_EMAIL=your_email@example.com
```

---

## Local Development

```bash
# Backend
cd backend
npm install
node server.js
# → http://localhost:3001

# Frontend
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## Production Deployment (Vercel)

**Frontend**
- Set Vercel project root to `frontend`
- Set `REACT_APP_API_BASE_URL` to the deployed backend URL
- Build command: `npm run build`

**Backend**
- Set Vercel project root to `backend`
- Add all Google OAuth environment variables in Vercel project settings
- Export the Express app from `server.js`
- Use `vercel.json` to route requests to the Express server

**Google OAuth note:** For production, the redirect URI must point to the deployed backend callback — e.g. `https://your-backend-url.vercel.app/auth/callback` — and that same URI must be registered in the Google Cloud Console under your OAuth client.

---

## Live Deployment

| | URL |
|---|---|
| Frontend | [https://frontend-omega-roan-64.vercel.app](https://frontend-omega-roan-64.vercel.app) |
| Backend | [https://backend-arhammm99-4151s-projects.vercel.app](https://backend-arhammm99-4151s-projects.vercel.app) |

---

## Security

Do **not** commit the following to version control:

```
backend/credentials.json
backend/token.json
```

Use Vercel environment variables for all secrets in production.

---

## Current Status

**Working**
- Treasury dashboard and control center UI
- Account and alert views
- Interactive action workflows
- Gmail daily cash report sending
- Gmail bank alert scanning
- Google Calendar booking and confirmation emails
- No-cost mock treasury chatbot
- Vercel frontend and backend deployments

**Intentionally lightweight**
- Chatbot responses are mock treasury logic, not live LLM calls
- Some action workflows are UI-oriented rather than connected to banking rails or ERP systems

---

## Roadmap

- Real LLM-backed treasury assistant
- Persistent database for audit and workflow history
- Bank API integration (beyond inbox scanning)
- Approval routing and role-based permissions
- Exportable audit packs and treasury reports
- Richer analytics and forecast modeling
- Task ownership for anomalies and exceptions

---

## Why This Exists

Treasury teams typically operate across email, spreadsheets, banking portals, and disconnected dashboards. This project brings together treasury visibility, workflow execution, calendar coordination, alert review, and lightweight AI guidance into one product surface.

Useful as an internal treasury operations dashboard, a finance workflow demo, a portfolio-ready fintech project, or a base for future treasury automation tooling.

---

## License

No formal license file included. Add one before open-sourcing or commercial distribution.
