import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import SilkWave, { type ThemeKey } from "../../src/components/SilkWave"

const THEMES: ThemeKey[] = ["gold", "silver", "rose", "navy"]

const LABEL_COLOR: Record<ThemeKey, string> = {
  gold: "#2A1F0E",
  silver: "#1A2330",
  rose: "#2A1010",
  navy: "#F0F4FF",
}

function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 12,
        padding: 12,
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        background: "#0a0a0a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {THEMES.map((theme) => (
        <div
          key={theme}
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <SilkWave fill theme={theme} speed={0.006} noiseOpacity={0.02} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: LABEL_COLOR[theme],
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "0.05em",
              pointerEvents: "none",
            }}
          >
            {theme}
          </div>
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
