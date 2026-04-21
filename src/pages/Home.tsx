import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { categories, type ComponentItem } from "../data/categories"
import SilkWave, { type ThemeKey } from "../components/SilkWave"

const THEME_DOT: Record<ThemeKey, string> = {
  gold: "#B4913C",
  silver: "#96AAB9",
  rose: "#BE8282",
  navy: "#5082C8",
}

const THEME_ORDER: ThemeKey[] = ["gold", "silver", "rose", "navy"]

const COLORS = {
  bg: "#080808",
  text: "#F0EDE8",
  silver: "#C0C0C0",
  card: "#111111",
  border: "#1f1f1f",
  dim: "#3a3a3a",
  soonText: "#6B6B6B",
}

type SortKey = "latest" | "popular"

export default function Home() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashShown")
  )
  const [splashFading, setSplashFading] = useState(false)

  useEffect(() => {
    if (!showSplash) return
    const toFade = setTimeout(() => setSplashFading(true), 1500)
    const toUnmount = setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem("splashShown", "1")
    }, 2000)
    return () => {
      clearTimeout(toFade)
      clearTimeout(toUnmount)
    }
  }, [showSplash])

  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("latest")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories
      .map((c) => ({
        ...c,
        components: q
          ? c.components.filter(
              (x) =>
                x.status === "live" &&
                x.name.toLowerCase().includes(q)
            )
          : c.components,
      }))
      .filter((c) => c.components.length > 0)
  }, [query])

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      {showSplash && <Splash fading={splashFading} />}

      <Header
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
      />

      <main style={{ padding: "112px 60px 80px" }}>
        {filtered.length === 0 ? (
          <p style={{
            textAlign: "center",
            marginTop: "40vh",
            color: COLORS.silver,
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: "0.85rem",
          }}>
            No results for “{query}”
          </p>
        ) : (
          filtered.map((c) => (
            <CategoryRow key={c.slug} slug={c.slug} name={c.name} components={c.components} />
          ))
        )}
      </main>
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

function Header({
  query,
  onQueryChange,
  sort,
  onSortChange,
}: {
  query: string
  onQueryChange: (v: string) => void
  sort: SortKey
  onSortChange: (v: SortKey) => void
}) {
  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: "grid",
      gridTemplateColumns: "1fr 2fr 1fr",
      alignItems: "center",
      padding: "0 32px",
      gap: 24,
      background: "rgba(8, 8, 8, 0.75)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${COLORS.border}`,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.svg"
          alt="Phenomenyon stu."
          style={{ height: 24, width: "auto", filter: "invert(1)" }}
        />
      </Link>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search components..."
          style={{
            width: "100%",
            maxWidth: 480,
            background: "transparent",
            border: `1px solid ${COLORS.silver}`,
            borderRadius: 999,
            padding: "10px 20px",
            color: COLORS.text,
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "8px 14px",
            color: COLORS.silver,
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>
    </header>
  )
}

function CategoryRow({
  slug,
  name,
  components,
}: {
  slug: string
  name: string
  components: ComponentItem[]
}) {
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 24,
      }}>
        <h2 style={{
          fontFamily: "'Imbue', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(1.8rem, 3vw, 2.75rem)",
          color: COLORS.silver,
          margin: 0,
        }}>
          {name}
        </h2>
        <Link
          to={`/category/${slug}`}
          style={{
            color: COLORS.silver,
            textDecoration: "none",
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          See all →
        </Link>
      </div>

      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          paddingBottom: 8,
          marginRight: -60,
        }}
      >
        {components.map((item) => (
          <Card key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}

function Card({ item }: { item: ComponentItem }) {
  const isLive = item.status === "live"
  const [hovered, setHovered] = useState(false)
  const [hoveredDot, setHoveredDot] = useState<ThemeKey | null>(null)
  const theme: ThemeKey = hoveredDot ?? "gold"

  const body = (
    <div
      onMouseEnter={() => isLive && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setHoveredDot(null)
      }}
      style={{
        width: 320,
        height: 240,
        flexShrink: 0,
        borderRadius: 12,
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        position: "relative",
        overflow: "hidden",
        cursor: isLive ? "pointer" : "default",
        opacity: isLive ? 1 : 0.5,
        transition: "border-color 0.2s",
      }}
    >
      {isLive && hovered && (
        <>
          <SilkWave fill theme={theme} speed={0.008} noiseOpacity={0.02} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }} />
        </>
      )}

      <div style={{
        position: "relative",
        zIndex: 1,
        padding: 24,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <h3 style={{
          fontFamily: "'Imbue', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "1.5rem",
          color: COLORS.text,
          margin: 0,
        }}>
          {item.name}
        </h3>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <p style={{
            flex: 1,
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            letterSpacing: "0.03em",
            color: hovered ? COLORS.text : COLORS.soonText,
            margin: 0,
            transition: "color 0.2s",
          }}>
            {item.desc}
          </p>
          {isLive && (
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {THEME_ORDER.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`${t} theme`}
                  onMouseEnter={() => setHoveredDot(t)}
                  onMouseLeave={() => setHoveredDot(null)}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: `1px solid ${hoveredDot === t ? COLORS.text : "rgba(255,255,255,0.15)"}`,
                    padding: 0,
                    background: THEME_DOT[t],
                    cursor: "pointer",
                    transition: "border-color 0.15s, transform 0.15s",
                    transform: hoveredDot === t ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLive) {
    return (
      <Link to={`/components/${item.slug}`} style={{ textDecoration: "none" }}>
        {body}
      </Link>
    )
  }
  return body
}
