import NoiseGradient from "./components/NoiseGradient"

export default function App() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <NoiseGradient speed={0.008} noiseOpacity={0.02} />
      <div style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        color: "#2A1F0E",
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 6rem)",
          margin: 0,
          fontWeight: 300,
          fontStyle: "italic",
          letterSpacing: "0.05em",
          fontFamily: "'Imbue', serif",
        }}>
          Phenomenyon stu.
        </h1>
        <p style={{
          fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
          letterSpacing: "0.4em",
          marginTop: "1.5rem",
          fontWeight: 300,
          color: "#6B5A3E",
          textTransform: "uppercase",
        }}>
          Curated interactions for brands that demand more.
        </p>
      </div>
    </div>
  )
}