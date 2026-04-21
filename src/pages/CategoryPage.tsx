import { useEffect, useRef, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { getCategory, type ComponentItem } from "../data/categories"
import SilkWave from "../components/SilkWave"

const COLORS = {
  bg: "#080808",
  text: "#F0EDE8",
  silver: "#C0C0C0",
  card: "#111111",
  cardSoon: "#1a1a1a",
  dim: "#3A3A3A",
  soonText: "#6B6B6B",
}

const CARD_W = 480
const CARD_GAP = 24
const PAD_LEFT = 60
const PAD_RIGHT = 60

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const category = slug ? getCategory(slug) : undefined

  const x = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 120, damping: 30, mass: 0.5 })
  const progress = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!category) return

    const contentWidth =
      PAD_LEFT + category.components.length * CARD_W + (category.components.length - 1) * CARD_GAP + PAD_RIGHT
    const maxScroll = () => Math.max(0, contentWidth - window.innerWidth)

    const onWheel = (e: WheelEvent) => {
      const max = maxScroll()
      if (max === 0) return
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      progress.current = Math.max(0, Math.min(max, progress.current + delta))
      x.set(-progress.current)
    }

    const onResize = () => {
      progress.current = Math.min(progress.current, maxScroll())
      x.set(-progress.current)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", onResize)
    }
  }, [category, x])

  useEffect(() => {
    if (!category) return
    return smoothX.on("change", (v) => {
      const i = Math.round(-v / (CARD_W + CARD_GAP))
      setActive(Math.max(0, Math.min(category.components.length - 1, i)))
    })
  }, [smoothX, category])

  const goTo = (i: number) => {
    if (!category) return
    const step = CARD_W + CARD_GAP
    const contentWidth =
      PAD_LEFT + category.components.length * CARD_W + (category.components.length - 1) * CARD_GAP + PAD_RIGHT
    const maxScroll = Math.max(0, contentWidth - window.innerWidth)
    progress.current = Math.min(i * step, maxScroll)
    x.set(-progress.current)
  }

  if (!category) {
    return (
      <div style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontSize: "0.9rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: COLORS.silver, margin: "0 0 16px" }}>Category not found</p>
          <Link to="/" style={{ color: COLORS.text, textDecoration: "underline" }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
    }}>
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 40px",
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          style={{
            background: "transparent",
            border: "none",
            color: COLORS.silver,
            cursor: "pointer",
            fontSize: "1.5rem",
            padding: 8,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          ←
        </button>
        <h1 style={{
          fontFamily: "'Imbue', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          color: COLORS.text,
          margin: 0,
        }}>
          {category.name}
        </h1>
      </header>

      <motion.div
        style={{
          display: "flex",
          gap: CARD_GAP,
          paddingLeft: PAD_LEFT,
          paddingRight: PAD_RIGHT,
          alignItems: "center",
          height: "100vh",
          x: smoothX,
        }}
      >
        {category.components.map((item, i) => (
          <CategoryCard
            key={item.slug}
            item={item}
            index={i + 1}
            categorySlug={category.slug}
          />
        ))}
      </motion.div>

      <nav style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 12,
        zIndex: 10,
      }}>
        {category.components.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to card ${i + 1}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              background: i === active ? COLORS.text : COLORS.dim,
              transition: "background 0.25s",
              cursor: "pointer",
            }}
          />
        ))}
      </nav>
    </div>
  )
}

function CategoryCard({
  item,
  index,
  categorySlug,
}: {
  item: ComponentItem
  index: number
  categorySlug: string
}) {
  const isLive = item.status === "live"
  const isSilkWave = categorySlug === "backgrounds" && item.slug === "silk-wave"

  return (
    <article style={{
      width: CARD_W,
      height: "70vh",
      flexShrink: 0,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      background: isLive ? COLORS.card : COLORS.cardSoon,
    }}>
      {isSilkWave && (
        <SilkWave fill theme="gold" speed={0.006} noiseOpacity={0.02} />
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.7rem",
          letterSpacing: "0.4em",
          color: COLORS.silver,
        }}>
          {String(index).padStart(2, "0")}
        </span>

        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}>
          {isLive ? (
            <>
              <h2 style={{
                fontFamily: "'Imbue', serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                color: COLORS.text,
                margin: 0,
              }}>
                {item.name}
              </h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.85rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: COLORS.silver,
                margin: 0,
              }}>
                {item.desc}
              </p>
            </>
          ) : (
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.8rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: COLORS.silver,
            }}>
              Coming Soon
            </span>
          )}
        </div>

        <div style={{
          alignSelf: "flex-end",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}>
          {isLive ? (
            <Link
              to={`/components/${item.slug}`}
              style={{ color: COLORS.silver, textDecoration: "none" }}
            >
              View →
            </Link>
          ) : (
            <span style={{ color: COLORS.silver, opacity: 0.4 }}>View →</span>
          )}
        </div>
      </div>
    </article>
  )
}
