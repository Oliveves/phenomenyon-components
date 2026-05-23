import { useEffect, type CSSProperties, type ReactNode } from "react"

const STYLE_ID = "phenomenyon-orbit-button-keyframes"

function ensureStyle() {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement("style")
    style.id = STYLE_ID
    style.textContent = `
@property --phenomenyon-orbit-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}
@keyframes phenomenyon-orbit-spin {
    to { --phenomenyon-orbit-angle: 360deg; }
}
@keyframes phenomenyon-orbit-spin-fallback {
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
    /** button corner radius in px */
    radius?: number
    /** how far the glow halo extends outside the button (px) */
    haloSize?: number
    /** blur amount of the orbiting glow (px) */
    haloBlur?: number
    /** comet color */
    color?: string
    /** comet sweep width in degrees, 0..360 */
    cometWidth?: number
    /** button background (should be opaque to mask the halo behind the button face) */
    background?: string
    /** button text color */
    textColor?: string
    /** pause the orbit */
    paused?: boolean
    /** orbit counter-clockwise */
    reverse?: boolean
    className?: string
    style?: CSSProperties
    buttonStyle?: CSSProperties
}

export default function OrbitButton({
    children,
    onClick,
    duration = 3,
    radius = 18,
    haloSize = 28,
    haloBlur = 14,
    color = "#FFFFFF",
    cometWidth = 90,
    background = "#141414",
    textColor = "#FFFFFF",
    paused = false,
    reverse = false,
    className,
    style,
    buttonStyle,
}: OrbitButtonProps) {
    useEffect(() => {
        ensureStyle()
    }, [])

    const tail = Math.max(0, 360 - cometWidth)
    const cometGradient = `conic-gradient(from var(--phenomenyon-orbit-angle), transparent 0deg, transparent ${tail}deg, ${color} 358deg, transparent 360deg)`

    return (
        <span
            className={className}
            style={{
                position: "relative",
                display: "inline-block",
                lineHeight: 0,
                isolation: "isolate",
                ...style,
            }}
        >
            <span
                aria-hidden
                style={{
                    position: "absolute",
                    top: `-${haloSize}px`,
                    left: `-${haloSize}px`,
                    right: `-${haloSize}px`,
                    bottom: `-${haloSize}px`,
                    borderRadius: radius + haloSize,
                    background: cometGradient,
                    filter: `blur(${haloBlur}px)`,
                    animation: `phenomenyon-orbit-spin ${duration}s linear infinite${
                        reverse ? " reverse" : ""
                    }`,
                    animationPlayState: paused ? "paused" : "running",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <button
                type="button"
                onClick={onClick}
                style={{
                    position: "relative",
                    zIndex: 1,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "0 28px",
                    height: 52,
                    borderRadius: radius,
                    background,
                    color: textColor,
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "0.01em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    ...buttonStyle,
                }}
            >
                {children}
            </button>
        </span>
    )
}
