import {
    useEffect,
    type CSSProperties,
    type MouseEventHandler,
    type ReactNode,
} from "react"
import ArrowDownIcon from "./ArrowDownIcon"

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
    font-family: inherit;
    font-weight: 700;
    color: var(--phenomenyon-orbit-text, #ffffff);
    background-color: var(--phenomenyon-orbit-bg, #239b8e);
    transition: filter 0.2s, transform 0.2s;
    isolation: isolate;
}
.phenomenyon-orbit-btn:hover { filter: brightness(1.08); }
.phenomenyon-orbit-btn:active { transform: translateY(1px); }
.phenomenyon-orbit-btn:disabled { cursor: not-allowed; opacity: 0.6; }
.phenomenyon-orbit-btn::before {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--phenomenyon-orbit-thickness, 2px));
    border-radius: inherit;
    padding: var(--phenomenyon-orbit-thickness, 2px);
    background: conic-gradient(
        from var(--phenomenyon-orbit-angle),
        transparent 0deg,
        transparent var(--phenomenyon-orbit-streak-start, 90deg),
        var(--phenomenyon-orbit-accent, #01b5a8) var(--phenomenyon-orbit-streak-peak, 110deg),
        transparent var(--phenomenyon-orbit-streak-end, 130deg),
        transparent 360deg
    );
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
.phenomenyon-orbit-btn:hover::before { animation-play-state: paused; }
.phenomenyon-orbit-btn[data-paused="true"]::before { animation-play-state: paused; }
.phenomenyon-orbit-btn[data-reverse="true"]::before { animation-direction: reverse; }
@keyframes phenomenyon-orbit-spin {
    to { --phenomenyon-orbit-angle: 360deg; }
}
.phenomenyon-orbit-btn__arrow {
    flex-shrink: 0;
    animation: phenomenyon-orbit-arrow-float 1.8s ease-in-out infinite;
}
@keyframes phenomenyon-orbit-arrow-float {
    0%, 100% { transform: translateY(-2px); }
    50%     { transform: translateY(2px); }
}
@media (prefers-reduced-motion: reduce) {
    .phenomenyon-orbit-btn::before,
    .phenomenyon-orbit-btn__arrow { animation: none; }
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

export type OrbitButtonProps = {
    children?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    type?: "button" | "submit" | "reset"
    /** seconds for one full orbit */
    duration?: number
    /** corner radius in px */
    radius?: number
    /** ring thickness (the visible band of the streak) in px */
    thickness?: number
    /** streak (comet) color */
    accentColor?: string
    /** button background */
    background?: string
    /** button text color */
    textColor?: string
    /** width of the bright streak in degrees */
    streakWidth?: number
    /** angle where the streak is brightest (visual phase offset) */
    streakPeak?: number
    paused?: boolean
    reverse?: boolean
    disabled?: boolean
    className?: string
    style?: CSSProperties
    height?: number | string
    paddingInline?: number | string
    fontSize?: number | string
    fontFamily?: string
    /** render the built-in floating down-arrow at the end of children */
    showArrow?: boolean
}

export default function OrbitButton({
    children,
    onClick,
    type = "button",
    duration = 4,
    radius = 18,
    thickness = 2,
    accentColor = "#01B5A8",
    background = "#239B8E",
    textColor = "#FFFFFF",
    streakWidth = 40,
    streakPeak = 110,
    paused = false,
    reverse = false,
    disabled = false,
    className,
    style,
    height = 52,
    paddingInline = 32,
    fontSize = 18,
    fontFamily,
    showArrow = true,
}: OrbitButtonProps) {
    useEffect(() => {
        ensureStyle()
    }, [])

    const halfWidth = streakWidth / 2
    const px = (v: number | string) => (typeof v === "number" ? `${v}px` : v)

    const cssVars: CSSProperties & Record<string, string | number> = {
        ["--phenomenyon-orbit-accent"]: accentColor,
        ["--phenomenyon-orbit-bg"]: background,
        ["--phenomenyon-orbit-text"]: textColor,
        ["--phenomenyon-orbit-thickness"]: `${thickness}px`,
        ["--phenomenyon-orbit-duration"]: `${duration}s`,
        ["--phenomenyon-orbit-streak-start"]: `${streakPeak - halfWidth}deg`,
        ["--phenomenyon-orbit-streak-peak"]: `${streakPeak}deg`,
        ["--phenomenyon-orbit-streak-end"]: `${streakPeak + halfWidth}deg`,
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
            {showArrow && <ArrowDownIcon className="phenomenyon-orbit-btn__arrow" />}
        </button>
    )
}
