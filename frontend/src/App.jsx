import { useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import SignalBadge from "./components/SignalBadge";
import TickerSelector from "./components/TickerSelector";
import SentimentChart from "./components/SentimentChart";
import BacktestChart from "./components/BacktestChart";
import { getSummary, getSignals, getHeadlines, getBacktest } from "./api";

const tickers = ["AAPL", "TSLA", "NVDA", "MSFT"];

function App() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [summary, setSummary] = useState(null);
  const [signals, setSignals] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [backtestData, setBacktestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, signalsRes, headlinesRes, backtestRes] =
          await Promise.all([
            getSummary(selectedTicker),
            getSignals(selectedTicker),
            getHeadlines(selectedTicker),
            getBacktest(selectedTicker),
          ]);

        setSummary(summaryRes);

        const transformedSignals = signalsRes.map((item) => ({
          date: item.date,
          sentiment: item.daily_sentiment,
          signal: item.signal,
        }));
        setSignals(transformedSignals);

        const transformedHeadlines = headlinesRes.map((item, index) => ({
          id: `${item.date}-${index}`,
          ticker: selectedTicker,
          headline: item.title,
          publishedAt: item.date,
          sentimentLabel: item.sentiment,
          sentimentScore: item.score,
          confidence: item.confidence,
        }));
        setHeadlines(transformedHeadlines);

        const transformedBacktest = backtestRes.chart_data.map((item) => ({
          date: item.date,
          strategyValue: item.strategy_value,
          benchmarkValue: item.buyhold_value,
        }));
        setBacktestData(transformedBacktest);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedTicker]);

  const latestSignal = signals[signals.length - 1];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#09090b",
          color: "white",
          padding: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#09090b",
          color: "white",
          padding: "20px",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%" }}>
        <h1 style={{ color: "white", fontSize: "40px", marginBottom: "10px" }}>
          News Sentiment Trading Dashboard
        </h1>

        <p style={{ color: "#a1a1aa", fontSize: "18px", marginBottom: "24px" }}>
          Visualising headlines, sentiment, signals, and backtest performance.
        </p>

        <TickerSelector
          tickers={tickers}
          selectedTicker={selectedTicker}
          onChange={setSelectedTicker}
        />

        {latestSignal && (
          <div style={{ marginBottom: "24px" }}>
            <SignalBadge signal={latestSignal.signal} />
          </div>
        )}

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
            value={summary?.latest_signal?.toUpperCase() || "N/A"}
            subtitle={`${selectedTicker} latest model output`}
          />
          <MetricCard
            title="Latest Sentiment"
            value={summary ? summary.latest_sentiment.toFixed(2) : "N/A"}
            subtitle="Most recent daily sentiment"
          />
          <MetricCard
            title="Strategy Return"
            value={summary ? `${summary.strategy_return.toFixed(2)}%` : "N/A"}
            subtitle="Backtest performance"
          />
          <MetricCard
            title="Buy & Hold Return"
            value={summary ? `${summary.buyhold_return.toFixed(2)}%` : "N/A"}
            subtitle="Benchmark return"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <SentimentChart data={signals} />
          <BacktestChart data={backtestData} ticker={selectedTicker} />
        </div>

        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0, marginBottom: "16px" }}>
            Recent Headlines for {selectedTicker}
          </h2>

          {/* Scrollable Container*/}
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "8px",
            }}
          >
            {headlines.map((item) => (
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
                  {item.sentimentScore.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;