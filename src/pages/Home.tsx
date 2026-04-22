import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import SilkWave from "../components/SilkWave"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return isMobile
}

const FONT_SANS =
  "'Geist', 'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif"
const FONT_SERIF = "'Imbue', serif"

const HEADER_H = 72

const COLORS = {
  bg: "#080808",
  text: "#F0EDE8",
  silver: "#C0C0C0",
  card: "#111111",
  imageBg: "#000000",
  border: "#1a1a1a",
  catInactive: "#333",
  descText: "#999",
  soonText: "#333",
}

type Item = {
  id: string
  name: string
  desc: string
  path?: string
  available: boolean
  date?: string
  popular?: number
}

type Category = {
  label: string
  items: Item[]
}

const categories: Record<string, Category> = {
  backgrounds: {
    label: "Backgrounds",
    items: [
      {
        id: "silk-wave",
        name: "Silk Wave",
        desc: "Animated silk wave background with grain texture. 4 themes.",
        path: "/components/silk-wave",
        available: true,
        date: "2026-04-21",
        popular: 1,
      },
      { id: "cs1", name: "Aurora", desc: "Coming soon", available: false },
      { id: "cs2", name: "Particle Field", desc: "Coming soon", available: false },
    ],
  },
  interactions: {
    label: "Interactions",
    items: [
      { id: "cs3", name: "Magnetic Button", desc: "Coming soon", available: false },
      { id: "cs4", name: "Cursor Follower", desc: "Coming soon", available: false },
      { id: "cs5", name: "Image Hover Reveal", desc: "Coming soon", available: false },
    ],
  },
  typography: {
    label: "Typography",
    items: [
      { id: "cs6", name: "Text Reveal", desc: "Coming soon", available: false },
      { id: "cs7", name: "Marquee Text", desc: "Coming soon", available: false },
      { id: "cs8", name: "Kinetic Type", desc: "Coming soon", available: false },
    ],
  },
  buttons: {
    label: "Buttons",
    items: [
      { id: "cs9", name: "Glow Button", desc: "Coming soon", available: false },
      { id: "cs10", name: "Liquid Button", desc: "Coming soon", available: false },
      { id: "cs11", name: "Split Button", desc: "Coming soon", available: false },
    ],
  },
}

const CATEGORY_KEYS = Object.keys(categories)

