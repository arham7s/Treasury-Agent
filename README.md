# Treasury AI Agent

Treasury AI Agent is a treasury operations cockpit built for cash visibility, liquidity monitoring, bank alert review, workflow actions, and treasury review scheduling.

It combines a polished React control center with an Express backend that integrates with Gmail and Google Calendar. The result is a lightweight internal treasury workspace where a finance or ops team can monitor balances, review exceptions, trigger workflows, and coordinate follow-up actions from one interface.

## What This Project Does

The product is designed as a working treasury control center rather than a static dashboard.

Core capabilities include:

- Cash and liquidity monitoring with KPI cards, trends, and account health indicators
- Account-level visibility across operating, corporate, FX, and reserve balances
- Operational anomaly queue for payment exceptions, low balance alerts, and forecast variance
- Daily cash report generation and delivery through Gmail
- Gmail bank alert scanning for treasury-related messages
- Google Calendar review booking with confirmation email delivery
- Forecast visualizations with hover values and decision support notes
- A no-cost treasury chatbot mode for internal guidance without paid LLM usage
- Dark and light themes with a control-center style interface

## Product Experience

The UI is organized as a treasury command center with:

- `Dashboard` for KPIs, charts, accounts, alerts, and connectors
- `Accounts` for account balances, health, thresholds, and liquidity posture
- `Payments` for draft payment and treasury action workflows
- `Forecasts` for cash trend analysis and variance review
- `Alerts` for bank scan results and anomaly handling
- `Audit Log` for recent treasury actions
- `Settings` for operational controls and preferences
- `Agent` for no-cost chat guidance and action suggestions
- `Actions` for treasury workflows such as cash reports, anomaly scans, Gmail review, and schedule booking

## Key Workflows

### 1. Daily Cash Report

The app can generate a formatted daily cash position report and send it through Gmail. The report includes:

- total cash
- available liquidity
- pending outflows
- forecast snapshot
- account balances
- anomalies detected

### 2. Bank Email Review

The backend scans recent Gmail inbox messages and filters treasury-relevant content using terms related to:

- bank alerts
- statements
- balances
- payments
- treasury workflows

### 3. Treasury Review Scheduling

Users can choose a date, time, and duration for a treasury review. When booked, the system:

- creates a Google Calendar event
- adds a treasury-focused agenda
- sends a confirmation email with slot details and event link

### 4. Forecast Review

The forecast workspace includes:

- Y-axis labels for readability
- hover values on chart points
- variance summary
- recommended next actions

### 5. Treasury Agent

The agent currently runs in a no-cost local mock mode. It supports treasury-aware conversational guidance and suggestion buttons for common next steps such as:

- cash position summary
- forecast variance review
- payment exception review
- bank alert review
- schedule review

## Architecture

This project is split into two parts:

### Frontend

- React 19
- Create React App
- Custom dashboard and workflow UI
- Deployed on Vercel

### Backend

- Node.js
- Express 5
- Google APIs client
- Gmail integration
- Google Calendar integration
- Deployed on Vercel

## Project Structure

```text
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

## Tech Stack

### Frontend

- React
- React DOM
- Create React App
- CSS-in-JS style objects inside the main app component

### Backend

- Express
- CORS
- Google APIs (`gmail`, `calendar`, OAuth2)

### Deployment

- Vercel frontend deployment
- Vercel backend deployment

## Environment Variables

### Frontend

The frontend reads the backend URL from:

```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app
```

### Backend

The backend supports environment-based Google OAuth configuration:

```env
PORT=3001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.vercel.app/auth/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_SCOPE=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly
DEFAULT_NOTIFICATION_EMAIL=your_email@example.com
```

## Local Development

### 1. Start the backend

```bash
cd backend
npm install
node server.js
```

Backend default:

```text
http://localhost:3001
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend default:

```text
http://localhost:3000
```

## Production Deployment

Both frontend and backend can be deployed to Vercel.

### Frontend deployment notes

- set the Vercel project root to `frontend`
- configure `REACT_APP_API_BASE_URL` to the deployed backend URL
- build command: `npm run build`

### Backend deployment notes

- set the Vercel project root to `backend`
- configure Google OAuth environment variables in the Vercel project
- export the Express app from `server.js`
- use `vercel.json` to route requests to the Express server

### Important Google OAuth note

For production, the redirect URI should point to the deployed backend callback, for example:

```text
https://your-backend-url.vercel.app/auth/callback
```

That same callback must also be added in the Google Cloud Console under your OAuth client configuration.

## Live Deployment

Current live URLs:

- Frontend: [https://frontend-omega-roan-64.vercel.app](https://frontend-omega-roan-64.vercel.app)
- Backend: [https://backend-arhammm99-4151s-projects.vercel.app](https://backend-arhammm99-4151s-projects.vercel.app)

## Security Notes

If you plan to publish this project to GitHub, do not commit live secrets or local auth artifacts.

Do not upload:

- `backend/credentials.json`
- `backend/token.json`
- any Google OAuth secrets
- any private API keys

Use environment variables in deployment instead.

## Current Status

What is working:

- treasury dashboard and control center UI
- account and alert views
- interactive action workflows
- Gmail daily cash report sending
- Gmail bank alert scanning
- Google Calendar booking
- review confirmation emails
- no-cost mock treasury chatbot
- Vercel frontend and backend deployments

What is intentionally lightweight right now:

- chatbot responses are mock treasury logic, not paid LLM responses
- some operational actions are workflow-oriented UI actions rather than deeply integrated ERP or banking rails

## Roadmap Ideas

Potential next upgrades:

- real LLM-backed treasury assistant
- persistent database for audit and workflow history
- bank API integration instead of inbox-only scanning
- approval routing and role-based permissions
- exportable audit packs and treasury reports
- richer analytics and forecast modeling
- real task ownership for anomalies and exceptions

## Why This Project Matters

Treasury teams often operate across email, spreadsheets, banking portals, and disconnected dashboards. This project brings together:

- treasury visibility
- workflow execution
- calendar coordination
- alert review
- lightweight operational AI guidance

in one product surface.

It is especially useful as:

- an internal treasury operations dashboard
- a finance workflow demo
- a portfolio-ready fintech operations project
- a base for future treasury automation tooling

## License

This repository currently does not include a formal license file. Add one before open-sourcing or commercial distribution if needed.
