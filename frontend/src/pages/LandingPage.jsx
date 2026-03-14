import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MarketOverview from "../components/MarketOverview";
import StrategySection from "../components/StrategySection";

function LandingPage() {
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
      <HeroSection />
      <MarketOverview />
      <StrategySection />
    </div>
  );
}

export default LandingPage;