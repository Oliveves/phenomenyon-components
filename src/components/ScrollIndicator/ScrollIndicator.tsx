import { useEffect, type CSSProperties, type MouseEventHandler } from "react"

const STYLE_ID = "phenomenyon-scroll-indicator-style"

const STYLES = `
@keyframes phenomenyon-scroll-indicator-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@keyframes phenomenyon-scroll-indicator-dot {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(22px); }
}
@keyframes phenomenyon-scroll-indicator-chevron {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
}
@keyframes phenomenyon-scroll-indicator-line {
    0%        { transform: translateY(0);    opacity: 0; }
    15%, 85%  { opacity: 1; }
    100%      { transform: translateY(36px); opacity: 0; }
}
.phenomenyon-scroll-indicator {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: var(--phenomenyon-scroll-color, #FFFFFF);
    font-family: 'Barlow Semi Condensed', 'Inconsolata', sans-serif;
    opacity: 0;
    animation: phenomenyon-scroll-indicator-fade
        var(--phenomenyon-scroll-fade-duration, 0.5s) ease-out
        var(--phenomenyon-scroll-fade-delay, 0s) forwards;
}
.phenomenyon-scroll-indicator:disabled { cursor: default; }
.phenomenyon-scroll-indicator:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: 8px;
}
.phenomenyon-scroll-indicator__dot {
    animation: phenomenyon-scroll-indicator-dot
        var(--phenomenyon-scroll-duration, 2s)
        cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
.phenomenyon-scroll-indicator__chevron {
    animation: phenomenyon-scroll-indicator-chevron
        var(--phenomenyon-scroll-duration, 2s) ease-in-out infinite;
}
.phenomenyon-scroll-indicator__line-fill {
    animation: phenomenyon-scroll-indicator-line
        var(--phenomenyon-scroll-duration, 2s) ease-in-out infinite;
}
.phenomenyon-scroll-indicator__label {
    font-size: 10px;
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
    white-space: pre-line;
    opacity: 0.8;
}
@media (prefers-reduced-motion: reduce) {
    .phenomenyon-scroll-indicator { animation: none; opacity: 1; }
    .phenomenyon-scroll-indicator__dot,
    .phenomenyon-scroll-indicator__chevron,
    .phenomenyon-scroll-indicator__line-fill { animation: none; }
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

export type ScrollIndicatorVariant = "mouse" | "chevron" | "line"

function Glyph({ variant }: { variant: ScrollIndicatorVariant }) {
    if (variant === "chevron") {
        return (
            <svg
                width="28"
                height="34"
                viewBox="0 0 28 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <g
                    className="phenomenyon-scroll-indicator__chevron"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 7 L14 16 L24 7" opacity="0.9" />
                    <path d="M4 17 L14 26 L24 17" opacity="0.45" />
                </g>
            </svg>
        )
    }

    if (variant === "line") {
        return (
            <svg
                width="2"
                height="48"
                viewBox="0 0 2 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="48"
                    stroke="currentColor"
                    strokeOpacity={0.2}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    className="phenomenyon-scroll-indicator__line-fill"
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        )
    }

    return (
        <svg
            width="30"
            height="50"
            viewBox="0 0 30 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect
                width="30"
                height="50"
                rx="15"
                fill="currentColor"
                fillOpacity={0.2}
            />
            <rect
                x="0.5"
                y="0.5"
                width="29"
                height="49"
                rx="14.5"
                stroke="currentColor"
                strokeOpacity={0.2}
            />
            <circle
                className="phenomenyon-scroll-indicator__dot"
                cx="15"
                cy="14"
                r="4"
                fill="currentColor"
            />
        </svg>
    )
}

export type ScrollIndicatorProps = {
    /** glyph style: mouse housing, bouncing chevron, or a traveling line segment */
    variant?: ScrollIndicatorVariant
    /** caption under the glyph. Use \\n for multiple lines (white-space: pre-line). Omit to hide. */
    label?: string
    /** accessible name for the button */
    ariaLabel?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    /** base color for glyph + label (glyph uses reduced opacities of it) */
    color?: string
    /** glyph animation duration in seconds */
    duration?: number
    /** fade-in duration in seconds */
    fadeInDuration?: number
    /** fade-in delay in seconds */
    fadeInDelay?: number
    disabled?: boolean
    className?: string
    style?: CSSProperties
}

export default function ScrollIndicator({
    variant = "mouse",
    label = "Scroll",
    ariaLabel = "Scroll to content",
    onClick,
    color = "#FFFFFF",
    duration = 2,
    fadeInDuration = 0.5,
    fadeInDelay = 0,
    disabled = false,
    className,
    style,
}: ScrollIndicatorProps) {
    useEffect(() => {
        ensureStyle()
    }, [])

    const cssVars: CSSProperties & Record<string, string | number> = {
        ["--phenomenyon-scroll-color"]: color,
        ["--phenomenyon-scroll-duration"]: `${duration}s`,
        ["--phenomenyon-scroll-fade-duration"]: `${fadeInDuration}s`,
        ["--phenomenyon-scroll-fade-delay"]: `${fadeInDelay}s`,
        ...style,
    }

    const composedClassName = ["phenomenyon-scroll-indicator", className]
        .filter(Boolean)
        .join(" ")

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className={composedClassName}
            onClick={onClick}
            disabled={disabled}
            style={cssVars}
        >
            <Glyph variant={variant} />
            {label ? (
                <span className="phenomenyon-scroll-indicator__label">{label}</span>
            ) : null}
        </button>
    )
}
