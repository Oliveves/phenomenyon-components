import { StrictMode, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import SilkWave, { type ThemeKey } from "../../src/components/SilkWave"
import OrbitButton, {
  type OrbitButtonProps,
} from "../../src/components/OrbitButton"
import ScrollIndicator from "../../src/components/ScrollIndicator"

const DISPLAY_FONT = "'Barlow Semi Condensed', sans-serif"
const META_FONT = "'Inconsolata', monospace"

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
        fontFamily: DISPLAY_FONT,
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
              fontWeight: 500,
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
        fontFamily: META_FONT,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        opacity: 0.55,
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
    key: "solid-champagne",
    label: "Solid · champagne",
    text: "Champagne",
    props: {
      variant: "solid",
      background: "#2A1F0E",
      accentColor: "#F5D58A",
      textColor: "#F5E5C2",
    },
  },
  {
    key: "solid-midnight",
    label: "Solid · midnight",
    text: "Midnight",
    props: {
      variant: "solid",
      background: "#0E1530",
      accentColor: "#A8C7FF",
      textColor: "#E5EEFF",
    },
  },
  {
    key: "holo-plum",
    label: "Holo · plum",
    text: "Plum",
    props: {
      variant: "holographic",
      background: "#1A0E20",
      hologramColors: ["#FFD1A8", "#FF9EC0", "#C8A8FF"],
      textColor: "#F0E5FF",
    },
  },
  {
    key: "holo-forest",
    label: "Holo · forest",
    text: "Forest",
    props: {
      variant: "holographic",
      background: "#0E1A14",
      hologramColors: ["#A8FFE6", "#A8C7FF", "#D6A8FF"],
      textColor: "#E5FFF4",
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
        fontFamily: DISPLAY_FONT,
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
            fontFamily: DISPLAY_FONT,
            fontWeight: 500,
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.95,
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

      <Caption>append ?silkwave or ?scroll to URL for other demos</Caption>
    </div>
  )
}

function ScrollIndicatorShowcase() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: DISPLAY_FONT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <Caption>phenomenyon stu.</Caption>
        <div
          style={{
            fontWeight: 500,
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.95,
          }}
        >
          ScrollIndicator
        </div>
      </div>

      <ScrollIndicator
        label={"Explore Community\nCreations"}
        ariaLabel="Scroll to gallery"
        fadeInDelay={0.6}
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  )
}

const params =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()

function Root() {
  if (params.has("silkwave")) return <SilkWaveGrid />
  if (params.has("scroll")) return <ScrollIndicatorShowcase />
  return <OrbitButtonShowcase />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
