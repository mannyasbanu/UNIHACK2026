// This file contains functions to call the backend API endpoints
// Each function corresponds to an endpoint and returns the JSON response
// The BASE_URL variable should be updated to match the backend server's address
const BASE_URL = "http://127.0.0.1:8000";

export async function getSummary(ticker, timeframe) {
  const res = await fetch(`${BASE_URL}/api/summary?ticker=${ticker}&timeframe=${timeframe}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getSignals(ticker, timeframe) {
  const res = await fetch(`${BASE_URL}/api/signals?ticker=${ticker}&timeframe=${timeframe}`);
  if (!res.ok) throw new Error("Failed to fetch signals");
  return res.json();
}

export async function getHeadlines(ticker, timeframe) {
  const res = await fetch(`${BASE_URL}/api/headlines?ticker=${ticker}&timeframe=${timeframe}`);
  if (!res.ok) throw new Error("Failed to fetch headlines");
  return res.json();
}

export async function getBacktest(ticker, timeframe) {
  const res = await fetch(`${BASE_URL}/api/backtest?ticker=${ticker}&timeframe=${timeframe}`);
  if (!res.ok) throw new Error("Failed to fetch backtest");
  return res.json();
}

export async function getMovers(tickers = "AAPL,TSLA,NVDA,MSFT") {
    const res = await fetch(`${BASE_URL}/api/movers?tickers=${tickers}`)
    return res.json()
}