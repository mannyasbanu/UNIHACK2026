import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"

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
        </div>
    );
}

export default LandingPage;



