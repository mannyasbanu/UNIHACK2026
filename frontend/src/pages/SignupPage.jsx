import Navbar from "../components/Navbar";

function SignupPage() {
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
      <div style={{ padding: "40px" }}>
        <h1>Get Started</h1>
        <p style={{ color: "#a1a1aa" }}>Signup page placeholder for now.</p>
      </div>
    </div>
  );
}

export default SignupPage;