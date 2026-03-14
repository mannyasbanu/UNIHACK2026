import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import SignalBadge from "../components/SignalBadge";
import SentimentChart from "../components/SentimentChart";
import BacktestChart from "../components/BacktestChart";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";
import { getSummary, getSignals, getHeadlines, getBacktest } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  getFavorites,
  getRecentSearches,
  addRecentSearch,
  toggleFavorite,
} from "../lib/userData";

function StockPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [summary, setSummary] = useState(null);
  const [signals, setSignals] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [backtestData, setBacktestData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");

  {/* Timeframe Selection and State */}
  const timeframes = [
    { label: "1 Day", value: "1d" },
    { label: "3 Days", value: "3d" },
    { label: "1 Week", value: "1wk" },
    { label: "2 Weeks", value: "2wk" },
    { label: "1 Month", value: "1mo" },
  ];
  const [selectedTimeframe, setSelectedTimeframe] = useState("1mo");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, signalsRes, headlinesRes, backtestRes] =
          await Promise.all([
            getSummary(ticker, selectedTimeframe),
            getSignals(ticker, selectedTimeframe),
            getHeadlines(ticker, selectedTimeframe),
            getBacktest(ticker, selectedTimeframe),
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
          ticker,
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

        if (user?.id) {
          await addRecentSearch(user.id, ticker);

          const [favoritesRows, recentRows] = await Promise.all([
            getFavorites(user.id),
            getRecentSearches(user.id),
          ]);

          setFavorites(favoritesRows.map((row) => row.ticker));
          setRecentSearches(recentRows.map((row) => row.ticker));
        } else {
          setFavorites([]);
          setRecentSearches([]);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [ticker, user, selectedTimeframe]);

  async function handleFavoriteToggle() {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSavingFavorite(true);
      await toggleFavorite(user.id, ticker);

      const favoritesRows = await getFavorites(user.id);
      setFavorites(favoritesRows.map((row) => row.ticker));
    } catch (err) {
      console.error("Favorite error:", err.message);
    } finally {
      setSavingFavorite(false);
    }
  }

  const latestSignal = signals[signals.length - 1];
  const isFavorite = favorites.includes(ticker);

  {/* Headline Sorting */}
  const sortedHeadlines = [...headlines].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }
    if (sortBy === "confidence") {
      return Math.abs(b.sentimentScore) - Math.abs(a.sentimentScore);
    }
    if (sortBy === "positive") {
      return b.sentimentScore - a.sentimentScore; // highest positive first
    }
    if (sortBy === "negative") {
      return a.sentimentScore - b.sentimentScore; // most negative first
    }
    return 0;
  });

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
        <Navbar />
        <p>Loading...</p>
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
        <Navbar />
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Navbar />
        {user && (
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                backgroundColor: "#18181b",
                color: "white",
                border: "1px solid #27272a",
                borderRadius: "10px",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {isSidebarOpen ? "Close Panel" : "Open Panel"}
            </button>
          </div>
        )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: user && isSidebarOpen ? "1fr 280px" : "1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h1 style={{ color: "white", fontSize: "40px", margin: 0 }}>
              {ticker} Analysis
            </h1>

            <button
              onClick={handleFavoriteToggle}
              disabled={savingFavorite}
              style={{
                backgroundColor: isFavorite ? "#facc15" : "#18181b",
                color: isFavorite ? "#09090b" : "white",
                border: "1px solid #27272a",
                borderRadius: "12px",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {isFavorite ? "★ Favorited" : "☆ Add Favorite"}
            </button>
          </div>

          <p style={{ color: "#a1a1aa", fontSize: "18px", marginBottom: "24px" }}>
            Visualising headlines, sentiment, signals, and backtest performance.
          </p>

        {/* Timeframe Selector */}
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={{
            backgroundColor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "14px",
            marginBottom: "24px",
            cursor: "pointer",
          }}
        >
          {timeframes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

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
              subtitle={`${ticker} latest model output`}
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
            <BacktestChart data={backtestData} ticker={ticker} />
          </div>

          {/* Headlines Section */}
          <div
            style={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ color: "white", margin: 0 }}>
                Recent Headlines for {ticker}
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: "#27272a",
                  color: "white",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="date">Sort: Date</option>
                <option value="confidence">Sort: Importance</option>
                <option value="positive">Sort: Most Positive</option>
                <option value="negative">Sort: Most Negative</option>
              </select>
            </div>

            <div
              style={{
                maxHeight: "550px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {headlines.length === 0 ? (
                <p style={{ color: "#a1a1aa" }}>No recent headlines found.</p>
              ) : (
                sortedHeadlines.map((item) => {
                  const sentimentColor =
                    item.sentimentLabel === "positive" ? "#4ade80" :
                    item.sentimentLabel === "negative" ? "#f87171" :
                    "#a1a1aa";

                  const sentimentBg =
                    item.sentimentLabel === "positive" ? "rgba(74, 222, 128, 0.08)" :
                    item.sentimentLabel === "negative" ? "rgba(248, 113, 113, 0.08)" :
                    "rgba(161, 161, 170, 0.08)";

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "16px",
                        marginBottom: "10px",
                        borderRadius: "12px",
                        backgroundColor: sentimentBg,
                        border: `1px solid ${sentimentColor}30`,
                      }}
                    >
                      {/* Sentiment badge */}
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: sentimentColor,
                          color: "#09090b",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.sentimentLabel}
                      </span>

                      {/* Headline */}
                      <p style={{ margin: "0 0 8px 0", fontWeight: "600", lineHeight: "1.4" }}>
                        {item.headline}
                      </p>

                      {/* Metadata row */}
                      <p style={{ margin: 0, color: "#a1a1aa", fontSize: "13px", display: "flex", gap: "12px" }}>
                        <span>{item.publishedAt}</span>
                        <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                        <span style={{ color: sentimentColor }}>
                          Score: {typeof item.sentimentScore === "number" ? item.sentimentScore.toFixed(3) : "N/A"}
                        </span>
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        
        </div>
        
        {user && isSidebarOpen && (
          <RightSidebar
            favorites={favorites}
            recentSearches={recentSearches}
          />
        )}
      </div>
    </div>
  );
}

export default StockPage;