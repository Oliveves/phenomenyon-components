import { useEffect, useRef } from "react"

const themes = {
    champagne: {
        bg1: "#FFFFFF",
        bg2: "#F5F0E8",
        bg3: "#EDE4D0",
        lineColor: "180, 145, 60",
        glowColor: "255, 240, 180",
    },
    platinum: {
        bg1: "#FFFFFF",
        bg2: "#F2F4F6",
        bg3: "#E2E8ED",
        lineColor: "150, 170, 185",
        glowColor: "220, 235, 245",
    },
    blush: {
        bg1: "#FFFFFF",
        bg2: "#F9F0F0",
        bg3: "#EED8D8",
        lineColor: "190, 130, 130",
        glowColor: "255, 210, 200",
    },
    midnight: {
        bg1: "#0A0F1E",
        bg2: "#0D1528",
        bg3: "#111D35",
        lineColor: "80, 130, 200",
        glowColor: "100, 160, 255",
    },
}

export type ThemeKey = keyof typeof themes

export default function SilkWave({
    speed = 0.008,
    noiseOpacity = 0.02,
    theme = "champagne" as ThemeKey,
    fill = false,
}: {
    speed?: number
    noiseOpacity?: number
    theme?: ThemeKey
    fill?: boolean
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const noisePatternRef = useRef<CanvasPattern | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number
        let t = 0
        let width = 0
        let height = 0

        const t_ = themes[theme]

        const noiseCanvas = document.createElement("canvas")
        noiseCanvas.width = 256
        noiseCanvas.height = 256
        const nCtx = noiseCanvas.getContext("2d")!
        const imageData = nCtx.createImageData(256, 256)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255
            data[i] = noise
            data[i + 1] = noise
            data[i + 2] = noise
            data[i + 3] = 255
        }
        nCtx.putImageData(imageData, 0, 0)
        noisePatternRef.current = ctx.createPattern(noiseCanvas, "repeat")

        const drawBackground = () => {
            const w = width
            const h = height
            const grad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.9)
            grad.addColorStop(0, t_.bg1)
            grad.addColorStop(0.4, t_.bg2)
            grad.addColorStop(1, t_.bg3)
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)
        }

        const drawWaveLines = () => {
            const w = width
            const h = height
            const lineCount = 60

            for (let i = 0; i < lineCount; i++) {
                const progress = i / lineCount
                const yBase = h * (0.4 + progress * 0.5)

                ctx.beginPath()

                for (let x = 0; x <= w; x += 2) {
                    const wave1 = Math.sin(x * 0.003 + t + progress * 2) * h * 0.18
                    const wave2 = Math.sin(x * 0.006 - t * 1.3 + progress) * h * 0.08
                    const y = yBase + wave1 + wave2
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
                }

                const centerDist = Math.abs(progress - 0.3)
                const glowIntensity = Math.max(0, 1 - centerDist * 4)

                if (glowIntensity > 0.5) {
                    ctx.lineWidth = 1.5
                    ctx.strokeStyle = `rgba(${t_.glowColor}, ${glowIntensity * 0.9})`
                    ctx.stroke()
                }

                ctx.lineWidth = 0.5
                const alpha = 0.05 + glowIntensity * 0.3
                ctx.strokeStyle = `rgba(${t_.lineColor}, ${alpha})`
                ctx.stroke()
            }
        }

        const drawNoise = () => {
            if (!noisePatternRef.current) return
            ctx.globalAlpha = noiseOpacity
            ctx.fillStyle = noisePatternRef.current
            ctx.fillRect(0, 0, width, height)
            ctx.globalAlpha = 1
        }

        const render = () => {
            drawBackground()
            drawWaveLines()
            drawNoise()
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            width = fill ? canvas.offsetWidth : window.innerWidth
            height = fill ? canvas.offsetHeight : window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)

            if (prefersReducedMotion) render()
        }

        resize()

        if (prefersReducedMotion) {
            window.addEventListener("resize", resize)
            return () => window.removeEventListener("resize", resize)
        }

        const animate = () => {
            t += speed
            render()
            animationId = requestAnimationFrame(animate)
        }

        animate()

        window.addEventListener("resize", resize)
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [speed, noiseOpacity, theme, fill])

    return (
        <canvas
            ref={canvasRef}
            style={
                fill
                    ? {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                      }
                    : {
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          maxWidth: "100vw",
                      }
            }
        />
    )
}
