import NoiseGradient, { type ThemeKey } from "./components/NoiseGradient"

const themeTextColors: Record<ThemeKey, { title: string; sub: string }> = {
  gold: { title: "#2A1F0E", sub: "#6B5A3E" },
  silver: { title: "#1A2330", sub: "#4A5A6A" },
  rose: { title: "#2A1010", sub: "#7A4A4A" },
  navy: { title: "#F0F4FF", sub: "#8AA0C0" },
}

const currentTheme: ThemeKey = "rose" // 여기서 테마 바꾸기

export default function App() {
  const colors = themeTextColors[currentTheme]

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
      <NoiseGradient speed={0.008} noiseOpacity={0.02} theme={currentTheme} />
      <div style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 6rem)",
          margin: 0,
          fontWeight: 300,
          fontStyle: "italic",
          letterSpacing: "0.05em",
          fontFamily: "'Imbue', serif",
          color: colors.title,
        }}>
          Phenomenyon stu.
        </h1>
        <p style={{
          fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
          letterSpacing: "0.4em",
          marginTop: "1.5rem",
          fontWeight: 300,
          color: colors.sub,
          textTransform: "uppercase",
        }}>
          Curated interactions for brands that demand more.
        </p>
      </div>
    </div>
  )
}