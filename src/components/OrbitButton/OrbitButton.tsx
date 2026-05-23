import {
    useEffect,
    type CSSProperties,
    type MouseEventHandler,
    type ReactNode,
} from "react"

const STYLE_ID = "phenomenyon-orbit-button-style"

const STYLES = `
@property --phenomenyon-orbit-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}
.phenomenyon-orbit-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border: 0;
    outline: 0;
    appearance: none;
    text-align: center;
    line-height: 1;
    font-family: 'Barlow Semi Condensed', 'Inconsolata', sans-serif;
    font-weight: 600;
    color: var(--phenomenyon-orbit-text, currentColor);
    background-color: var(--phenomenyon-orbit-bg, #1A1A1A);
    transition: filter 0.2s, transform 0.2s;
    isolation: isolate;
}
.phenomenyon-orbit-btn:hover { filter: brightness(1.08); }
.phenomenyon-orbit-btn:active { transform: translateY(1px); }
.phenomenyon-orbit-btn:disabled { cursor: not-allowed; opacity: 0.5; }
.phenomenyon-orbit-btn::before {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--phenomenyon-orbit-thickness, 1.5px));
    border-radius: inherit;
    padding: var(--phenomenyon-orbit-thickness, 1.5px);
    background: var(--phenomenyon-orbit-gradient);
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
    animation: phenomenyon-orbit-spin var(--phenomenyon-orbit-duration, 4s) linear infinite;
}
.phenomenyon-orbit-btn[data-paused="true"]::before { animation-play-state: paused; }
.phenomenyon-orbit-btn[data-reverse="true"]::before { animation-direction: reverse; }
@keyframes phenomenyon-orbit-spin {
    to { --phenomenyon-orbit-angle: 360deg; }
}
@media (prefers-reduced-motion: reduce) {
    .phenomenyon-orbit-btn::before { animation: none; }
}
`

function ensureStyle() {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement("style")
    el.id = STYLE_ID
    el.textContent = STYLES
    document.head.appendChild(el)
}

const DEFAULT_HOLOGRAM_COLORS = ["#FFB6E1", "#C8B6FF", "#B6FFEE", "#FFE6A8"]

function buildGradient(
    variant: "solid" | "holographic",
    accentColor: string,
    hologramColors: string[],
    streakWidth: number,
    streakPeak: number,
): string {
    const angle = "var(--phenomenyon-orbit-angle)"
    const half = streakWidth / 2
    const start = streakPeak - half
    const end = streakPeak + half
    if (variant === "solid" || hologramColors.length === 0) {
        return `conic-gradient(from ${angle},
            transparent 0deg,
            transparent ${start}deg,
            ${accentColor} ${streakPeak}deg,
            transparent ${end}deg,
            transparent 360deg)`
    }
    const fade = streakWidth * 0.18
    const innerStart = start + fade
    const innerEnd = end - fade
    const n = hologramColors.length
    const step = n > 1 ? (innerEnd - innerStart) / (n - 1) : 0
    const stops = hologramColors
        .map((c, i) => `${c} ${(innerStart + step * i).toFixed(2)}deg`)
        .join(", ")
    return `conic-gradient(from ${angle},
        transparent 0deg,
        transparent ${start}deg,
        ${stops},
        transparent ${end}deg,
        transparent 360deg)`
}

export type OrbitButtonVariant = "solid" | "holographic"

export type OrbitButtonProps = {
    children?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    type?: "button" | "submit" | "reset"
    /** "solid" = single-color streak, "holographic" = iridescent multi-color streak */
    variant?: OrbitButtonVariant
    /** seconds for one full orbit */
    duration?: number
    /** corner radius in px */
    radius?: number
    /** ring thickness in px */
    thickness?: number
    /** streak color (variant="solid") */
    accentColor?: string
    /** streak palette (variant="holographic") */
    hologramColors?: string[]
    /** width of the bright streak in degrees. Defaults: 40 (solid), 140 (holographic) */
    streakWidth?: number
    /** angle where the streak is centered (phase offset, deg) */
    streakPeak?: number
    background?: string
    textColor?: string
    paused?: boolean
    reverse?: boolean
    disabled?: boolean
    className?: string
    style?: CSSProperties
    height?: number | string
    paddingInline?: number | string
    fontSize?: number | string
    fontFamily?: string
}

export default function OrbitButton({
    children,
    onClick,
    type = "button",
    variant = "solid",
    duration = 4,
    radius = 18,
    thickness = 1.5,
    accentColor = "#FFFFFF",
    hologramColors = DEFAULT_HOLOGRAM_COLORS,
    streakWidth,
    streakPeak = 110,
    background = "#1A1A1A",
    textColor,
    paused = false,
    reverse = false,
    disabled = false,
    className,
    style,
    height = 52,
    paddingInline = 32,
    fontSize = 18,
    fontFamily,
}: OrbitButtonProps) {
    useEffect(() => {
        ensureStyle()
    }, [])

    const resolvedStreakWidth =
        streakWidth ?? (variant === "holographic" ? 140 : 40)
    const gradient = buildGradient(
        variant,
        accentColor,
        hologramColors,
        resolvedStreakWidth,
        streakPeak,
    )

    const px = (v: number | string) => (typeof v === "number" ? `${v}px` : v)

    const cssVars: CSSProperties & Record<string, string | number> = {
        ["--phenomenyon-orbit-gradient"]: gradient,
        ["--phenomenyon-orbit-bg"]: background,
        ["--phenomenyon-orbit-thickness"]: `${thickness}px`,
        ["--phenomenyon-orbit-duration"]: `${duration}s`,
        ...(textColor ? { ["--phenomenyon-orbit-text"]: textColor } : null),
        borderRadius: radius,
        height: px(height),
        paddingInline: px(paddingInline),
        fontSize: px(fontSize),
        ...(fontFamily ? { fontFamily } : null),
        ...style,
    }

    const composedClassName = ["phenomenyon-orbit-btn", className]
        .filter(Boolean)
        .join(" ")

    return (
        <button
            type={type}
            className={composedClassName}
            onClick={onClick}
            disabled={disabled}
            data-paused={paused ? "true" : undefined}
            data-reverse={reverse ? "true" : undefined}
            style={cssVars}
        >
            {children}
        </button>
    )
}
