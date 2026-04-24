# SilkWave — vanilla HTML / JS

Silk-textured animated background with grain. **Zero dependencies.** Drop into Webflow, WordPress, Shopify, or any custom site.

> Vanilla port of the `@phenomenyon/components` React `SilkWave`. Visual output and theme palettes are byte-identical to the React original.

---

## Install

Copy `silkwave.min.js` into your project (or upload to your CMS asset manager) and reference it before the closing `</body>` tag:

```html
<script src="/path/to/silkwave.min.js"></script>
```

CDN, npm, and ES module builds are not provided — this package is a single self-contained file by design.

### Webflow

1. Project Settings → Custom Code → upload `silkwave.min.js` to a CDN of your choice (or paste the file contents into a `<script>` tag in *Footer Code*).
2. In the Designer, add a `Div Block`, give it the custom attribute `data-silkwave` = `champagne` (or another theme).
3. Make sure the parent section has `position: relative` and a fixed height.

### WordPress

1. Upload `silkwave.min.js` via Media Library or theme `assets/` folder.
2. Enqueue in `functions.php` or paste the file into a *Custom HTML* block.
3. Add `<div data-silkwave="midnight" style="position:absolute;inset:0;"></div>` inside the hero section.

### Shopify

1. Upload `silkwave.min.js` to the theme's `assets/` folder.
2. Reference it from `theme.liquid`: `<script src="{{ 'silkwave.min.js' | asset_url }}" defer></script>`.
3. Add the trigger `<div data-silkwave="champagne"></div>` inside any section template.

---

## Usage

### Option A — HTML data attribute (auto-init)

Any `[data-silkwave]` element on the page is initialized automatically on `DOMContentLoaded`:

```html
<div class="hero" style="position: relative; height: 100vh;">
    <div data-silkwave="champagne"
         data-speed="0.008"
         data-noise-opacity="0.02"></div>
    <h1 style="position: relative;">Silk that breathes.</h1>
</div>
```

### Option B — JS API

```html
<div id="hero"></div>
<script src="silkwave.min.js"></script>
<script>
    const sw = new SilkWave('#hero', {
        theme: 'midnight',
        speed: 0.008,
        noiseOpacity: 0.02,
        fill: true,
    });

    // Switch theme without recreating
    sw.setTheme('blush');

    // Tear down (cancels rAF, removes resize listener, removes canvas)
    sw.destroy();
</script>
```

You can also access the auto-initialized instance from the host element:

```js
const inst = document.querySelector('[data-silkwave]').__silkwave;
inst.setTheme('platinum');
```

---

## Props / Options

| Option         | Type     | Default       | Data attribute        | Description |
|----------------|----------|---------------|-----------------------|-------------|
| `theme`        | string   | `'champagne'` | `data-silkwave`       | One of `champagne`, `platinum`, `blush`, `midnight`. |
| `speed`        | number   | `0.008`       | `data-speed`          | Time increment per frame. Higher = faster waves. |
| `noiseOpacity` | number   | `0.02`        | `data-noise-opacity`  | Grain overlay strength, `0`–`1`. |
| `fill`         | boolean  | `true`        | `data-fill="false"`   | `true`: canvas absolute-fills the host element. `false`: canvas is fixed to the viewport (covers the entire window). |

> **Note:** the React version defaults `fill` to `false`. The vanilla version defaults to `true` because the `<div class="hero"><div data-silkwave></div></div>` pattern is overwhelmingly more common in HTML/CMS contexts.

### Methods

| Method                | Description |
|-----------------------|-------------|
| `setTheme(name)`      | Switch theme at runtime without re-instantiating. |
| `destroy()`           | Cancel animation, remove resize listener, detach canvas. |

### Static

| Property              | Description |
|-----------------------|-------------|
| `SilkWave.themes`     | The theme palette object (read-only reference). |
| `SilkWave.autoInit()` | Manually re-scan the DOM for `[data-silkwave]` elements (useful after dynamic content insertion). |

---

## Themes

| Theme       | Mood                    |
|-------------|-------------------------|
| `champagne` | Warm gold, editorial    |
| `platinum`  | Cool silver, minimal    |
| `blush`     | Soft pink, romantic     |
| `midnight`  | Deep blue, dramatic     |

---

## Behavior

- **`devicePixelRatio` aware** — renders crisp on retina / high-DPI displays.
- **`prefers-reduced-motion`** — when the OS accessibility preference is set, the canvas renders one static frame and skips the animation loop.
- **Resize-responsive** — re-renders on window resize.
- **Pointer-events disabled on the canvas** — your buttons and links stay clickable.

---

## Browser support

Latest two versions of Chrome, Firefox, Safari, and Edge. Requires Canvas 2D API (universally available since ~2012).

---

## Files

| File              | Purpose                              | Size (approx) |
|-------------------|--------------------------------------|---------------|
| `silkwave.js`     | Annotated source with JSDoc          | ~13 KB        |
| `silkwave.min.js` | Production minified build            | ~5.5 KB       |
| `example.html`    | Live demo with both API styles       | —             |

To rebuild the minified file from the project root:

```bash
npm run build:silkwave-html
```

---

## License

MIT — see [LICENSE](../LICENSE) at the repo root.
