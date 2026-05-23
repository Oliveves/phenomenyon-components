import { useEffect, type CSSProperties, type ReactNode } from "react"

const STYLE_ID = "phenomenyon-orbit-button-keyframes"

function ensureStyle() {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement("style")
    style.id = STYLE_ID
    style.textContent = `
@keyframes phenomenyon-orbit-spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
}
`
    document.head.appendChild(style)
}

export type OrbitButtonProps = {
    children?: ReactNode
    onClick?: () => void
    /** seconds for one full orbit */
    duration?: number
    /** orbit ring thickness in px */
    thickness?: number
    /** corner radius in px */
    radius?: number
    /** comet (rotating highlight) color */
    color?: string
    /** static ring tint behind the comet */
    trailColor?: string
    /** button background */
    background?: string
    /** button text color */
    textColor?: string
    /** backdrop-filter blur in px (0 disables) */
    blur?: number
    /** width of the comet sweep, 0..360 */
    cometWidth?: number
    /** pause the orbit */
    paused?: boolean
    /** counter-clockwise */
    reverse?: boolean
    /** show a hairline border between ring and button face */
    inset?: boolean
    className?: string
    style?: CSSProperties
    buttonStyle?: CSSProperties
}

export default function OrbitButton({
    children,
    onClick,
    duration = 3,
    thickness = 1.5,
    radius = 18,
    color = "#FFFFFF",
    trailColor = "rgba(255, 255, 255, 0.10)",
    background = "rgba(255, 255, 255, 0.04)",
    textColor = "#FFFFFF",
    blur = 12,
    cometWidth = 110,
    paused = false,
    reverse = false,
    inset = true,
    className,
    style,
    buttonStyle,
}: OrbitButtonProps) {
    useEffect(() => {
        ensureStyle()
    }, [])

    const sweepStart = Math.max(0, 360 - cometWidth)
    const cometGradient = `conic-gradient(from 0deg, transparent 0deg, transparent ${sweepStart}deg, ${color} 358deg, transparent 360deg)`

    return (
        <span
            className={className}
            style={{
                position: "relative",
                display: "inline-block",
                borderRadius: radius,
                overflow: "hidden",
                isolation: "isolate",
                padding: thickness,
                background: trailColor,
                lineHeight: 0,
                ...style,
            }}
        >
            <span
                aria-hidden
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "200%",
                    aspectRatio: "1 / 1",
                    background: cometGradient,
                    transform: "translate(-50%, -50%)",
                    animation: `phenomenyon-orbit-spin ${duration}s linear infinite${
                        reverse ? " reverse" : ""
                    }`,
                    animationPlayState: paused ? "paused" : "running",
                    pointerEvents: "none",
                    zIndex: 0,
                    willChange: "transform",
                }}
            />
            <button
                type="button"
                onClick={onClick}
                style={{
                    position: "relative",
                    zIndex: 1,
                    border: inset ? "1px solid rgba(255,255,255,0.06)" : "none",
                    outline: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "0 28px",
                    height: 52,
                    borderRadius: Math.max(0, radius - thickness),
                    background,
                    color: textColor,
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "0.01em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
                    WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
                    ...buttonStyle,
                }}
            >
                {children}
            </button>
        </span>
    )
}