export default function Home() {
  const [splash, setSplash] = useState(
    () => !sessionStorage.getItem("splashShown")
  )
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!splash) return
    const fade = setTimeout(() => setFading(true), 1500)
    const unmount = setTimeout(() => {
      setSplash(false)
      sessionStorage.setItem("splashShown", "1")
    }, 2000)
    return () => {
      clearTimeout(fade)
      clearTimeout(unmount)
    }
  }, [splash])

  const isMobile = useIsMobile()

  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("backgrounds")
  const isSearching = query.trim().length > 0

  const displayItems = useMemo(() => {
    if (isSearching) {
      const q = query.trim().toLowerCase()
      const flat: Item[] = []
      for (const key of CATEGORY_KEYS) {
        for (const it of categories[key].items) {
          if (
            it.name.toLowerCase().includes(q) ||
            it.desc.toLowerCase().includes(q)
          ) {
            flat.push(it)
          }
        }
      }
      return flat
    }
    return categories[activeCategory].items
  }, [isSearching, query, activeCategory])

  // Wheel → horizontal scroll (desktop only)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (isMobile) return
    const el = scrollerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [isMobile])

  return (
    <div style={{
      background: COLORS.bg,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      color: COLORS.text,
      fontFamily: FONT_SANS,
    }}>
      {splash && <Splash fading={fading} />}

      <Header isMobile={isMobile} />

      <main style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: `calc(100vh - ${HEADER_H}px)`,
        marginTop: HEADER_H,
        paddingBottom: isMobile ? 72 : 60,
        boxSizing: "border-box",
      }}>
        <aside style={{
          width: isMobile ? "100%" : "28%",
          minWidth: isMobile ? 0 : 240,
          flexShrink: 0,
          borderRight: isMobile ? "none" : `1px solid ${COLORS.border}`,
          borderBottom: isMobile ? `1px solid ${COLORS.border}` : "none",
          padding: isMobile ? "20px 20px 18px" : "0 40px",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          flexWrap: isMobile ? "wrap" : "nowrap",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "stretch",
          gap: isMobile ? "10px 20px" : 16,
          overflow: "hidden",
        }}
        >
          {CATEGORY_KEYS.map((k) => {
            const isActive = !isSearching && activeCategory === k
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setActiveCategory(k)
                  setQuery("")
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: isMobile ? "4px 2px" : 0,
                  cursor: "pointer",
                  textAlign: isMobile ? "center" : "left",
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: isMobile
                    ? "1.25rem"
                    : "clamp(2.5rem, 4vw, 5rem)",
                  lineHeight: 1.1,
                  color: isActive ? COLORS.text : COLORS.catInactive,
                  borderBottom: isMobile
                    ? `1px solid ${isActive ? COLORS.text : "transparent"}`
                    : "none",
                  transition: "color 0.25s, border-color 0.25s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {categories[k].label}
              </button>
            )
          })}
        </aside>

        <section
          ref={scrollerRef}
          className="no-scrollbar"
          style={{
            flex: 1,
            minHeight: 0,
            height: isMobile ? "auto" : "100%",
            width: isMobile ? "100%" : "auto",
            overflowX: isMobile ? "hidden" : "auto",
            overflowY: isMobile ? "auto" : "hidden",
            display: "flex",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          {displayItems.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={isSearching ? "__search" : activeCategory}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                  exit: {},
                }}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 28 : 24,
                  padding: isMobile ? "24px 20px" : "0 40px",
                  alignItems: isMobile ? "stretch" : "center",
                  width: isMobile ? "100%" : "auto",
                  boxSizing: "border-box",
                }}
              >
                {displayItems.map((it) => (
                  <motion.div
                    key={it.id}
                    variants={{
                      hidden: isMobile
                        ? { y: 40, opacity: 0 }
                        : { x: 60, opacity: 0 },
                      visible: {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.4, ease: "easeOut" },
                      },
                      exit: { opacity: 0, transition: { duration: 0.15 } },
                    }}
                    style={{ flexShrink: 0 }}
                  >
                    <Card item={it} isMobile={isMobile} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <SearchBar query={query} onChange={setQuery} isMobile={isMobile} />
    </div>
  )
}

function Splash({ fading }: { fading: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: COLORS.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        opacity: fading ? 0 : 1,
        transition: "opacity 500ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <img
        src="/logo.svg"
        alt="Phenomenyon stu."
        style={{
          width: "clamp(180px, 28vw, 420px)",
          height: "auto",
          filter: "invert(1)",
        }}
      />
    </div>
  )
}

function Header({ isMobile }: { isMobile: boolean }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 18px" : "0 32px",
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.svg"
          alt="Phenomenyon stu."
          style={{ height: isMobile ? 26 : 32, width: "auto", filter: "invert(1)" }}
        />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 20 : 28, color: COLORS.silver }}>
        <a
          href="https://www.framer.com/marketplace/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Framer Marketplace"
          style={{ display: "flex", alignItems: "center", color: "inherit" }}
        >
          <svg
            width="12"
            height="18"
            viewBox="44.65 33.992 50.7 76.049"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M 44.65 33.992 L 95.35 33.992 L 95.35 59.341 L 70 59.341 Z M 44.65 59.341 L 70 59.341 L 95.35 84.691 L 44.65 84.691 Z M 44.65 84.691 L 70 84.691 L 70 110.041 Z" />
          </svg>
        </a>
        <a
          href="mailto:phenomenyon.stu@gmail.com"
          aria-label="Email"
          style={{ display: "flex", alignItems: "center", color: "inherit" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 5L2 7" />
          </svg>
        </a>
        <a
          href="https://instagram.com/phenomenyon.stu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          style={{ display: "flex", alignItems: "center", color: "inherit" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </header>
  )
}

