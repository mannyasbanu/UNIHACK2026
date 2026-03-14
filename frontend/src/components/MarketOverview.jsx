import { topMovers, highImpactEvents } from "../data/landingData";
import { Link } from "react-router-dom";

function MarketOverview() {
  return (
    <section
      style={{
        padding: "40px 20px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "32px",
          marginBottom: "24px",
        }}
      >
        Market Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h3 style={{ color: "white", marginTop: 0, marginBottom: "16px" }}>
            Highest Moving Stocks
          </h3>

          {topMovers.map((stock) => (
            <Link
              key={stock.ticker}
              to={`/stock/${stock.ticker}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid #27272a",
                textDecoration: "none",
                color: "white",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: "600" }}>{stock.ticker}</p>
                <p style={{ margin: "4px 0 0 0", color: "#a1a1aa", fontSize: "14px" }}>
                  {stock.name}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0 }}>${stock.price}</p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: stock.change.startsWith("+") ? "#4ade80" : "#f87171",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {stock.change}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h3 style={{ color: "white", marginTop: 0, marginBottom: "16px" }}>
            Highest Impact Events
          </h3>

          {highImpactEvents.map((event, index) => (
            <div
              key={index}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid #27272a",
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "white" }}>
                {event.title}
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", fontSize: "14px" }}>
                {event.ticker} • Impact: {event.impact} • Sentiment: {event.sentiment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketOverview;