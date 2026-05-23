import { StrictMode, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import SilkWave, { type ThemeKey } from "../../src/components/SilkWave"
import OrbitButton, {
  type OrbitButtonProps,
} from "../../src/components/OrbitButton"

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

function Caption({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        opacity: 0.5,
      }}
    >
      {children}
    </div>
  )
}

function Stack({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {children}
      <Caption>{label}</Caption>
    </div>
  )
}

type Variation = {
  key: string
  label: string
  text: string
  props: Partial<OrbitButtonProps>
}

const VARIATIONS: Variation[] = [
  {
    key: "solid-fast",
    label: "Solid · 2s",
    text: "Faster orbit",
    props: { variant: "solid", duration: 2 },
  },
  {
    key: "solid-reverse",
    label: "Solid · reverse",
    text: "Reverse",
    props: { variant: "solid", reverse: true },
  },
  {
    key: "holo-sunset",
    label: "Hologram · sunset",
    text: "Sunset",
    props: {
      variant: "holographic",
      hologramColors: ["#FFD1A8", "#FF9EC0", "#C8A8FF"],
    },
  },
  {
    key: "holo-aurora",
    label: "Hologram · aurora",
    text: "Aurora",
    props: {
      variant: "holographic",
      hologramColors: ["#A8FFE6", "#A8C7FF", "#D6A8FF"],
      duration: 6,
    },
  },
]

function OrbitButtonShowcase() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "14vh 24px 12vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 96,
      }}
    >
      <header style={{ textAlign: "center" }}>
        <Caption>phenomenyon stu.</Caption>
        <div
          style={{
            marginTop: 12,
            fontFamily: "'Imbue', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "0.01em",
          }}
        >
          OrbitButton
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: 72,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Stack label="Solid">
          <OrbitButton variant="solid">Solid orbit</OrbitButton>
        </Stack>
        <Stack label="Holographic">
          <OrbitButton variant="holographic">Holographic orbit</OrbitButton>
        </Stack>
      </div>

      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1100,
        }}
      >
        {VARIATIONS.map(({ key, label, text, props }) => (
          <Stack key={key} label={label}>
            <OrbitButton {...props}>{text}</OrbitButton>
          </Stack>
        ))}
      </div>

      <Caption>append ?silkwave to URL for the SilkWave demo</Caption>
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
