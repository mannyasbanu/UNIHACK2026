const API_BASE = "http://127.0.0.1:8000";

export async function getSummary(ticker) {
  const res = await fetch(`${API_BASE}/api/summary?ticker=${ticker}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getSignals(ticker) {
  const res = await fetch(`${API_BASE}/api/signals?ticker=${ticker}`);
  if (!res.ok) throw new Error("Failed to fetch signals");
  return res.json();
}

export async function getHeadlines(ticker) {
  const res = await fetch(`${API_BASE}/api/headlines?ticker=${ticker}`);
  if (!res.ok) throw new Error("Failed to fetch headlines");
  return res.json();
}

export async function getBacktest(ticker) {
  const res = await fetch(`${API_BASE}/api/backtest?ticker=${ticker}`);
  if (!res.ok) throw new Error("Failed to fetch backtest");
  return res.json();
}