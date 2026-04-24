/*!
 * SilkWave — vanilla HTML/JS port
 * Silk-textured animated background with grain.
 *
 * Works with Webflow, WordPress, Shopify, and any custom site.
 * Zero dependencies. Canvas 2D only.
 *
 * © 2026 Phenomenyon — MIT License (see LICENSE at repo root)
 */
(function (root, factory) {
    "use strict";
    var lib = factory();
    if (typeof module === "object" && module.exports) {
        module.exports = lib;
    }
    root.SilkWave = lib;
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    /**
     * Theme palettes.
     * lineColor / glowColor are stored as "r, g, b" strings so we can
     * interpolate alpha at draw time via `rgba(${rgb}, ${a})`.
     * @type {Record<string, {bg1:string,bg2:string,bg3:string,lineColor:string,glowColor:string}>}
     */
    var themes = {
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
    };

    /**
     * Build a 256x256 grayscale noise tile and return a CanvasPattern
     * sized to repeat across the target canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {CanvasPattern|null}
     */
    function buildNoisePattern(ctx) {
        var noiseCanvas = document.createElement("canvas");
        noiseCanvas.width = 256;
        noiseCanvas.height = 256;
        var nCtx = noiseCanvas.getContext("2d");
        if (!nCtx) return null;
        var imageData = nCtx.createImageData(256, 256);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var n = Math.random() * 255;
            data[i] = n;
            data[i + 1] = n;
            data[i + 2] = n;
            data[i + 3] = 255;
        }
        nCtx.putImageData(imageData, 0, 0);
        return ctx.createPattern(noiseCanvas, "repeat");
    }

    /**
     * Resolve the target element from a selector or HTMLElement.
     * @param {string|HTMLElement} target
     * @returns {HTMLElement|null}
     */
    function resolveEl(target) {
        if (!target) return null;
        if (typeof target === "string") return document.querySelector(target);
        if (target.nodeType === 1) return target;
        return null;
    }

    /**
     * @typedef {Object} SilkWaveOptions
     * @property {"champagne"|"platinum"|"blush"|"midnight"} [theme="champagne"]
     * @property {number} [speed=0.008] Time increment per frame.
     * @property {number} [noiseOpacity=0.02] 0–1 grain overlay strength.
     * @property {boolean} [fill=true] true: absolute-fill the container.
     *   false: viewport-fixed canvas (covers the whole window).
     */

    /**
     * SilkWave instance.
     * @class
     * @param {string|HTMLElement} target Selector or element. When `fill: true`
     *   the canvas is appended into this element. When `fill: false` the
     *   canvas is fixed to the viewport — the element is still used as the
     *   mounting parent so destroy() can clean up.
     * @param {SilkWaveOptions} [options]
     */
    function SilkWave(target, options) {
        if (!(this instanceof SilkWave)) {
            return new SilkWave(target, options);
        }

        var el = resolveEl(target);
        if (!el) {
            throw new Error("[SilkWave] target not found: " + target);
        }

        var opts = options || {};
        this.el = el;
        this.theme = themes[opts.theme] ? opts.theme : "champagne";
        this.speed = typeof opts.speed === "number" ? opts.speed : 0.008;
        this.noiseOpacity =
            typeof opts.noiseOpacity === "number" ? opts.noiseOpacity : 0.02;
        // Vanilla default differs from React: containers are the dominant
        // pattern in HTML buyers' code (hero sections, etc.).
        this.fill = opts.fill === false ? false : true;

        this._t = 0;
        this._raf = 0;
        this._width = 0;
        this._height = 0;
        this._destroyed = false;

        this._canvas = document.createElement("canvas");
        this._applyCanvasStyle();
        // Always mount inside the user-supplied element so destroy() can
        // remove it cleanly regardless of fill mode.
        if (this.fill) {
            // Ensure the host can position the canvas absolutely.
            var pos = window.getComputedStyle(el).position;
            if (pos === "static") {
                el.style.position = "relative";
            }
        }
        el.appendChild(this._canvas);

        this._ctx = this._canvas.getContext("2d");
        if (!this._ctx) {
            throw new Error("[SilkWave] 2D context unavailable");
        }

        this._noisePattern = buildNoisePattern(this._ctx);

        this._prefersReducedMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        this._onResize = this._resize.bind(this);
        window.addEventListener("resize", this._onResize);

        this._resize();

        if (this._prefersReducedMotion) {
            this._render();
        } else {
            this._animate = this._animate.bind(this);
            this._raf = requestAnimationFrame(this._animate);
        }
    }

    SilkWave.themes = themes;

    SilkWave.prototype._applyCanvasStyle = function () {
        var s = this._canvas.style;
        if (this.fill) {
            s.position = "absolute";
            s.top = "0";
            s.left = "0";
            s.right = "0";
            s.bottom = "0";
            s.width = "100%";
            s.height = "100%";
            s.pointerEvents = "none";
        } else {
            s.position = "fixed";
            s.top = "0";
            s.left = "0";
            s.width = "100vw";
            s.height = "100vh";
            s.maxWidth = "100vw";
            s.pointerEvents = "none";
        }
    };

    SilkWave.prototype._resize = function () {
        if (this._destroyed) return;
        var dpr = window.devicePixelRatio || 1;
        if (this.fill) {
            this._width = this._canvas.offsetWidth || this.el.clientWidth;
            this._height = this._canvas.offsetHeight || this.el.clientHeight;
        } else {
            this._width = window.innerWidth;
            this._height = window.innerHeight;
        }

        this._canvas.width = Math.max(1, Math.floor(this._width * dpr));
        this._canvas.height = Math.max(1, Math.floor(this._height * dpr));
        this._canvas.style.width = this._width + "px";
        this._canvas.style.height = this._height + "px";
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.scale(dpr, dpr);

        if (this._prefersReducedMotion) this._render();
    };

    SilkWave.prototype._drawBackground = function () {
        var ctx = this._ctx;
        var w = this._width;
        var h = this._height;
        var t_ = themes[this.theme];
        var grad = ctx.createRadialGradient(
            w * 0.3,
            h * 0.3,
            0,
            w * 0.5,
            h * 0.5,
            w * 0.9
        );
        grad.addColorStop(0, t_.bg1);
        grad.addColorStop(0.4, t_.bg2);
        grad.addColorStop(1, t_.bg3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    };

    SilkWave.prototype._drawWaveLines = function () {
        var ctx = this._ctx;
        var w = this._width;
        var h = this._height;
        var t = this._t;
        var t_ = themes[this.theme];
        var lineCount = 60;

        for (var i = 0; i < lineCount; i++) {
            var progress = i / lineCount;
            var yBase = h * (0.4 + progress * 0.5);

            ctx.beginPath();

            for (var x = 0; x <= w; x += 2) {
                var wave1 =
                    Math.sin(x * 0.003 + t + progress * 2) * h * 0.18;
                var wave2 =
                    Math.sin(x * 0.006 - t * 1.3 + progress) * h * 0.08;
                var y = yBase + wave1 + wave2;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            var centerDist = Math.abs(progress - 0.3);
            var glowIntensity = Math.max(0, 1 - centerDist * 4);

            if (glowIntensity > 0.5) {
                ctx.lineWidth = 1.5;
                ctx.strokeStyle =
                    "rgba(" + t_.glowColor + ", " + glowIntensity * 0.9 + ")";
                ctx.stroke();
            }

            ctx.lineWidth = 0.5;
            var alpha = 0.05 + glowIntensity * 0.3;
            ctx.strokeStyle = "rgba(" + t_.lineColor + ", " + alpha + ")";
            ctx.stroke();
        }
    };

    SilkWave.prototype._drawNoise = function () {
        if (!this._noisePattern) return;
        var ctx = this._ctx;
        ctx.globalAlpha = this.noiseOpacity;
        ctx.fillStyle = this._noisePattern;
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.globalAlpha = 1;
    };

    SilkWave.prototype._render = function () {
        this._drawBackground();
        this._drawWaveLines();
        this._drawNoise();
    };

    SilkWave.prototype._animate = function () {
        if (this._destroyed) return;
        this._t += this.speed;
        this._render();
        this._raf = requestAnimationFrame(this._animate);
    };

    /**
     * Switch theme at runtime without re-instantiating.
     * @param {"champagne"|"platinum"|"blush"|"midnight"} themeName
     */
    SilkWave.prototype.setTheme = function (themeName) {
        if (!themes[themeName]) return;
        this.theme = themeName;
        if (this._prefersReducedMotion) this._render();
    };

    /**
     * Stop animation, remove listeners, and detach the canvas.
     */
    SilkWave.prototype.destroy = function () {
        if (this._destroyed) return;
        this._destroyed = true;
        if (this._raf) cancelAnimationFrame(this._raf);
        window.removeEventListener("resize", this._onResize);
        if (this._canvas && this._canvas.parentNode) {
            this._canvas.parentNode.removeChild(this._canvas);
        }
        this._canvas = null;
        this._ctx = null;
        this._noisePattern = null;
    };

    /**
     * Parse [data-silkwave] elements and instantiate SilkWave on each.
     * Supported attributes:
     *   data-silkwave         theme name (required, also acts as trigger)
     *   data-speed            number
     *   data-noise-opacity    number
     *   data-fill             "false" → viewport-fixed mode
     * @returns {SilkWave[]} created instances
     */
    SilkWave.autoInit = function (root) {
        var scope = root || document;
        var nodes = scope.querySelectorAll("[data-silkwave]");
        var instances = [];
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.__silkwave) continue;
            var theme = n.getAttribute("data-silkwave") || "champagne";
            var speedAttr = n.getAttribute("data-speed");
            var noiseAttr = n.getAttribute("data-noise-opacity");
            var fillAttr = n.getAttribute("data-fill");
            var opts = { theme: theme };
            if (speedAttr !== null && speedAttr !== "") {
                var s = parseFloat(speedAttr);
                if (!isNaN(s)) opts.speed = s;
            }
            if (noiseAttr !== null && noiseAttr !== "") {
                var no = parseFloat(noiseAttr);
                if (!isNaN(no)) opts.noiseOpacity = no;
            }
            if (fillAttr === "false") opts.fill = false;
            var inst = new SilkWave(n, opts);
            n.__silkwave = inst;
            instances.push(inst);
        }
        return instances;
    };

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function () {
                SilkWave.autoInit();
            });
        } else {
            // Scripts loaded after DOMContentLoaded should still init.
            SilkWave.autoInit();
        }
    }

    return SilkWave;
});
