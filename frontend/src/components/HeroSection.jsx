import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      style={{
        padding: "100px 20px",
        textAlign: "center",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Sentra AI
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#a1a1aa",
          marginBottom: "30px",
          lineHeight: 1.6,
        }}
      >
        Turn financial news sentiment into trading signals, visualize market impact,
        and compare strategy performance against buy-and-hold.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/stock/AAPL"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          Explore Demo
        </Link>

        <Link
          to="/signup"
          style={{
            backgroundColor: "#18181b",
            color: "white",
            textDecoration: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            border: "1px solid #27272a",
            fontWeight: "600",
          }}
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;