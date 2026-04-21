import { useEffect, useRef } from "react"

export default function NoiseGradient({
    speed = 0.003,
    noiseOpacity = 0.02,
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number
        let t = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resize()

        const drawBackground = () => {
            const w = canvas.width
            const h = canvas.height
            const grad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.9)
            grad.addColorStop(0, "#FFFFFF")
            grad.addColorStop(0.4, "#F5F0E8")
            grad.addColorStop(1, "#EDE4D0")
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)
        }

        const drawWaveLines = () => {
            const w = canvas.width
            const h = canvas.height
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

                // 광택 효과 — 중간 선들이 더 밝고 굵음
                const centerDist = Math.abs(progress - 0.3)
                const glowIntensity = Math.max(0, 1 - centerDist * 4)

                if (glowIntensity > 0.5) {
                    // 글로우 라인
                    ctx.lineWidth = 1.5
                    ctx.strokeStyle = `rgba(255, 240, 180, ${glowIntensity * 0.9})`
                    ctx.stroke()
                }

                // 골드 라인
                ctx.lineWidth = 0.5
                const alpha = 0.05 + glowIntensity * 0.3
                ctx.strokeStyle = `rgba(180, 145, 60, ${alpha})`
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

        animate()

        window.addEventListener("resize", resize)
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [speed, noiseOpacity])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
            }}
        />
    )
}