import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3001';
const PRIMARY_USER_EMAIL = 'arhammm99@gmail.com';
const SUPPORT_EMAIL = 'cryptotesting999@gmail.com';

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'accounts', label: 'Accounts', icon: '◧' },
  { id: 'payments', label: 'Payments', icon: '◪' },
  { id: 'forecasts', label: 'Forecasts', icon: '◨' },
  { id: 'alerts', label: 'Alerts', icon: '◎' },
  { id: 'audit-log', label: 'Audit Log', icon: '▣' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

const accounts = [
  {
    name: 'HDFC Operating',
    bank: 'Operating account',
    currency: 'INR',
    balance: 9100000,
    displayBalance: '₹9.1M',
    health: 'Healthy',
    healthTone: 'success',
    target: 8500000,
    threshold: 7000000,
    lastUpdated: '2 min ago',
  },
  {
    name: 'SBI Corporate',
    bank: 'Corporate account',
    currency: 'INR',
    balance: 6800000,
    displayBalance: '₹6.8M',
    health: 'Below threshold',
    healthTone: 'warning',
    target: 8000000,
    threshold: 7000000,
    lastUpdated: '4 min ago',
  },
  {
    name: 'Citi USD',
    bank: 'FX reserve',
    currency: 'USD',
    balance: 5300000,
    displayBalance: '$5.3M',
    health: 'Stable',
    healthTone: 'info',
    target: 5000000,
    threshold: 4000000,
    lastUpdated: '6 min ago',
  },
  {
    name: 'Reserve Fund',
    bank: 'Liquidity buffer',
    currency: 'USD',
    balance: 3500000,
    displayBalance: '$3.5M',
    health: 'Healthy',
    healthTone: 'success',
    target: 3000000,
    threshold: 2500000,
    lastUpdated: '8 min ago',
  },
];

const anomalies = [
  {
    id: 'anom-1',
    severity: 'High',
    title: 'Unusual vendor payment',
    amount: '₹82L',
    source: 'Apex Logistics / ACC-4491',
    detectedAt: '12 min ago',
    description: 'No PO match found for a high-value vendor transfer queued from HDFC Operating.',
    recommendation: 'Hold payment, verify vendor packet, and route to AP controller.',
  },
  {
    id: 'anom-2',
    severity: 'Med',
    title: 'Low balance alert',
    amount: '$6.8M',
    source: 'SBI Corporate',
    detectedAt: '21 min ago',
    description: 'Corporate balance is now below the weekly operating threshold for outgoing settlements.',
    recommendation: 'Top up from HDFC Operating or Reserve Fund before 5 PM.',
  },
  {
    id: 'anom-3',
    severity: 'Info',
    title: 'Forecast variance',
    amount: '-14%',
    source: '7-day forecast',
    detectedAt: '35 min ago',
    description: 'Projected close is trailing last week’s run rate because of clustered supplier outflows.',
    recommendation: 'Review forecast assumptions and rebalance liquidity coverage.',
  },
];

const auditEntries = [
  {
    id: 'audit-1',
    title: 'Treasury review booked',
    meta: 'Calendar workflow',
    detail: 'A calendar slot was booked and a confirmation email was dispatched.',
    time: 'Just now',
  },
  {
    id: 'audit-2',
    title: 'Bank alert scan completed',
    meta: 'Monitoring',
    detail: 'Latest Gmail scan returned treasury-related messages for review.',
    time: '4 min ago',
  },
  {
    id: 'audit-3',
    title: 'Daily cash report sent',
    meta: 'Reporting',
    detail: 'Cash report was emailed successfully through Gmail.',
    time: '12 min ago',
  },
  {
    id: 'audit-4',
    title: 'Forecast variance flagged',
    meta: 'Forecast engine',
    detail: '7-day forecast dropped 14% below the weekly target threshold.',
    time: '35 min ago',
  },
];

const actionDefinitions = [
  {
    key: 'draft-payment',
    icon: '💸',
    title: 'Draft Payment',
    sub: 'Create payment instruction',
    statusLine: '2 drafts pending',
    group: 'Payments',
    accent: 'primary',
  },
  {
    key: 'anomaly-scan',
    icon: '🔍',
    title: 'Run Anomaly Scan',
    sub: 'Check all high-value transactions',
    statusLine: 'Last scan: 15 min ago',
    group: 'Monitoring',
    accent: 'danger',
  },
  {
    key: 'cash-forecast',
    icon: '📈',
    title: 'Generate Forecast',
    sub: 'Refresh 30-day liquidity outlook',
    statusLine: 'Variance updated',
    group: 'Forecasting',
    accent: 'success',
  },
  {
    key: 'bank-emails',
    icon: '📧',
    title: 'Review Bank Alerts',
    sub: 'Scan Gmail for treasury alerts',
    statusLine: 'Live Gmail scan',
    group: 'Monitoring',
    accent: 'warning',
  },
  {
    key: 'schedule-review',
    icon: '📅',
    title: 'Schedule Treasury Review',
    sub: 'Book and confirm a calendar slot',
    statusLine: 'Sends calendar + email confirmation',
    group: 'Calendar / Workflow',
    accent: 'info',
  },
];

const metricCards = [
  {
    key: 'cash',
    label: 'Total Cash',
    value: '$24.7M',
    change: '+$1.2M today',
    decisionText: 'Healthy liquidity cushion',
    tone: 'success',
    icon: '↗',
    trend: [19, 22, 24, 23, 25, 24, 27],
    actionKey: 'cash-forecast',
  },
  {
    key: 'liquidity',
    label: 'Available Liquidity',
    value: '$18.3M',
    change: '87% of target',
    decisionText: 'Within policy band',
    tone: 'success',
    icon: '◎',
    trend: [16, 17, 18, 18.2, 18.1, 18.5, 18.3],
    actionKey: 'cash-forecast',
  },
  {
    key: 'outflows',
    label: 'Pending Outflows',
    value: '$4.1M',
    change: '3 critical payments due today',
    decisionText: 'Monitor cut-off windows',
    tone: 'warning',
    icon: '▲',
    trend: [1.8, 2.1, 2.3, 3.2, 3.6, 3.9, 4.1],
    actionKey: 'draft-payment',
  },
  {
    key: 'forecast',
    label: '7-Day Forecast',
    value: '$21.2M',
    change: 'Below weekly target by 14%',
    decisionText: 'Needs variance review',
    tone: 'danger',
    icon: '▼',
    trend: [26, 25.4, 24.8, 24.1, 23.3, 22.5, 21.2],
    actionKey: 'cash-forecast',
  },
];

const cashTrendSeries = [22.6, 22.9, 23.8, 23.4, 24.1, 24.4, 24.7];
const forecastSeries = [24.8, 24.4, 24.1, 23.9, 23.2, 22.7, 21.2];
const flowSeries = [
  { label: 'Mon', inflow: 2.4, outflow: 1.7 },
  { label: 'Tue', inflow: 3.3, outflow: 2.2 },
  { label: 'Wed', inflow: 2.8, outflow: 2.9 },
  { label: 'Thu', inflow: 3.7, outflow: 3.4 },
  { label: 'Fri', inflow: 2.5, outflow: 4.1 },
];

const baseActionContent = {
  'draft-payment': {
    status: 'Draft ready for approval',
    accent: 'primary',
    summary: 'Prepared a payment instruction for today’s highest-priority vendor outflow.',
    details: [
      { type: 'text', value: 'Beneficiary: Apex Logistics Pvt Ltd' },
      { type: 'text', value: 'Amount: ₹82,00,000' },
      { type: 'text', value: 'Debit account: HDFC Operating' },
      { type: 'text', value: 'Control: Hold until PO packet is matched' },
    ],
    agentMessage: 'Drafted a payment instruction for Apex Logistics and flagged it for approval because the PO is missing.',
  },
  'anomaly-scan': {
    status: 'Scan prepared',
    accent: 'danger',
    summary: 'Current exception queue is centered on a vendor mismatch, a balance threshold issue, and forecast underperformance.',
    details: anomalies.map(item => ({
      type: 'text',
      value: `${item.severity} | ${item.title} | ${item.amount} | ${item.detectedAt}`,
    })),
    agentMessage: 'Anomaly scan is ready. The key risk remains the unmatched vendor payment, followed by the SBI threshold alert.',
  },
  'cash-forecast': {
    status: 'Forecast refreshed',
    accent: 'success',
    summary: '30-day liquidity outlook stays positive, but the near-term trough suggests a buffer rebalance.',
    details: [
      { type: 'text', value: 'Expected trough: $18.9M on Apr 26' },
      { type: 'text', value: 'Largest expected outflow: $4.1M supplier settlement' },
      { type: 'text', value: 'Recommendation: Move $1.5M into SBI Corporate this week' },
    ],
    agentMessage: 'Forecast refreshed. Liquidity stays positive, but a top-up into SBI Corporate would remove the threshold risk.',
  },
  'bank-emails': {
    status: 'Ready to scan inbox',
    accent: 'warning',
    summary: 'Scans Gmail for recent treasury-related alerts from banks, settlement systems, and treasury workflows.',
    details: [
      { type: 'text', value: 'Checks for balance, statement, settlement, treasury, and payment keywords.' },
      { type: 'text', value: 'Will surface recent matches directly in this action panel.' },
    ],
    agentMessage: 'Bank email scan is ready. I can pull the latest treasury-related Gmail alerts into this panel.',
  },
  'schedule-review': {
    status: 'Choose a slot',
    accent: 'info',
    summary: 'Select a date, start time, and recipient email, then book the treasury review and send a confirmation automatically.',
    details: [
      { type: 'text', value: 'Booking creates a Google Calendar event.' },
      { type: 'text', value: 'A confirmation email is sent with slot details and the agenda.' },
      { type: 'text', value: 'Suggested agenda: low balance alert, unmatched vendor payment, forecast variance.' },
    ],
    agentMessage: 'Schedule review is ready. Pick the slot that works best and I will book it with an email confirmation.',
  },
};

function getTheme(mode) {
  if (mode === 'dark') {
    return {
      mode,
      background: '#0a1222',
      pageGradient: 'radial-gradient(circle at top right, rgba(45,98,255,0.16), transparent 28%), radial-gradient(circle at top left, rgba(14,165,233,0.14), transparent 24%), #0a1222',
      shell: '#111b31',
      shellBorder: 'rgba(148,163,184,0.18)',
      text: '#eef4ff',
      textMuted: '#8ba0c6',
      textSoft: '#6c84ab',
      sectionTitle: '#f8fbff',
      card: '#111a2f',
      cardStrong: '#15213a',
      cardMuted: '#0f172a',
      surface: '#18233f',
      border: 'rgba(148,163,184,0.18)',
      primary: '#6ea8ff',
      primaryStrong: '#4d8eff',
      success: '#31c48d',
      warning: '#ffb74d',
      danger: '#ff6b6b',
      info: '#64d2ff',
      successBg: 'rgba(49,196,141,0.14)',
      warningBg: 'rgba(255,183,77,0.14)',
      dangerBg: 'rgba(255,107,107,0.14)',
      infoBg: 'rgba(100,210,255,0.14)',
      shadow: '0 22px 60px rgba(2,6,23,0.32)',
      headerBadge: 'rgba(49,196,141,0.16)',
      inputBg: '#0d1528',
      chartGrid: 'rgba(148,163,184,0.16)',
      footer: '#7f93b7',
      line: '#22324f',
    };
  }

  return {
    mode,
    background: '#edf4fb',
    pageGradient: 'radial-gradient(circle at top right, rgba(29,78,216,0.09), transparent 28%), radial-gradient(circle at top left, rgba(14,165,233,0.08), transparent 24%), #edf4fb',
    shell: '#f8fbff',
    shellBorder: 'rgba(148,163,184,0.22)',
    text: '#14213d',
    textMuted: '#6b7a90',
    textSoft: '#93a3bb',
    sectionTitle: '#0f172a',
    card: '#ffffff',
    cardStrong: '#f9fbff',
    cardMuted: '#f2f7ff',
    surface: '#ffffff',
    border: 'rgba(148,163,184,0.24)',
    primary: '#1d4ed8',
    primaryStrong: '#0f3fbf',
    success: '#1f9d68',
    warning: '#c97a00',
    danger: '#d64545',
    info: '#1177c0',
    successBg: 'rgba(31,157,104,0.11)',
    warningBg: 'rgba(201,122,0,0.11)',
    dangerBg: 'rgba(214,69,69,0.11)',
    infoBg: 'rgba(17,119,192,0.11)',
    shadow: '0 22px 60px rgba(15,23,42,0.08)',
    headerBadge: 'rgba(31,157,104,0.12)',
    inputBg: '#ffffff',
    chartGrid: 'rgba(148,163,184,0.18)',
    footer: '#607089',
    line: '#d9e5f3',
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function getTomorrowAt(hour, minute) {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(hour, minute, 0, 0);
  return next;
}

function formatDateInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeInputValue(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCompactMoney(value, currency) {
  const symbol = currency === 'INR' ? '₹' : '$';
  if (value >= 1000000) {
    return `${symbol}${(value / 1000000).toFixed(1)}M`;
  }
  return `${symbol}${value.toLocaleString()}`;
}

function parseJsonResponse(response) {
  return response.json().then(data => {
    if (!response.ok) {
      throw data;
    }
    return data;
  });
}

function toneColor(theme, tone) {
  if (tone === 'success') return theme.success;
  if (tone === 'warning') return theme.warning;
  if (tone === 'danger') return theme.danger;
  return theme.info;
}

function toneBg(theme, tone) {
  if (tone === 'success') return theme.successBg;
  if (tone === 'warning') return theme.warningBg;
  if (tone === 'danger') return theme.dangerBg;
  return theme.infoBg;
}

function ThemeToggleButton({ mode, onToggle, theme, compact = false }) {
  const isLight = mode === 'light';
  const icon = isLight ? '☾' : '☀';

  return (
    <button
      type="button"
      className="ui-hover"
      onClick={onToggle}
      style={{
        border: `1px solid ${theme.border}`,
        background: theme.card,
        color: theme.text,
        borderRadius: 18,
        padding: compact ? '10px' : '12px',
        cursor: 'pointer',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: compact ? 54 : 58,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: toneBg(theme, isLight ? 'info' : 'warning'),
          color: isLight ? theme.primary : theme.warning,
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
    </button>
  );
}

function getAgentReply(input) {
  const normalized = input.toLowerCase();

  if (normalized.includes('cash') || normalized.includes('liquidity')) {
    return 'Total cash is $24.7M, available liquidity is $18.3M, and the primary funding gap is SBI Corporate sitting below threshold.';
  }

  if (normalized.includes('anomaly') || normalized.includes('risk')) {
    return 'The highest-priority issue is the ₹82L vendor payment without a PO match. The next operational issue is the SBI balance breach.';
  }

  if (normalized.includes('forecast')) {
    return 'The 7-day forecast is $21.2M, which is 14% below the weekly target. The likely fix is a buffer rebalance into SBI Corporate.';
  }

  if (normalized.includes('email') || normalized.includes('gmail')) {
    return 'The Gmail integration is live for both daily cash reports and bank alert scanning.';
  }

  if (normalized.includes('calendar') || normalized.includes('review')) {
    return 'The schedule review flow now supports custom date, time, duration, and confirmation email delivery.';
  }

  return 'I can help with liquidity, payments, bank alerts, forecast variance, or booking treasury reviews. Try asking about the next action you want to take.';
}

function buildAuthRequiredContent(actionKey, data) {
  const calendarFlow = actionKey === 'schedule-review';
  return {
    status: 'Google permission needed',
    accent: 'danger',
    summary: calendarFlow
      ? 'Google Calendar access is required before the review can be booked.'
      : 'Gmail inbox read access is required before alerts can be scanned.',
    details: [
      { type: 'text', value: data.error || 'Additional Google permissions are required.' },
      { type: 'text', value: `Missing scopes: ${(data.missingScopes || []).join(', ') || 'Unknown'}` },
      data.reauthUrl
        ? { type: 'link', label: 'Reconnect Google access', href: data.reauthUrl }
        : { type: 'text', value: 'Use the Google reconnect flow to refresh access.' },
    ],
  };
}

function buildBankEmailContent(data) {
  const emails = data.emails || [];

  if (!emails.length) {
    return {
      status: 'No recent bank alerts found',
      accent: 'info',
      summary: 'The latest inbox scan completed cleanly, but there were no new treasury-related email matches.',
      details: [
        { type: 'text', value: `Checked at: ${new Date(data.checkedAt).toLocaleString()}` },
        { type: 'text', value: 'No matching balance, statement, payment, or alert emails were found.' },
      ],
    };
  }

  return {
    status: `${emails.length} live alerts found`,
    accent: 'info',
    summary: 'Recent treasury-related Gmail messages have been surfaced for review.',
    details: emails.map(email => ({
      type: 'text',
      value: `${email.subject || '(No subject)'} | ${email.from || 'Unknown sender'} | ${new Date(email.date || Date.now()).toLocaleString()}`,
    })),
  };
}

function buildScheduleContent(data) {
  return {
    status: 'Calendar event created',
    accent: 'success',
    summary: data.confirmationEmailSent
      ? 'Treasury review booked successfully and the confirmation email was sent.'
      : 'Treasury review booked successfully, but the confirmation email could not be sent.',
    details: [
      {
        type: 'text',
        value: `${data.event.summary} | ${new Date(data.event.start).toLocaleString()} to ${new Date(data.event.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
      },
      { type: 'text', value: `Confirmation recipient: ${data.recipientEmail}` },
      ...(data.agenda || []).map(item => ({ type: 'text', value: item })),
      data.event.htmlLink ? { type: 'link', label: 'Open calendar event', href: data.event.htmlLink } : { type: 'text', value: 'Calendar event created.' },
    ],
  };
}

function Sparkline({ data, color, mutedColor }) {
  const width = 120;
  const height = 44;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (width - 4) + 2;
      const y = height - (((value - min) / Math.max(max - min, 1)) * (height - 10) + 5);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={mutedColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaTrendChart({ theme, cashData, forecastData }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const width = 520;
  const height = 240;
  const leftPad = 52;
  const rightPad = 16;
  const topPad = 24;
  const bottomPad = 24;
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const all = [...cashData, ...forecastData];
  const max = Math.max(...all);
  const min = Math.min(...all);
  const range = Math.max(max - min, 1);
  const tickCount = 4;
  const tickValues = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    return Number((max - ratio * range).toFixed(1));
  });

  function toPoints(data) {
    return data.map((value, index) => {
      const x = leftPad + (index / (data.length - 1)) * (width - leftPad - rightPad);
      const y = height - bottomPad - ((value - min) / range) * (height - topPad - bottomPad);
      return { x, y, value };
    });
  }

  const cashPoints = toPoints(cashData);
  const forecastPoints = toPoints(forecastData);
  const cashPath = cashPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const forecastPath = forecastPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${cashPath} L ${cashPoints[cashPoints.length - 1].x} ${height - bottomPad} L ${cashPoints[0].x} ${height - bottomPad} Z`;
  const activeCashPoint = hoveredIndex !== null ? cashPoints[hoveredIndex] : null;
  const activeForecastPoint = hoveredIndex !== null ? forecastPoints[hoveredIndex] : null;
  const activeX = activeCashPoint ? activeCashPoint.x : null;

  return (
    <div style={{ position: 'relative' }}>
      {hoveredIndex !== null && activeCashPoint && activeForecastPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(activeX / width) * 100}%`,
            top: 8,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 1,
            minWidth: 132,
            borderRadius: 14,
            padding: '10px 12px',
            background: theme.card,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.sectionTitle }}>{labels[hoveredIndex]}</div>
          <div style={{ fontSize: 12, color: theme.primary, marginTop: 4 }}>Actual: ${activeCashPoint.value.toFixed(1)}M</div>
          <div style={{ fontSize: 12, color: theme.danger, marginTop: 2 }}>Forecast: ${activeForecastPoint.value.toFixed(1)}M</div>
        </div>
      )}

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }} aria-hidden="true">
        {tickValues.map(value => {
          const y = height - bottomPad - ((value - min) / range) * (height - topPad - bottomPad);
          return (
            <g key={value}>
              <line x1={leftPad} x2={width - rightPad} y1={y} y2={y} stroke={theme.chartGrid} strokeWidth="1" />
              <text x={leftPad - 10} y={y + 4} fill={theme.textMuted} fontSize="11" textAnchor="end">
                ${value.toFixed(1)}M
              </text>
            </g>
          );
        })}

        <line x1={leftPad} x2={leftPad} y1={topPad} y2={height - bottomPad} stroke={theme.chartGrid} strokeWidth="1" />
        <path d={areaPath} fill={theme.mode === 'dark' ? 'rgba(110,168,255,0.16)' : 'rgba(29,78,216,0.14)'} />
        <path d={cashPath} fill="none" stroke={theme.primary} strokeWidth="3" strokeLinecap="round" />
        <path d={forecastPath} fill="none" stroke={theme.danger} strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round" />

        {activeX !== null && (
          <line x1={activeX} x2={activeX} y1={topPad} y2={height - bottomPad} stroke={theme.textMuted} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.8" />
        )}

        {cashPoints.map((point, index) => (
          <circle
            key={`cash-${point.x}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === index ? 6 : 3.5}
            fill={theme.primary}
          />
        ))}
        {forecastPoints.map((point, index) => (
          <circle
            key={`forecast-${point.x}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === index ? 5 : 3}
            fill={theme.danger}
          />
        ))}

        {labels.map((label, index) => {
          const x = leftPad + (index / (labels.length - 1)) * (width - leftPad - rightPad);
          const nextX = index < labels.length - 1
            ? leftPad + ((index + 1) / (labels.length - 1)) * (width - leftPad - rightPad)
            : x + ((width - leftPad - rightPad) / (labels.length - 1));
          const rectWidth = Math.max(nextX - x, 32);

          return (
            <g key={label}>
              <rect
                x={x - rectWidth / 2}
                y={topPad}
                width={rectWidth}
                height={height - topPad - bottomPad}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text x={x} y={height - 8} fill={theme.textMuted} fontSize="11" textAnchor="middle">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FlowBars({ theme }) {
  const max = Math.max(...flowSeries.flatMap(item => [item.inflow, item.outflow]));

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {flowSeries.map(item => (
        <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: theme.textMuted }}>{item.label}</div>
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr 48px', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: theme.textMuted }}>Inflow</span>
              <div style={{ height: 8, borderRadius: 999, background: theme.chartGrid, overflow: 'hidden' }}>
                <div style={{ width: `${(item.inflow / max) * 100}%`, height: '100%', background: theme.success, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: theme.text }}>{item.inflow.toFixed(1)}M</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr 48px', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: theme.textMuted }}>Outflow</span>
              <div style={{ height: 8, borderRadius: 999, background: theme.chartGrid, overflow: 'hidden' }}>
                <div style={{ width: `${(item.outflow / max) * 100}%`, height: '100%', background: theme.warning, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: theme.text }}>{item.outflow.toFixed(1)}M</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ theme, values }) {
  const total = values.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r="58" fill="none" stroke={theme.chartGrid} strokeWidth="20" />
      {values.map(item => {
        const circumference = 2 * Math.PI * 58;
        const length = (item.value / total) * circumference;
        const dashArray = `${length} ${circumference - length}`;
        const dashOffset = -offset;
        offset += length;
        return (
          <circle
            key={item.label}
            cx="90"
            cy="90"
            r="58"
            fill="none"
            stroke={item.color}
            strokeWidth="20"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 90 90)"
            strokeLinecap="round"
          />
        );
      })}
      <text x="90" y="84" textAnchor="middle" fill={theme.textMuted} fontSize="11">Accounts</text>
      <text x="90" y="104" textAnchor="middle" fill={theme.text} fontSize="20" fontWeight="700">$24.7M</text>
    </svg>
  );
}

function DetailItem({ detail, theme }) {
  if (detail.type === 'link') {
    return (
      <a
        href={detail.href}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'block',
          textDecoration: 'none',
          borderRadius: 14,
          padding: '12px 14px',
          fontSize: 13,
          color: theme.primary,
          background: theme.cardMuted,
          border: `1px solid ${theme.border}`,
        }}
      >
        {detail.label}
      </a>
    );
  }

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '12px 14px',
        fontSize: 13,
        color: theme.text,
        background: theme.cardMuted,
        border: `1px solid ${theme.border}`,
      }}
    >
      {detail.value}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('light');
  const [tab, setTab] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: 'Good morning. Total cash stands at $24.7M with one urgent payment anomaly, one balance breach, and a forecast variance to review.',
      suggestions: ['Cash position summary', 'Forecast variance', 'Payment exception review'],
    },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedAction, setSelectedAction] = useState('schedule-review');
  const [actionContent, setActionContent] = useState(baseActionContent);
  const [loadingActions, setLoadingActions] = useState({});
  const [lastSync, setLastSync] = useState(new Date());
  const [connectors, setConnectors] = useState({
    loading: true,
    gmail: false,
    calendar: false,
    bankScan: false,
  });
  const [scheduleForm, setScheduleForm] = useState(() => {
    const defaultStart = getTomorrowAt(10, 0);
    return {
      date: formatDateInputValue(defaultStart),
      time: formatTimeInputValue(defaultStart),
      durationMinutes: 30,
      recipientEmail: PRIMARY_USER_EMAIL,
    };
  });

  const theme = getTheme(mode);
  const selectedActionContent = actionContent[selectedAction];

  useEffect(() => {
    refreshConnectors();
  }, []);

  async function refreshConnectors() {
    try {
      const status = await parseJsonResponse(await fetch(`${API_BASE}/auth/status`));
      const granted = status.grantedScopes || [];
      setConnectors({
        loading: false,
        gmail: granted.includes('https://www.googleapis.com/auth/gmail.send'),
        calendar: granted.includes('https://www.googleapis.com/auth/calendar.events'),
        bankScan: granted.includes('https://www.googleapis.com/auth/gmail.readonly'),
      });
      setLastSync(new Date());
    } catch (error) {
      setConnectors({
        loading: false,
        gmail: false,
        calendar: false,
        bankScan: false,
      });
    }
  }

  function pushAgentMessage(text, suggestions = []) {
    setMessages(prev => [...prev, { role: 'agent', text, suggestions }]);
  }

  function updateActionContent(actionKey, nextContent) {
    setActionContent(prev => ({
      ...prev,
      [actionKey]: {
        ...prev[actionKey],
        ...nextContent,
      },
    }));
  }

  function openAction(actionKey) {
    setSelectedAction(actionKey);
    setTab('actions');
    pushAgentMessage(baseActionContent[actionKey].agentMessage);
  }

  function openModule(moduleId) {
    setActiveModule(moduleId);

    if (moduleId === 'payments') {
      setSelectedAction('draft-payment');
      setTab('actions');
      return;
    }

    if (moduleId === 'dashboard') {
      setTab('dashboard');
      return;
    }

    setTab('dashboard');
  }

  function applySchedulePreset(hour, minute, durationMinutes) {
    const next = getTomorrowAt(hour, minute);
    setScheduleForm(prev => ({
      ...prev,
      date: formatDateInputValue(next),
      time: formatTimeInputValue(next),
      durationMinutes,
    }));
  }

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    if (!overrideText) {
      setInput('');
    }
    setChatLoading(true);

    try {
      const data = await parseJsonResponse(
        await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })
      );

      pushAgentMessage(data.reply, data.suggestions || []);
    } catch (error) {
      pushAgentMessage(getAgentReply(text));
    } finally {
      setChatLoading(false);
    }
  }

  function handleSuggestionClick(suggestion) {
    if (chatLoading) return;
    sendMessage(suggestion);
  }

  async function sendCashReport() {
    setSendingEmail(true);
    setEmailStatus('Sending daily report...');

    try {
      const today = new Date();
      const subject = `Daily Cash Report (${today.toLocaleDateString('en-US')}) - Treasury AI Agent`;

      const data = await parseJsonResponse(
        await fetch(`${API_BASE}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: scheduleForm.recipientEmail || PRIMARY_USER_EMAIL,
            subject,
          }),
        })
      );

      setEmailStatus(data.message || 'Report sent');
      pushAgentMessage('Daily cash report sent successfully through Gmail.');
      setLastSync(new Date());
    } catch (error) {
      const message = error.reauthUrl ? 'Reconnect Google to send daily reports.' : (error.error || 'Could not reach the backend.');
      setEmailStatus(message);
      pushAgentMessage(`Daily cash report send failed: ${message}`);
    }

    setSendingEmail(false);
  }

  async function runBankEmailScan() {
    const actionKey = 'bank-emails';
    setSelectedAction(actionKey);
    setTab('actions');
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
    updateActionContent(actionKey, {
      status: 'Scanning live inbox...',
      accent: 'warning',
      summary: 'Checking recent Gmail messages for treasury-related bank alerts.',
      details: [{ type: 'text', value: 'Reviewing the latest inbox items now.' }],
    });

    try {
      const data = await parseJsonResponse(await fetch(`${API_BASE}/bank-emails`));
      updateActionContent(actionKey, buildBankEmailContent(data));
      pushAgentMessage(
        data.count > 0
          ? `Bank alert scan finished with ${data.count} matching Gmail message${data.count === 1 ? '' : 's'}.`
          : 'Bank alert scan finished with no new treasury-related email matches.'
      );
      setLastSync(new Date());
    } catch (error) {
      const next = error.reauthUrl
        ? buildAuthRequiredContent(actionKey, error)
        : {
            status: 'Inbox scan failed',
            accent: 'danger',
            summary: 'The Gmail inbox scan could not be completed.',
            details: [{ type: 'text', value: error.error || 'Unknown Gmail scan error.' }],
          };
      updateActionContent(actionKey, next);
      pushAgentMessage(next.summary);
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  }

  async function runScheduleReview() {
    const actionKey = 'schedule-review';
    const selectedStart = new Date(`${scheduleForm.date}T${scheduleForm.time}`);

    setSelectedAction(actionKey);
    setTab('actions');
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

    if (Number.isNaN(selectedStart.getTime())) {
      updateActionContent(actionKey, {
        status: 'Choose a valid slot',
        accent: 'danger',
        summary: 'Please choose a valid date and time before booking the treasury review.',
        details: [{ type: 'text', value: 'The selected date or time was not valid.' }],
      });
      pushAgentMessage('Please choose a valid date and time before booking the treasury review.');
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
      return;
    }

    updateActionContent(actionKey, {
      status: 'Booking selected slot...',
      accent: 'info',
      summary: 'Creating the calendar event and sending the confirmation email.',
      details: [
        {
          type: 'text',
          value: `Booking ${selectedStart.toLocaleString()} for ${scheduleForm.durationMinutes} minutes and notifying ${scheduleForm.recipientEmail}.`,
        },
      ],
    });

    try {
      const data = await parseJsonResponse(
        await fetch(`${API_BASE}/schedule-review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDateTime: selectedStart.toISOString(),
            durationMinutes: scheduleForm.durationMinutes,
            summary: 'Treasury Review',
            recipientEmail: scheduleForm.recipientEmail || PRIMARY_USER_EMAIL,
          }),
        })
      );

      updateActionContent(actionKey, buildScheduleContent(data));
      pushAgentMessage(
        data.confirmationEmailSent
          ? 'Treasury review booked successfully and the confirmation email was delivered.'
          : 'Treasury review was booked, but the confirmation email could not be delivered.'
      );
      setLastSync(new Date());
    } catch (error) {
      const next = error.reauthUrl
        ? buildAuthRequiredContent(actionKey, error)
        : {
            status: 'Booking failed',
            accent: 'danger',
            summary: 'The treasury review could not be added to Google Calendar.',
            details: [{ type: 'text', value: error.error || 'Unknown scheduling error.' }],
          };
      updateActionContent(actionKey, next);
      pushAgentMessage(next.summary);
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  }

  function handleActionClick(actionKey) {
    if (actionKey === 'draft-payment') {
      setActiveModule('payments');
    }

    if (actionKey === 'cash-forecast') {
      setActiveModule('forecasts');
    }

    if (actionKey === 'anomaly-scan' || actionKey === 'bank-emails') {
      setActiveModule('alerts');
    }

    if (actionKey === 'bank-emails') {
      runBankEmailScan();
      return;
    }

    if (actionKey === 'schedule-review') {
      openAction(actionKey);
      return;
    }

    openAction(actionKey);
  }

  const connectorItems = [
    { label: 'Gmail', active: connectors.gmail, tone: 'success' },
    { label: 'Calendar', active: connectors.calendar, tone: 'info' },
    { label: 'Bank Scan', active: connectors.bankScan, tone: 'warning' },
  ];

  function renderAccountsModule() {
    return (
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <div
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.card,
            borderRadius: 28,
            padding: 22,
            display: 'grid',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Accounts</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Dedicated account view with thresholds, health status, and latest balance coverage.</div>
          </div>

          {accounts.map(account => {
            const progress = Math.min(100, Math.round((account.balance / account.target) * 100));
            const tone = toneColor(theme, account.healthTone);
            return (
              <div
                key={account.name}
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.cardStrong,
                  borderRadius: 22,
                  padding: 18,
                  display: 'grid',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>{account.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{account.bank} • {account.currency} • Updated {account.lastUpdated}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>{account.displayBalance}</div>
                    <div style={{ fontSize: 12, color: tone }}>{account.health}</div>
                  </div>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: theme.chartGrid, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: tone, borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: theme.textMuted }}>
                  <span>Threshold {formatCompactMoney(account.threshold, account.currency)}</span>
                  <span>Target {formatCompactMoney(account.target, account.currency)}</span>
                  <span>{progress}% coverage</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.card,
              borderRadius: 28,
              padding: 22,
              display: 'grid',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Allocation Mix</div>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <DonutChart
                theme={theme}
                values={[
                  { label: 'HDFC Operating', value: 9.1, color: theme.primary },
                  { label: 'SBI Corporate', value: 6.8, color: theme.warning },
                  { label: 'Citi USD', value: 5.3, color: theme.info },
                  { label: 'Reserve Fund', value: 3.5, color: theme.success },
                ]}
              />
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.card,
              borderRadius: 28,
              padding: 22,
              display: 'grid',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Account Actions</div>
            <button type="button" className="ui-hover" onClick={() => openAction('draft-payment')} style={{ border: `1px solid ${theme.border}`, background: theme.cardStrong, color: theme.text, borderRadius: 18, padding: 14, textAlign: 'left', cursor: 'pointer' }}>Create payment instruction</button>
            <button type="button" className="ui-hover" onClick={() => openAction('cash-forecast')} style={{ border: `1px solid ${theme.border}`, background: theme.cardStrong, color: theme.text, borderRadius: 18, padding: 14, textAlign: 'left', cursor: 'pointer' }}>Refresh forecast for liquidity balances</button>
          </div>
        </div>
      </section>
    );
  }

  function renderForecastsModule() {
    return (
      <section
        style={{
          border: `1px solid ${theme.border}`,
          background: theme.card,
          borderRadius: 28,
          padding: 22,
          display: 'grid',
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Forecasts</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Focused forecast workspace with the trend model, notes, and direct action into the forecast tool.</div>
        </div>
        <AreaTrendChart theme={theme} cashData={cashTrendSeries} forecastData={forecastSeries} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ border: `1px solid ${theme.border}`, background: theme.cardStrong, borderRadius: 22, padding: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>Variance Snapshot</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: theme.danger, marginTop: 10 }}>-14%</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>Below weekly target because supplier settlements cluster near the cut-off window.</div>
          </div>
          <div style={{ border: `1px solid ${theme.border}`, background: theme.cardStrong, borderRadius: 22, padding: 18, display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>Next Steps</div>
            <div style={{ fontSize: 13, color: theme.text }}>Move $1.5M into SBI Corporate.</div>
            <div style={{ fontSize: 13, color: theme.text }}>Re-run forecast after bank alert review.</div>
            <button type="button" className="ui-hover" onClick={() => openAction('cash-forecast')} style={{ border: 'none', background: theme.primary, color: '#fff', borderRadius: 16, padding: '12px 14px', cursor: 'pointer', fontWeight: 700 }}>Open Forecast Action</button>
          </div>
        </div>
      </section>
    );
  }

  function renderAlertsModule() {
    return (
      <section style={{ display: 'grid', gap: 20 }}>
        <div
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.card,
            borderRadius: 28,
            padding: 22,
            display: 'grid',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Alerts</div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Review incident queue and trigger a fresh Gmail-based bank alert scan.</div>
            </div>
            <button type="button" className="ui-hover" onClick={runBankEmailScan} style={{ border: 'none', background: theme.primary, color: '#fff', borderRadius: 16, padding: '12px 16px', cursor: 'pointer', fontWeight: 700 }}>
              {loadingActions['bank-emails'] ? 'Scanning...' : 'Run Bank Alert Scan'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {anomalies.map(item => {
            const tone = item.severity === 'High' ? 'danger' : item.severity === 'Med' ? 'warning' : 'info';
            return (
              <div key={item.id} style={{ border: `1px solid ${theme.border}`, background: theme.card, borderRadius: 24, padding: 18, display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: theme.sectionTitle }}>{item.title}</div>
                  <span style={{ borderRadius: 999, padding: '7px 12px', fontSize: 12, fontWeight: 800, background: toneBg(theme, tone), color: toneColor(theme, tone) }}>{item.severity}</span>
                </div>
                <div style={{ fontSize: 13, color: theme.textMuted }}>{item.description}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Source: {item.source} • Amount: {item.amount} • Detected {item.detectedAt}</div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function renderAuditLogModule() {
    return (
      <section
        style={{
          border: `1px solid ${theme.border}`,
          background: theme.card,
          borderRadius: 28,
          padding: 22,
          display: 'grid',
          gap: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Audit Log</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Recent operational events across reporting, monitoring, and calendar workflow.</div>
        </div>
        {auditEntries.map(entry => (
          <div key={entry.id} style={{ border: `1px solid ${theme.border}`, background: theme.cardStrong, borderRadius: 22, padding: 18, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>{entry.title}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{entry.time}</div>
            </div>
            <div style={{ fontSize: 12, color: theme.primary }}>{entry.meta}</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>{entry.detail}</div>
          </div>
        ))}
      </section>
    );
  }

  function renderSettingsModule() {
    return (
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ border: `1px solid ${theme.border}`, background: theme.card, borderRadius: 28, padding: 22, display: 'grid', gap: 14 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Settings</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Theme, notification defaults, and connector refresh controls.</div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <ThemeToggleButton mode={mode} onToggle={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))} theme={theme} compact />
            <div style={{ fontSize: 12, color: theme.textMuted }}>Current mode: {mode}</div>
          </div>
          <label style={{ display: 'grid', gap: 6, fontSize: 12, color: theme.textMuted }}>
            Default notification email
            <input
              type="email"
              value={scheduleForm.recipientEmail}
              onChange={event => setScheduleForm(prev => ({ ...prev, recipientEmail: event.target.value }))}
              style={{ borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.inputBg, color: theme.text, padding: '12px 14px' }}
            />
          </label>
          <button type="button" className="ui-hover" onClick={refreshConnectors} style={{ border: 'none', background: theme.primary, color: '#fff', borderRadius: 16, padding: '12px 14px', cursor: 'pointer', fontWeight: 700 }}>
            Refresh Connector Status
          </button>
        </div>

        <div style={{ border: `1px solid ${theme.border}`, background: theme.card, borderRadius: 28, padding: 22, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Connector Summary</div>
          {connectorItems.map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', border: `1px solid ${theme.border}`, background: theme.cardStrong, borderRadius: 18, padding: 14 }}>
              <span style={{ fontSize: 14, color: theme.text }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.active ? toneColor(theme, item.tone) : theme.textMuted }}>
                {item.active ? 'Active' : 'Offline'}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: theme.textMuted }}>Support: {SUPPORT_EMAIL}</div>
        </div>
      </section>
    );
  }

  return (
    <div
      className="app-shell"
      style={{
        minHeight: '100vh',
        background: theme.pageGradient,
        color: theme.text,
        padding: 22,
      }}
    >
      <div
        style={{
          maxWidth: 1680,
          margin: '0 auto',
          background: theme.shell,
          border: `1px solid ${theme.shellBorder}`,
          borderRadius: 30,
          boxShadow: theme.shadow,
          display: 'grid',
          gridTemplateColumns: '240px minmax(0, 1fr)',
          overflow: 'hidden',
        }}
      >
        <aside
          style={{
            padding: '28px 20px 22px',
            background: theme.mode === 'dark' ? '#0f172a' : '#eef5ff',
            borderRight: `1px solid ${theme.border}`,
            display: 'grid',
            alignContent: 'start',
            gap: 22,
          }}
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.textSoft }}>Treasury OS</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Control Center</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Executive cockpit for liquidity, reviews, and treasury workflow.</div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {modules.map(module => (
              <button
                key={module.id}
                type="button"
                className="ui-hover"
                onClick={() => openModule(module.id)}
                style={{
                  border: activeModule === module.id ? `1px solid ${theme.primary}` : `1px solid transparent`,
                  background: activeModule === module.id ? toneBg(theme, 'info') : 'transparent',
                  color: activeModule === module.id ? theme.primary : theme.textMuted,
                  borderRadius: 16,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16 }}>{module.icon}</span>
                <span style={{ fontSize: 14, fontWeight: activeModule === module.id ? 700 : 500 }}>{module.label}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: 16,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              display: 'grid',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Connector Health</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>Live diagnostics</div>
            </div>
            {connectorItems.map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: theme.textMuted }}>{item.label}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 999,
                    padding: '6px 10px',
                    background: item.active ? toneBg(theme, item.tone) : theme.cardMuted,
                    color: item.active ? toneColor(theme, item.tone) : theme.textMuted,
                  }}
                >
                  {connectors.loading ? 'Checking' : item.active ? 'Active' : 'Offline'}
                </span>
              </div>
            ))}
            <div style={{ fontSize: 12, color: theme.textMuted }}>Last sync: {lastSync.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
          </div>
        </aside>

        <main style={{ padding: '26px 28px 22px', display: 'grid', gap: 22 }}>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
              position: 'sticky',
              top: 0,
              zIndex: 2,
              background: theme.shell,
              paddingBottom: 8,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1, letterSpacing: '-0.04em' }}>Treasury AI Agent</h1>
              <div style={{ fontSize: 18, color: theme.textMuted, marginTop: 8 }}>Cash, liquidity, approvals, and calendar workflow in one cockpit.</div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 18,
                  background: theme.headerBadge,
                  border: `1px solid ${theme.border}`,
                  minWidth: 280,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.success }}>Live connectors</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                  {connectorItems.map(item => (
                    <span key={item.label} style={{ fontSize: 12, color: item.active ? toneColor(theme, item.tone) : theme.textMuted }}>
                      {item.active ? '●' : '○'} {item.label}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Last sync: {lastSync.toLocaleString()}</div>
              </div>

              <ThemeToggleButton mode={mode} onToggle={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))} theme={theme} />
            </div>
          </header>

          <div style={{ display: 'flex', gap: 6, borderBottom: `1px solid ${theme.border}`, paddingBottom: 10 }}>
            {['dashboard', 'agent', 'actions'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTab(item);
                  if (item === 'dashboard' && activeModule === 'payments') {
                    setActiveModule('dashboard');
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: tab === item ? theme.primary : theme.textMuted,
                  fontSize: 16,
                  fontWeight: tab === item ? 700 : 500,
                  padding: '10px 14px',
                  borderBottom: tab === item ? `3px solid ${theme.primary}` : '3px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === 'dashboard' && (
            <div style={{ display: 'grid', gap: 20 }}>
              {activeModule === 'accounts' && renderAccountsModule()}
              {activeModule === 'forecasts' && renderForecastsModule()}
              {activeModule === 'alerts' && renderAlertsModule()}
              {activeModule === 'audit-log' && renderAuditLogModule()}
              {activeModule === 'settings' && renderSettingsModule()}
              {activeModule === 'dashboard' && (
              <>
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
                {metricCards.map(card => (
                  <button
                    key={card.key}
                    type="button"
                    className="ui-hover"
                    onClick={() => handleActionClick(card.actionKey)}
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.card,
                      borderRadius: 24,
                      padding: 18,
                      display: 'grid',
                      gap: 14,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.textSoft }}>{card.label}</div>
                        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 8, color: theme.sectionTitle }}>{card.value}</div>
                        <div style={{ marginTop: 8, fontSize: 13, color: toneColor(theme, card.tone), fontWeight: 700 }}>
                          {card.icon} {card.change}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: theme.textMuted }}>{card.decisionText}</div>
                      </div>
                      <div
                        style={{
                          borderRadius: 14,
                          padding: '8px 10px',
                          background: toneBg(theme, card.tone),
                          color: toneColor(theme, card.tone),
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        View details
                      </div>
                    </div>
                    <Sparkline data={card.trend} color={toneColor(theme, card.tone)} mutedColor={toneColor(theme, card.tone)} />
                  </button>
                ))}
              </section>

              <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.card,
                    borderRadius: 28,
                    padding: 22,
                    display: 'grid',
                    gap: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Cash Position Trend</div>
                      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>7-day actual cash versus forecast, plus daily inflow/outflow pressure.</div>
                    </div>
                    <div
                      style={{
                        borderRadius: 16,
                        background: theme.cardMuted,
                        border: `1px solid ${theme.border}`,
                        padding: '10px 12px',
                        minWidth: 140,
                      }}
                    >
                      <div style={{ fontSize: 11, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Variance</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: theme.danger, marginTop: 6 }}>-14%</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>vs weekly target</div>
                    </div>
                  </div>

                  <AreaTrendChart theme={theme} cashData={cashTrendSeries} forecastData={forecastSeries} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 18 }}>
                    <div
                      style={{
                        borderRadius: 20,
                        padding: 16,
                        background: theme.cardMuted,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.sectionTitle, marginBottom: 12 }}>Inflow vs Outflow</div>
                      <FlowBars theme={theme} />
                    </div>
                    <div
                      style={{
                        borderRadius: 20,
                        padding: 16,
                        background: theme.cardMuted,
                        border: `1px solid ${theme.border}`,
                        display: 'grid',
                        gap: 10,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.sectionTitle }}>Forecast Notes</div>
                      <div style={{ fontSize: 13, color: theme.textMuted }}>Friday outflows are compressed into a short cut-off window, which is why the forecast line dips aggressively.</div>
                      <div style={{ fontSize: 13, color: theme.text }}>Recommended move: shift $1.5M into SBI Corporate before the supplier batch closes.</div>
                      <div style={{ fontSize: 13, color: theme.text }}>Confidence score: 82% based on current transaction density and matched bank alerts.</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.card,
                    borderRadius: 28,
                    padding: 22,
                    display: 'grid',
                    gap: 18,
                    alignContent: 'start',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Quick Actions</div>
                    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Organized by workflow so the next operational move is obvious.</div>
                  </div>

                  {['Payments', 'Monitoring', 'Forecasting', 'Calendar / Workflow'].map(group => (
                    <div key={group} style={{ display: 'grid', gap: 10 }}>
                      <div style={{ fontSize: 12, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{group}</div>
                      {actionDefinitions.filter(action => action.group === group).map(action => (
                        <button
                          key={action.key}
                          type="button"
                          className="ui-hover"
                          onClick={() => handleActionClick(action.key)}
                          style={{
                            border: selectedAction === action.key ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
                            background: selectedAction === action.key ? toneBg(theme, 'info') : theme.cardStrong,
                            borderRadius: 20,
                            padding: 16,
                            display: 'grid',
                            gap: 6,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: theme.sectionTitle }}>{action.icon} {action.title}</div>
                            <div style={{ fontSize: 11, color: toneColor(theme, action.accent), fontWeight: 700 }}>
                              {loadingActions[action.key] ? 'Working...' : 'Open'}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: theme.textMuted }}>{action.sub}</div>
                          <div style={{ fontSize: 12, color: toneColor(theme, action.accent) }}>{action.statusLine}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.card,
                    borderRadius: 28,
                    padding: 22,
                    display: 'grid',
                    gap: 16,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Accounts</div>
                    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Balances, thresholds, and health status in one compact view.</div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2.1fr 0.9fr 0.8fr 0.7fr 0.8fr',
                      gap: 12,
                      padding: '0 4px 10px',
                      fontSize: 11,
                      color: theme.textSoft,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}
                  >
                    <div>Account</div>
                    <div>Balance</div>
                    <div>Health</div>
                    <div>Coverage</div>
                    <div>Updated</div>
                  </div>

                  {accounts.map(account => {
                    const progress = Math.min(100, Math.round((account.balance / account.target) * 100));
                    const healthColor = toneColor(theme, account.healthTone);
                    return (
                      <button
                        key={account.name}
                        type="button"
                        className="ui-hover"
                        style={{
                          border: `1px solid ${theme.border}`,
                          background: theme.cardStrong,
                          borderRadius: 22,
                          padding: 16,
                          display: 'grid',
                          gap: 12,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 0.9fr 0.8fr 0.7fr 0.8fr', gap: 12, alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: theme.sectionTitle }}>{account.name}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{account.bank} • {account.currency}</div>
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: theme.sectionTitle }}>{account.displayBalance}</div>
                          <div>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                borderRadius: 999,
                                padding: '7px 10px',
                                fontSize: 12,
                                fontWeight: 700,
                                background: toneBg(theme, account.healthTone),
                                color: healthColor,
                              }}
                            >
                              {account.healthTone === 'warning' ? '▲' : '●'} {account.health}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{progress}%</div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>{account.lastUpdated}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ height: 10, borderRadius: 999, background: theme.chartGrid, overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: healthColor, borderRadius: 999 }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textMuted }}>
                            <span>Threshold {formatCompactMoney(account.threshold, account.currency)}</span>
                            <span>Target {formatCompactMoney(account.target, account.currency)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gap: 20 }}>
                  <div
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.card,
                      borderRadius: 28,
                      padding: 22,
                      display: 'grid',
                      gap: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Allocation Mix</div>
                      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Compact view of where the liquidity pool is sitting right now.</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, alignItems: 'center' }}>
                      <DonutChart
                        theme={theme}
                        values={[
                          { label: 'HDFC Operating', value: 9.1, color: theme.primary },
                          { label: 'SBI Corporate', value: 6.8, color: theme.warning },
                          { label: 'Citi USD', value: 5.3, color: theme.info },
                          { label: 'Reserve Fund', value: 3.5, color: theme.success },
                        ]}
                      />
                      <div style={{ display: 'grid', gap: 10 }}>
                        {[
                          { label: 'HDFC Operating', value: '$9.1M', color: theme.primary },
                          { label: 'SBI Corporate', value: '$6.8M', color: theme.warning },
                          { label: 'Citi USD', value: '$5.3M', color: theme.info },
                          { label: 'Reserve Fund', value: '$3.5M', color: theme.success },
                        ].map(item => (
                          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ width: 12, height: 12, borderRadius: 999, background: item.color }} />
                              <span style={{ fontSize: 13, color: theme.text }}>{item.label}</span>
                            </div>
                            <span style={{ fontSize: 13, color: theme.textMuted }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.card,
                      borderRadius: 28,
                      padding: 22,
                      display: 'grid',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Priority Queue</div>
                      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Actionable approvals and next workflow steps above the fold.</div>
                    </div>
                    {[
                      { title: 'Vendor exception', sub: 'Apex Logistics payment needs controller review', tone: 'danger' },
                      { title: 'Liquidity rebalance', sub: 'Top up SBI Corporate before settlement cut-off', tone: 'warning' },
                      { title: 'Forecast refresh', sub: 'Re-run scenario after bank alert review', tone: 'info' },
                    ].map(item => (
                      <div
                        key={item.title}
                        style={{
                          borderRadius: 18,
                          padding: 14,
                          border: `1px solid ${theme.border}`,
                          background: toneBg(theme, item.tone),
                          display: 'grid',
                          gap: 4,
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 700, color: toneColor(theme, item.tone) }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.card,
                  borderRadius: 28,
                  padding: 22,
                  display: 'grid',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: theme.sectionTitle }}>Anomalies Detected</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Structured incident cards with severity, amount, timing, and the recommended next move.</div>
                </div>

                <div style={{ display: 'grid', gap: 14 }}>
                  {anomalies.map(item => {
                    const tone = item.severity === 'High' ? 'danger' : item.severity === 'Med' ? 'warning' : 'info';
                    return (
                      <div
                        key={item.id}
                        className="ui-hover"
                        style={{
                          border: `1px solid ${theme.border}`,
                          background: theme.cardStrong,
                          borderRadius: 24,
                          padding: 18,
                          display: 'grid',
                          gridTemplateColumns: '1.8fr 0.8fr 0.7fr 1fr auto',
                          gap: 16,
                          alignItems: 'start',
                        }}
                      >
                        <div style={{ display: 'grid', gap: 6 }}>
                          <div style={{ fontSize: 17, fontWeight: 800, color: theme.sectionTitle }}>{item.title}</div>
                          <div style={{ fontSize: 13, color: theme.textMuted }}>{item.description}</div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>Recommended action: {item.recommendation}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 4 }}>
                          <div style={{ fontSize: 11, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Amount</div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{item.amount}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 4 }}>
                          <div style={{ fontSize: 11, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Source</div>
                          <div style={{ fontSize: 13, color: theme.text }}>{item.source}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 4 }}>
                          <div style={{ fontSize: 11, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Detected</div>
                          <div style={{ fontSize: 13, color: theme.text }}>{item.detectedAt}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: '7px 12px',
                              fontSize: 12,
                              fontWeight: 800,
                              background: toneBg(theme, tone),
                              color: toneColor(theme, tone),
                            }}
                          >
                            {item.severity}
                          </span>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {['Review', 'Assign', 'Escalate'].map(label => (
                              <button
                                key={label}
                                type="button"
                                className="ui-hover"
                                style={{
                                  border: `1px solid ${theme.border}`,
                                  background: theme.cardMuted,
                                  color: theme.text,
                                  borderRadius: 999,
                                  padding: '8px 12px',
                                  fontSize: 12,
                                  cursor: 'pointer',
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              </>
              )}
            </div>
          )}

          {tab === 'agent' && (
            <section
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.card,
                borderRadius: 28,
                overflow: 'hidden',
                display: 'grid',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 20px 0',
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: theme.sectionTitle }}>Agent</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Running in no-cost local treasury assistant mode.</div>
                </div>
                <div
                  style={{
                    borderRadius: 999,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    background: toneBg(theme, 'info'),
                    color: toneColor(theme, 'info'),
                  }}
                >
                  Mock mode
                </div>
              </div>
              <div style={{ padding: 20, minHeight: 420, maxHeight: 520, overflowY: 'auto', display: 'grid', gap: 12, alignContent: 'start' }}>
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '72%',
                        width: 'fit-content',
                        padding: '12px 14px',
                        borderRadius: 18,
                        background: message.role === 'user' ? theme.primary : theme.cardMuted,
                        color: message.role === 'user' ? '#ffffff' : theme.text,
                        lineHeight: 1.5,
                        fontSize: 14,
                        whiteSpace: 'pre-wrap',
                        border: message.role === 'user' ? 'none' : `1px solid ${theme.border}`,
                      }}
                    >
                      {message.text}
                      {message.role === 'agent' && message.suggestions && message.suggestions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                          {message.suggestions.map(suggestion => (
                            <button
                              key={`${index}-${suggestion}`}
                              type="button"
                              className="ui-hover"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{
                                border: `1px solid ${theme.border}`,
                                background: theme.card,
                                color: theme.primary,
                                borderRadius: 999,
                                padding: '8px 12px',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 'fit-content',
                        padding: '12px 14px',
                        borderRadius: 18,
                        background: theme.cardMuted,
                        color: theme.textMuted,
                        fontSize: 14,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, padding: 16, borderTop: `1px solid ${theme.border}` }}>
                <input
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={event => event.key === 'Enter' && !chatLoading && sendMessage()}
                  placeholder="Ask about liquidity, bank alerts, forecast variance, or approvals..."
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    padding: '12px 14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  className="ui-hover"
                  onClick={sendMessage}
                  disabled={chatLoading}
                  style={{
                    border: 'none',
                    background: theme.primary,
                    color: '#ffffff',
                    borderRadius: 16,
                    padding: '0 18px',
                    cursor: chatLoading ? 'not-allowed' : 'pointer',
                    opacity: chatLoading ? 0.75 : 1,
                    fontWeight: 700,
                  }}
                >
                  {chatLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </section>
          )}

          {tab === 'actions' && (
            <section style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.25fr', gap: 20 }}>
              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.card,
                  borderRadius: 28,
                  padding: 22,
                  display: 'grid',
                  gap: 14,
                  alignContent: 'start',
                }}
              >
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: theme.sectionTitle }}>Action Console</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Choose a workflow and review the live result panel on the right.</div>
                </div>

                <button
                  type="button"
                  className="ui-hover"
                  onClick={!sendingEmail ? sendCashReport : undefined}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardStrong,
                    borderRadius: 22,
                    padding: 16,
                    display: 'grid',
                    gap: 6,
                    textAlign: 'left',
                    cursor: sendingEmail ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>📊 Daily Cash Report</div>
                  <div style={{ fontSize: 13, color: theme.textMuted }}>Generate and email the daily cash report.</div>
                  <div style={{ fontSize: 12, color: emailStatus ? theme.success : theme.textMuted }}>{emailStatus || 'Recipient follows the scheduling confirmation email field.'}</div>
                </button>

                {actionDefinitions.map(action => (
                  <button
                    key={action.key}
                    type="button"
                    className="ui-hover"
                    onClick={() => handleActionClick(action.key)}
                    style={{
                      border: selectedAction === action.key ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
                      background: selectedAction === action.key ? toneBg(theme, 'info') : theme.cardStrong,
                      borderRadius: 22,
                      padding: 16,
                      display: 'grid',
                      gap: 6,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: theme.sectionTitle }}>{action.icon} {action.title}</div>
                      <div style={{ fontSize: 11, color: toneColor(theme, action.accent), fontWeight: 700 }}>
                        {loadingActions[action.key] ? 'Running...' : action.group}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: theme.textMuted }}>{action.sub}</div>
                    <div style={{ fontSize: 12, color: toneColor(theme, action.accent) }}>{action.statusLine}</div>
                  </button>
                ))}
              </div>

              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.card,
                  borderRadius: 28,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '18px 22px',
                    background: toneBg(theme, selectedActionContent.accent),
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 800, color: toneColor(theme, selectedActionContent.accent) }}>
                    {actionDefinitions.find(action => action.key === selectedAction)?.title || 'Action'}
                  </div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>{selectedActionContent.status}</div>
                </div>

                <div style={{ padding: 22, display: 'grid', gap: 18 }}>
                  {selectedAction === 'schedule-review' && (
                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.cardMuted,
                        borderRadius: 24,
                        padding: 18,
                        display: 'grid',
                        gap: 14,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: theme.sectionTitle }}>Choose Slot</div>
                        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Set the meeting time and who should receive the confirmation email.</div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                          { label: 'Tomorrow 10:00', hour: 10, minute: 0, durationMinutes: 30 },
                          { label: 'Tomorrow 14:30', hour: 14, minute: 30, durationMinutes: 30 },
                          { label: 'Tomorrow 16:00', hour: 16, minute: 0, durationMinutes: 45 },
                        ].map(preset => (
                          <button
                            key={preset.label}
                            type="button"
                            className="ui-hover"
                            onClick={() => applySchedulePreset(preset.hour, preset.minute, preset.durationMinutes)}
                            style={{
                              border: `1px solid ${theme.border}`,
                              background: theme.card,
                              color: theme.primary,
                              borderRadius: 999,
                              padding: '8px 12px',
                              fontSize: 12,
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                        <label style={{ display: 'grid', gap: 6, fontSize: 12, color: theme.textMuted }}>
                          Date
                          <input
                            type="date"
                            value={scheduleForm.date}
                            onChange={event => setScheduleForm(prev => ({ ...prev, date: event.target.value }))}
                            style={{
                              borderRadius: 14,
                              border: `1px solid ${theme.border}`,
                              background: theme.inputBg,
                              color: theme.text,
                              padding: '12px 14px',
                            }}
                          />
                        </label>

                        <label style={{ display: 'grid', gap: 6, fontSize: 12, color: theme.textMuted }}>
                          Start Time
                          <input
                            type="time"
                            value={scheduleForm.time}
                            onChange={event => setScheduleForm(prev => ({ ...prev, time: event.target.value }))}
                            style={{
                              borderRadius: 14,
                              border: `1px solid ${theme.border}`,
                              background: theme.inputBg,
                              color: theme.text,
                              padding: '12px 14px',
                            }}
                          />
                        </label>

                        <label style={{ display: 'grid', gap: 6, fontSize: 12, color: theme.textMuted }}>
                          Duration
                          <select
                            value={scheduleForm.durationMinutes}
                            onChange={event => setScheduleForm(prev => ({ ...prev, durationMinutes: Number(event.target.value) }))}
                            style={{
                              borderRadius: 14,
                              border: `1px solid ${theme.border}`,
                              background: theme.inputBg,
                              color: theme.text,
                              padding: '12px 14px',
                            }}
                          >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                          </select>
                        </label>

                        <label style={{ display: 'grid', gap: 6, fontSize: 12, color: theme.textMuted }}>
                          Confirmation Email
                          <input
                            type="email"
                            value={scheduleForm.recipientEmail}
                            onChange={event => setScheduleForm(prev => ({ ...prev, recipientEmail: event.target.value }))}
                            style={{
                              borderRadius: 14,
                              border: `1px solid ${theme.border}`,
                              background: theme.inputBg,
                              color: theme.text,
                              padding: '12px 14px',
                            }}
                          />
                        </label>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 12,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          borderRadius: 18,
                          background: theme.card,
                          border: `1px solid ${theme.border}`,
                          padding: 14,
                        }}
                      >
                        <div style={{ display: 'grid', gap: 4 }}>
                          <div style={{ fontSize: 12, color: theme.textSoft, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Selected slot</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: theme.sectionTitle }}>
                            {new Date(`${scheduleForm.date}T${scheduleForm.time}`).toLocaleString()} for {scheduleForm.durationMinutes} minutes
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ui-hover"
                          onClick={runScheduleReview}
                          disabled={Boolean(loadingActions['schedule-review'])}
                          style={{
                            border: 'none',
                            background: loadingActions['schedule-review'] ? '#8ea4d8' : theme.primary,
                            color: '#ffffff',
                            borderRadius: 16,
                            padding: '12px 18px',
                            cursor: loadingActions['schedule-review'] ? 'not-allowed' : 'pointer',
                            fontWeight: 800,
                          }}
                        >
                          {loadingActions['schedule-review'] ? 'Booking...' : 'Book Slot'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: theme.sectionTitle }}>Summary</div>
                    <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 1.6 }}>{selectedActionContent.summary}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: theme.sectionTitle, marginBottom: 10 }}>Details</div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {selectedActionContent.details.map((detail, index) => (
                        <DetailItem key={`${selectedAction}-${index}`} detail={detail} theme={theme} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <footer
            style={{
              borderTop: `1px solid ${theme.border}`,
              paddingTop: 14,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: 13,
              color: theme.footer,
            }}
          >
            <div>Treasury AI Agent • Designed as a live treasury control center with workflow actions, charts, and connector diagnostics.</div>
            <div>
              For queries reach out to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: theme.primary, textDecoration: 'none', fontWeight: 700 }}>
                {SUPPORT_EMAIL}
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
