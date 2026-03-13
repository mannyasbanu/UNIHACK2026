import { useState } from "react";
import MetricCard from "./components/MetricCard";
import SignalBadge from "./components/SignalBadge";
import TickerSelector from "./components/TickerSelector";
import SentimentChart from "./components/SentimentChart";
import {
  mockHeadlines,
  mockSignals,
  mockMetrics,
  mockTickers,
} from "./data/mockData";

function App() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");

  const filteredSignals = mockSignals.filter(
    (item) => item.ticker === selectedTicker
  );

  const filteredHeadlines = mockHeadlines.filter(
    (item) => item.ticker === selectedTicker
  );

  const latestSignal = filteredSignals[filteredSignals.length - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: 'white', fontSize: "40px", marginBottom: "10px" }}>
          News Sentiment Trading Dashboard
        </h1>

        <p style={{ color: "#a1a1aa", fontSize: "18px", marginBottom: "24px" }}>
          Visualising headlines, sentiment, signals, and backtest performance.
        </p>

        <TickerSelector
          tickers={mockTickers}
          selectedTicker={selectedTicker}
          onChange={setSelectedTicker}
        />

        <div style={{ marginBottom: "24px" }}>
          <SignalBadge signal={latestSignal.signal} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <MetricCard
            title="Current Signal"
            value={latestSignal.signal.toUpperCase()}
            subtitle={`${selectedTicker} latest model output`}
          />
          <MetricCard
            title="Strategy Return"
            value={`${mockMetrics.strategyReturn}%`}
            subtitle="Backtest performance"
          />
          <MetricCard
            title="Buy & Hold Return"
            value={`${mockMetrics.buyHoldReturn}%`}
            subtitle="Benchmark return"
          />
          <MetricCard
            title="Headlines Analysed"
            value={String(filteredHeadlines.length)}
            subtitle={`${selectedTicker} sample news items`}
          />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <SentimentChart data={filteredSignals} />
        </div>

        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: 'white', marginTop: 0, marginBottom: "16px" }}>
            Recent Headlines for {selectedTicker}
          </h2>

          {filteredHeadlines.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid #27272a",
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
                {item.headline}
              </p>
              <p style={{ margin: 0, color: "#a1a1aa", fontSize: "14px" }}>
                {item.ticker} • {item.publishedAt} • {item.sentimentLabel} • score:{" "}
                {item.sentimentScore}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;