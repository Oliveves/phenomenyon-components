import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import SilkWave, { type ThemeKey } from "../../src/components/SilkWave"
import OrbitButton, { type OrbitButtonProps } from "../../src/components/OrbitButton"

const THEMES: ThemeKey[] = ["champagne", "platinum", "blush", "midnight"]

const LABEL_COLOR: Record<ThemeKey, string> = {
  champagne: "#2A1F0E",
  platinum: "#1A2330",
  blush: "#2A1010",
  midnight: "#F0F4FF",
}

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

type OrbitVariant = {
  key: string
  label: string
  props?: Partial<OrbitButtonProps>
}

const ORBIT_VARIANTS: OrbitVariant[] = [
  {
    key: "default",
    label: "AI 영상 제작 소개서",
  },
  {
    key: "fast",
    label: "Faster orbit",
    props: { duration: 2 },
  },
  {
    key: "reverse",
    label: "Reverse",
    props: { reverse: true },
  },
  {
    key: "wide",
    label: "Wide streak",
    props: { streakWidth: 90, duration: 6 },
  },
  {
    key: "platinum",
    label: "Platinum",
    props: {
      background: "#1a1a1a",
      accentColor: "#E8E8E8",
      textColor: "#F5F5F5",
      radius: 28,
      height: 58,
      fontSize: 20,
    },
  },
  {
    key: "blush",
    label: "Blush",
    props: {
      background: "#2A0F12",
      accentColor: "#FFB0C8",
      textColor: "#FFE2EC",
      thickness: 3,
    },
  },
]

function OrbitButtonShowcase() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        background: "#000",
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 64,
          padding: "14vh 24px 12vh",
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
            gap: 28,
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 1100,
          }}
        >
          {ORBIT_VARIANTS.map(({ key, label, props }) => (
            <OrbitButton key={key} {...props}>
              <span>{label}</span>
            </OrbitButton>
          ))}
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