function SearchBar({
  query,
  onChange,
  isMobile,
}: {
  query: string
  onChange: (v: string) => void
  isMobile: boolean
}) {
  return (
    <div
      style={{
        position: "fixed",
        left: isMobile ? 20 : 40,
        right: isMobile ? 20 : "auto",
        bottom: isMobile ? 20 : 32,
        zIndex: 50,
        width: isMobile ? "auto" : 240,
        background: COLORS.bg,
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: COLORS.silver,
        borderBottom: `1px solid ${COLORS.silver}`,
        padding: "6px 0",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          padding: 0,
          color: COLORS.text,
          fontFamily: FONT_SANS,
          fontSize: "0.85rem",
          letterSpacing: "0.04em",
          outline: "none",
        }}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COLORS.silver,
        fontFamily: FONT_SANS,
        fontSize: "0.95rem",
        letterSpacing: "0.1em",
      }}
    >
      No components found.
    </div>
  )
}

const THEMES = ["gold", "silver", "rose", "navy"] as const

const THEME_DOT: Record<(typeof THEMES)[number], string> = {
  gold: "#B4913C",
  silver: "#96AAB9",
  rose: "#BE8282",
  navy: "#5082C8",
}

function Card({ item, isMobile }: { item: Item; isMobile: boolean }) {
  const isSilkWave = item.id === "silk-wave"
  const [activeTheme, setActiveTheme] = useState<(typeof THEMES)[number]>("gold")

  return (
    <article
      style={{
        width: isMobile ? "100%" : 540,
        maxWidth: isMobile ? 480 : undefined,
        marginInline: isMobile ? "auto" : undefined,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 12 : 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "1.4rem",
              color: item.available ? COLORS.text : COLORS.soonText,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {item.name}
          </h3>
          <p
            style={{
              marginTop: 6,
              fontFamily: FONT_SANS,
              fontSize: "0.8rem",
              lineHeight: 1.45,
              color: item.available ? COLORS.descText : COLORS.soonText,
              margin: 0,
            }}
          >
            {item.desc}
          </p>
          {isSilkWave && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {THEMES.map((t) => {
                const active = activeTheme === t
                return (
                  <button
                    key={t}
                    type="button"
                    aria-label={`${t} theme`}
                    aria-pressed={active}
                    onClick={() => setActiveTheme(t)}
                    style={{
                      width: 14,
                      height: 14,
                      padding: 0,
                      borderRadius: "50%",
                      background: THEME_DOT[t],
                      border: active
                        ? "1.5px solid rgba(255,255,255,0.8)"
                        : "1px solid rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      transform: active ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.15s, border-color 0.15s",
                      outline: "none",
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
        <ViewButton item={item} />
      </div>

      <div
        style={{
          width: "100%",
          aspectRatio: "21 / 9",
          background: COLORS.imageBg,
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isSilkWave ? (
          <SilkWave fill theme={activeTheme} speed={0.006} noiseOpacity={0.02} />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_SANS,
              fontSize: "0.8rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.soonText,
            }}
          >
            Coming Soon
          </div>
        )}
      </div>
    </article>
  )
}

function ViewButton({ item }: { item: Item }) {
  const [hovered, setHovered] = useState(false)
  const active = item.available && hovered

  const style: React.CSSProperties = {
    display: "inline-block",
    background: "#0a0a0a",
    color: COLORS.text,
    border: "1px solid #262626",
    borderRadius: 999,
    padding: "5px 14px",
    fontFamily: FONT_SANS,
    fontWeight: 400,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: item.available ? "pointer" : "default",
    opacity: item.available ? 1 : 0.3,
    flexShrink: 0,
  }

  const content = (
    <>
      View{" "}
      <motion.span
        style={{ display: "inline-block" }}
        animate={active ? { x: [0, 4, 0] } : { x: 0 }}
        transition={{
          duration: 0.9,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        →
      </motion.span>
    </>
  )

  if (item.available && item.path) {
    return (
      <Link
        to={item.path}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </Link>
    )
  }

  return (
    <span style={style} aria-disabled>
      {content}
    </span>
  )
}
