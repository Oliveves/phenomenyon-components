import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import SilkWave, { type ThemeKey } from "../../src/components/SilkWave"
import OrbitButton from "../../src/components/OrbitButton"

const THEMES: ThemeKey[] = ["champagne", "platinum", "blush", "midnight"]

const LABEL_COLOR: Record<ThemeKey, string> = {
  champagne: "#2A1F0E",
  platinum: "#1A2330",
  blush: "#2A1010",
  midnight: "#F0F4FF",
}

const ArrowDown = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    style={{ flexShrink: 0 }}
    aria-hidden
  >
    <path
      d="M12 5L12 19M12 19L5 12M12 19L19 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

function SilkWaveGrid() {
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
        fontFamily: "'Imbue', serif",
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
              fontWeight: 400,
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "0.01em",
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

function OrbitButtonShowcase() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <SilkWave fill theme="midnight" speed={0.004} noiseOpacity={0.02} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "10vh 24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            phenomenyon stu.
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: "'Imbue', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.01em",
            }}
          >
            OrbitButton
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OrbitButton onClick={() => {}}>
            <span>AI 영상 제작 소개서</span>
            <ArrowDown />
          </OrbitButton>

          <OrbitButton
            duration={2}
            radius={28}
            thickness={2}
            color="#FFD9A8"
            trailColor="rgba(255, 217, 168, 0.12)"
            background="rgba(255, 217, 168, 0.04)"
            textColor="#FFE9CC"
            buttonStyle={{ height: 58, padding: "0 32px", fontSize: 20 }}
          >
            <span>Champagne</span>
            <ArrowDown />
          </OrbitButton>

          <OrbitButton
            duration={4}
            color="#A8C7FF"
            trailColor="rgba(168, 199, 255, 0.14)"
            background="rgba(168, 199, 255, 0.04)"
            textColor="#E5EEFF"
            reverse
          >
            <span>Reverse</span>
            <ArrowDown />
          </OrbitButton>

          <OrbitButton
            duration={6}
            cometWidth={200}
            color="#FFB0C8"
            trailColor="rgba(255, 176, 200, 0.18)"
            background="rgba(255, 176, 200, 0.05)"
            textColor="#FFE2EC"
          >
            <span>Slow glow</span>
            <ArrowDown />
          </OrbitButton>
        </div>

        <div
          style={{
            fontSize: 12,
            opacity: 0.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          append ?silkwave to URL for the SilkWave demo
        </div>
      </div>
    </div>
  )
}

const showSilkwave =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("silkwave")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {showSilkwave ? <SilkWaveGrid /> : <OrbitButtonShowcase />}
  </StrictMode>,
)
