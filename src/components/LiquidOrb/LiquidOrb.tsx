import { useEffect, useRef, type CSSProperties } from "react"
import { LIQUID_ORB_PALETTES, type LiquidOrbPalette } from "./palettes"

export type { LiquidOrbPalette }

export type LiquidOrbShape = "orb" | "blob" | "droplet"

// [frequency, amplitude, phase multiplier]
type Harmonic = [number, number, number]
const SHAPES: Record<
    LiquidOrbShape,
    { harmonics: Harmonic[]; yStretch: number; topPinch: number }
> = {
    orb: {
        harmonics: [
            [2, 0.028, 1],
            [3, 0.02, -1.3],
            [5, 0.012, 0.7],
        ],
        yStretch: 1,
        topPinch: 0,
    },
    blob: {
        harmonics: [
            [2, 0.07, 0.8],
            [3, 0.045, -1.1],
            [5, 0.022, 0.6],
        ],
        yStretch: 1,
        topPinch: 0,
    },
    droplet: {
        harmonics: [
            [2, 0.02, 1],
            [3, 0.014, -1.2],
        ],
        yStretch: 1.22,
        topPinch: 0.24,
    },
}

export type LiquidOrbProps = {
    /** diameter in px when `fill` is false */
    size?: number
    /** fill the parent element instead of using `size` (parent needs a size + position) */
    fill?: boolean
    /** named color preset */
    palette?: LiquidOrbPalette
    /** custom gradient colors (warm -> cool reads best); overrides `palette` */
    colors?: string[]
    /** silhouette: round orb, strong blob, or elongated droplet */
    shape?: LiquidOrbShape
    /** idle wobble speed */
    speed?: number
    /** how strongly the surface leans / bulges toward the cursor (0 disables) */
    reactivity?: number
    /** backdrop painted behind the orb */
    background?: string
    /** film-grain opacity over the orb (0 disables) */
    grain?: number
    className?: string
    style?: CSSProperties
}

export default function LiquidOrb({
    size = 420,
    fill = false,
    palette = "sunset",
    colors,
    shape = "orb",
    speed = 0.02,
    reactivity = 1,
    background = "#0A0A0A",
    grain = 0.04,
    className,
    style,
}: LiquidOrbProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId = 0
        let width = 0
        let height = 0
        let t = 0

        let targetX = 0
        let targetY = 0
        let curX = 0
        let curY = 0

        const cfg = SHAPES[shape]
        const swatches =
            colors && colors.length >= 2 ? colors : LIQUID_ORB_PALETTES[palette]

        // one-time grain tile
        const noiseCanvas = document.createElement("canvas")
        noiseCanvas.width = 256
        noiseCanvas.height = 256
        const nCtx = noiseCanvas.getContext("2d")!
        const imageData = nCtx.createImageData(256, 256)
        for (let i = 0; i < imageData.data.length; i += 4) {
            const v = Math.random() * 255
            imageData.data[i] = v
            imageData.data[i + 1] = v
            imageData.data[i + 2] = v
            imageData.data[i + 3] = 255
        }
        nCtx.putImageData(imageData, 0, 0)
        const grainPattern = ctx.createPattern(noiseCanvas, "repeat")

        const radius = () =>
            fill ? Math.min(width, height) * 0.27 : size * 0.34

        const shortestAngle = (a: number) =>
            Math.atan2(Math.sin(a), Math.cos(a))

        const render = () => {
            const w = width
            const h = height
            const cx0 = w / 2
            const cy0 = h / 2
            const R = radius()

            ctx.clearRect(0, 0, w, h)
            ctx.fillStyle = background
            ctx.fillRect(0, 0, w, h)

            const ease = 0.08 * (0.4 + reactivity)
            curX += (targetX - curX) * ease
            curY += (targetY - curY) * ease

            const cx = cx0 + curX * 0.06 * reactivity
            const cy = cy0 + curY * 0.06 * reactivity

            const mouseAngle = Math.atan2(curY, curX)
            const influence =
                Math.min(Math.hypot(curX, curY) / (R * 1.1), 1) * reactivity

            const points = 140
            const top = -Math.PI / 2
            const path = new Path2D()
            for (let i = 0; i <= points; i++) {
                const a = (i / points) * Math.PI * 2
                let wob = 0
                for (const [freq, amp, ph] of cfg.harmonics) {
                    wob += Math.sin(a * freq + t * ph) * amp
                }
                const dTop = shortestAngle(a - top)
                const pinch =
                    1 - cfg.topPinch * Math.exp(-(dTop * dTop) / (2 * 0.6 * 0.6))
                const d = shortestAngle(a - mouseAngle)
                const bulge =
                    Math.exp(-(d * d) / (2 * 0.8 * 0.8)) * influence * R * 0.16
                const r = (R * (1 + wob) + bulge) * pinch
                const x = cx + r * Math.cos(a)
                const y = cy + r * Math.sin(a) * cfg.yStretch
                if (i === 0) path.moveTo(x, y)
                else path.lineTo(x, y)
            }
            path.closePath()

            const fx = cx + curX * 0.28
            const fy = cy + curY * 0.28 - R * 0.18

            const grad = ctx.createRadialGradient(fx, fy, 0, cx, cy, R * 1.18)
            const last = swatches.length - 1
            swatches.forEach((c, i) => grad.addColorStop(i / last, c))

            ctx.save()
            ctx.shadowColor = swatches[0]
            ctx.shadowBlur = R * 0.3
            ctx.fillStyle = grad
            ctx.fill(path)
            ctx.restore()

            ctx.save()
            ctx.clip(path)
            const sheen = ctx.createRadialGradient(
                fx,
                fy - R * 0.1,
                0,
                fx,
                fy - R * 0.1,
                R * 0.7,
            )
            sheen.addColorStop(0, "rgba(255, 255, 255, 0.35)")
            sheen.addColorStop(1, "rgba(255, 255, 255, 0)")
            ctx.fillStyle = sheen
            ctx.fillRect(0, 0, w, h)

            if (grain > 0 && grainPattern) {
                ctx.globalAlpha = grain
                ctx.fillStyle = grainPattern
                ctx.fillRect(0, 0, w, h)
                ctx.globalAlpha = 1
            }
            ctx.restore()
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            width = fill ? canvas.offsetWidth : size
            height = fill ? canvas.offsetHeight : size
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)
            if (prefersReducedMotion) render()
        }

        const onPointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            const R = radius()
            const clamp = R * 1.6
            targetX = Math.max(-clamp, Math.min(clamp, x))
            targetY = Math.max(-clamp, Math.min(clamp, y))
        }
        const onPointerLeave = () => {
            targetX = 0
            targetY = 0
        }

        resize()
        window.addEventListener("resize", resize)

        if (prefersReducedMotion) {
            return () => window.removeEventListener("resize", resize)
        }

        window.addEventListener("pointermove", onPointerMove)
        window.addEventListener("pointerout", onPointerLeave)

        const animate = () => {
            t += speed
            render()
            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerout", onPointerLeave)
        }
    }, [size, fill, palette, colors, shape, speed, reactivity, background, grain])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={
                fill
                    ? {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          ...style,
                      }
                    : { display: "block", ...style }
            }
        />
    )
}
