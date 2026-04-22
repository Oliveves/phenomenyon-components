import { useEffect, useState } from "react"
import SilkWave, { type ThemeKey } from "../../components/SilkWave"

const themeTextColors: Record<ThemeKey, { title: string; sub: string }> = {
  gold: { title: "#2A1F0E", sub: "#6B5A3E" },
  silver: { title: "#1A2330", sub: "#4A5A6A" },
  rose: { title: "#2A1010", sub: "#7A4A4A" },
  navy: { title: "#F0F4FF", sub: "#8AA0C0" },
}

const currentTheme: ThemeKey = "gold" // 여기서 테마 바꾸기

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

export default function SilkWavePage() {
  const colors = themeTextColors[currentTheme]
  const isMobile = useIsMobile()
  const sectionPadding = isMobile ? "80px 24px" : "120px 60px"

  return (
    <div style={{ overflowX: "hidden" }}>
      <SilkWave speed={0.008} noiseOpacity={0.02} theme={currentTheme} />

      {/* Hero */}
      <section style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 0,
      }}>
        <div style={{
          textAlign: "center",
          fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
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
      </section>

      {/* Components Showcase */}
      <section style={{
        position: "relative",
        zIndex: 1,
        width: "100vw",
        minHeight: "100vh",
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: sectionPadding,
        boxSizing: "border-box",
      }}>
        <p style={{
          color: "#6B6B6B",
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
        }}>
          Components
        </p>
        <h2 style={{
          color: "#F0EDE8",
          fontSize: "clamp(2rem, 4vw, 5rem)",
          fontWeight: 300,
          fontStyle: "italic",
          fontFamily: "'Imbue', serif",
          margin: isMobile ? "0 0 48px 0" : "0 0 80px 0",
          textAlign: "center",
        }}>
          Built for luxury brands.
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: isMobile ? "16px" : "24px",
          width: "100%",
          maxWidth: "1100px",
        }}>
          {[
            { name: "Silk Wave", desc: "Animated gradient background with grain texture. 4 themes included." },
            { name: "Text Reveal", desc: "Letter-by-letter entrance animation with full font controls." },
            { name: "Magnetic Button", desc: "Cursor-reactive button with spring physics." },
            { name: "Cursor Follower", desc: "Custom cursor with blend mode and lag control." },
            { name: "Marquee Text", desc: "Infinite scrolling text strip for brand statements." },
            { name: "Image Hover Reveal", desc: "Image appears on hover, follows cursor position." },
          ].map((item) => (
            <div key={item.name} style={{
              border: "1px solid #2A2A2A",
              borderRadius: "12px",
              padding: isMobile ? "24px" : "36px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              <h3 style={{
                color: "#F0EDE8",
                fontFamily: "'Imbue', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "1.4rem",
                margin: 0,
              }}>
                {item.name}
              </h3>
              <p style={{
                color: "#6B6B6B",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                margin: 0,
                fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
                letterSpacing: "0.02em",
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Themes Section */}
      <section style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: sectionPadding,
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1,
      }}>
        <p style={{
          color: "#8C7B6B",
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
        }}>
          Themes
        </p>
        <h2 style={{
          color: "#2A1F0E",
          fontSize: "clamp(2rem, 4vw, 5rem)",
          fontWeight: 300,
          fontStyle: "italic",
          fontFamily: "'Imbue', serif",
          margin: isMobile ? "0 0 48px 0" : "0 0 80px 0",
          textAlign: "center",
        }}>
          Four moods, one component.
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(auto-fit, minmax(240px, 1fr))",
          gap: isMobile ? "12px" : "16px",
          width: "100%",
          maxWidth: "1100px",
        }}>
          {[
            { theme: "gold",   label: "Gold",   textColor: "#2A1F0E", subColor: "#6B5A3E" },
            { theme: "silver", label: "Silver", textColor: "#1A2330", subColor: "#4A5A6A" },
            { theme: "rose",   label: "Rose",   textColor: "#2A1010", subColor: "#7A4A4A" },
            { theme: "navy",   label: "Navy",   textColor: "#F0F4FF", subColor: "#8AA0C0" },
          ].map((item) => (
            <div key={item.theme} style={{
              position: "relative",
              height: isMobile ? "200px" : "320px",
              borderRadius: isMobile ? "12px" : "16px",
              overflow: "hidden",
            }}>
              <SilkWave
                fill
                theme={item.theme as ThemeKey}
                speed={0.006}
                noiseOpacity={0.02}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}>
                <p style={{
                  fontFamily: "'Imbue', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: isMobile ? "1.5rem" : "2rem",
                  color: item.textColor,
                  margin: 0,
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: item.subColor,
                  marginTop: "8px",
                }}>
                  Silk Wave
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        width: "100vw",
        minHeight: "60vh",
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: sectionPadding,
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1,
      }}>
        <p style={{
          color: "#6B6B6B",
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
        }}>
          Available on
        </p>
        <h2 style={{
          color: "#F0EDE8",
          fontSize: "clamp(2rem, 4vw, 5rem)",
          fontWeight: 300,
          fontStyle: "italic",
          fontFamily: "'Imbue', serif",
          margin: isMobile ? "0 0 36px 0" : "0 0 48px 0",
          textAlign: "center",
        }}>
          Framer Marketplace
        </h2>

        <a
          href="https://www.framer.com/marketplace/components/?q=silkwave"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: isMobile ? "14px 32px" : "16px 48px",
            border: "1px solid #F0EDE8",
            color: "#F0EDE8",
            fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
            fontSize: isMobile ? "0.75rem" : "0.85rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#F0EDE8"
            ;(e.currentTarget as HTMLAnchorElement).style.color = "#0D0D0D"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent"
            ;(e.currentTarget as HTMLAnchorElement).style.color = "#F0EDE8"
          }}
        >
          View Components
        </a>

        <p style={{
          color: "#3A3A3A",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          marginTop: isMobile ? "48px" : "80px",
          fontFamily: "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
        }}>
          © Phenomenyon stu. 2026
        </p>
      </section>
    </div>
  )
}
