import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const themes = {
    gold:   { bg1: "#FFFFFF", bg2: "#F5F0E8", bg3: "#EDE4D0", lineColor: "180, 145, 60",  glowColor: "255, 240, 180" },
    silver: { bg1: "#FFFFFF", bg2: "#F2F4F6", bg3: "#E2E8ED", lineColor: "150, 170, 185", glowColor: "220, 235, 245" },
    rose:   { bg1: "#FFFFFF", bg2: "#F9F0F0", bg3: "#EED8D8", lineColor: "190, 130, 130", glowColor: "255, 210, 200" },
    navy:   { bg1: "#0A0F1E", bg2: "#0D1528", bg3: "#111D35", lineColor: "80, 130, 200",  glowColor: "100, 160, 255" },
}

export type ThemeKey = keyof typeof themes

export default function SilkWave({
    speed = 0.008,
    noiseOpacity = 0.02,
    theme = "gold" as ThemeKey,
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number
        let t = 0
        const t_ = themes[theme]

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        const drawBackground = () => {
            const w = canvas.width
            const h = canvas.height
            const grad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.9)
            grad.addColorStop(0, t_.bg1)
            grad.addColorStop(0.4, t_.bg2)
            grad.addColorStop(1, t_.bg3)
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)
        }

        const drawWaveLines = () => {
            const w = canvas.width
            const h = canvas.height

            for (let i = 0; i < 60; i++) {
                const progress = i / 60
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
                ctx.strokeStyle = `rgba(${t_.lineColor}, ${0.05 + glowIntensity * 0.3})`
                ctx.stroke()
            }
        }

        const drawNoise = () => {
            const w = canvas.width
            const h = canvas.height
            const noiseCanvas = document.createElement("canvas")
            noiseCanvas.width = w
            noiseCanvas.height = h
            const nCtx = noiseCanvas.getContext("2d")!
            const imageData = nCtx.createImageData(w, h)
            const data = imageData.data
            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255
                data[i] = noise
                data[i + 1] = noise
                data[i + 2] = noise
                data[i + 3] = 255
            }
            nCtx.putImageData(imageData, 0, 0)
            ctx.globalAlpha = noiseOpacity
            ctx.drawImage(noiseCanvas, 0, 0)
            ctx.globalAlpha = 1
        }

        const animate = () => {
            t += speed
            drawBackground()
            drawWaveLines()
            drawNoise()
            animationId = requestAnimationFrame(animate)
        }

        resize()
        animate()

        window.addEventListener("resize", resize)
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [speed, noiseOpacity, theme])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
        />
    )
}

addPropertyControls(SilkWave, {
    theme: {
        type: ControlType.Enum,
        title: "Theme",
        options: ["gold", "silver", "rose", "navy"],
        optionTitles: ["Gold", "Silver", "Rose", "Navy"],
        defaultValue: "gold",
    },
    speed: {
        type: ControlType.Number,
        title: "Speed",
        defaultValue: 0.008,
        min: 0.001,
        max: 0.05,
        step: 0.001,
    },
    noiseOpacity: {
        type: ControlType.Number,
        title: "Grain",
        defaultValue: 0.02,
        min: 0,
        max: 0.1,
        step: 0.005,
    },
})
