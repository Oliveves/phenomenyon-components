# SilkWave

Silk-textured animated background with grain. Zero-dependency canvas effect with four editorial theme palettes — drop into any React app or vanilla HTML site.

## Themes

| Theme       | Mood                   | Screenshot          |
|-------------|------------------------|---------------------|
| `champagne` | Warm gold, editorial   | ![Champagne](https://raw.githubusercontent.com/Oliveves/phenomenyon-components/main/silkwave-html/screenshots/champagne.png) |
| `platinum`  | Cool silver, minimal   | ![Platinum](https://raw.githubusercontent.com/Oliveves/phenomenyon-components/main/silkwave-html/screenshots/platinum.png)   |
| `blush`     | Soft pink, romantic    | ![Blush](https://raw.githubusercontent.com/Oliveves/phenomenyon-components/main/silkwave-html/screenshots/blush.png)         |
| `midnight`  | Deep blue, dramatic    | ![Midnight](https://raw.githubusercontent.com/Oliveves/phenomenyon-components/main/silkwave-html/screenshots/midnight.png)   |

---

## 1. React

React 19 component. TypeScript types included.

### Install

Copy the `react/` folder into your project (e.g. `src/components/SilkWave/`):

```
react/
├── SilkWave.tsx
└── index.ts
```

### Usage

```tsx
import SilkWave from "./components/SilkWave"

export default function Hero() {
    return (
        <section style={{ position: "relative", height: "100vh" }}>
            <SilkWave theme="champagne" fill />
            <h1 style={{ position: "relative" }}>Silk that breathes.</h1>
        </section>
    )
}
```

### Props

| Prop           | Type                                                  | Default       | Description |
|----------------|-------------------------------------------------------|---------------|-------------|
| `theme`        | `'champagne' \| 'platinum' \| 'blush' \| 'midnight'`  | `'champagne'` | Palette selection. |
| `speed`        | `number`                                              | `0.008`       | Time increment per frame. Higher = faster waves. |
| `noiseOpacity` | `number`                                              | `0.02`        | Grain overlay strength, `0`–`1`. |
| `fill`         | `boolean`                                             | `false`       | `true`: canvas absolute-fills the parent (requires `position: relative` on parent). `false`: canvas is fixed to the viewport. |

The exported `ThemeKey` type is available for typed theme selection:

```tsx
import SilkWave, { type ThemeKey } from "./components/SilkWave"

const theme: ThemeKey = "midnight"
```

---

## 2. Vanilla HTML / JS

Zero-dependency single-file build. Drop into Webflow, WordPress, Shopify, or any custom site.

### Files

| File              | Purpose                              | Size (approx) |
|-------------------|--------------------------------------|---------------|
| `silkwave.js`     | Annotated source with JSDoc          | ~13 KB        |
| `silkwave.min.js` | Production minified build            | ~5.5 KB       |
| `example.html`    | Live demo with both API styles       | —             |

### Option A — HTML data attribute (auto-init)

Any `[data-silkwave]` element on the page is initialized automatically on `DOMContentLoaded`:

```html
<div class="hero" style="position: relative; height: 100vh;">
    <div data-silkwave="champagne"
         data-speed="0.008"
         data-noise-opacity="0.02"></div>
    <h1 style="position: relative;">Silk that breathes.</h1>
</div>

<script src="/path/to/silkwave.min.js"></script>
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

### Options

| Option         | Type     | Default       | Data attribute        | Description |
|----------------|----------|---------------|-----------------------|-------------|
| `theme`        | string   | `'champagne'` | `data-silkwave`       | One of `champagne`, `platinum`, `blush`, `midnight`. |
| `speed`        | number   | `0.008`       | `data-speed`          | Time increment per frame. Higher = faster waves. |
| `noiseOpacity` | number   | `0.02`        | `data-noise-opacity`  | Grain overlay strength, `0`–`1`. |
| `fill`         | boolean  | `true`        | `data-fill="false"`   | `true`: canvas absolute-fills the host element. `false`: canvas is fixed to the viewport. |

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

### CMS installation

**Webflow**

1. Project Settings → Custom Code → upload `silkwave.min.js` to a CDN of your choice (or paste the file contents into a `<script>` tag in *Footer Code*).
2. In the Designer, add a `Div Block`, give it the custom attribute `data-silkwave` = `champagne` (or another theme).
3. Make sure the parent section has `position: relative` and a fixed height.

**WordPress**

1. Upload `silkwave.min.js` via Media Library or theme `assets/` folder.
2. Enqueue in `functions.php` or paste the file into a *Custom HTML* block.
3. Add `<div data-silkwave="midnight" style="position:absolute;inset:0;"></div>` inside the hero section.

**Shopify**

1. Upload `silkwave.min.js` to the theme's `assets/` folder.
2. Reference it from `theme.liquid`: `<script src="{{ 'silkwave.min.js' | asset_url }}" defer></script>`.
3. Add the trigger `<div data-silkwave="champagne"></div>` inside any section template.

---

## 3. CDN (jsDelivr)

Skip hosting the file yourself — load the tagged release directly from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/Oliveves/phenomenyon-components@v0.1.0/silkwave-html/silkwave.min.js"></script>
```

Then use the data-attribute or JS API exactly as above:

```html
<div class="hero" style="position: relative; height: 100vh;">
    <div data-silkwave="champagne"></div>
    <h1 style="position: relative;">Silk that breathes.</h1>
</div>
<script src="https://cdn.jsdelivr.net/gh/Oliveves/phenomenyon-components@v0.1.0/silkwave-html/silkwave.min.js"></script>
```

The `@v0.1.0` tag pins to this specific release — jsDelivr caches immutably. To track `main`, swap the tag for `@main` (not recommended for production).

---

## 4. Browser support & license

**Behavior**
- `devicePixelRatio` aware — renders crisp on retina / high-DPI displays.
- `prefers-reduced-motion` — when the OS accessibility preference is set, the canvas renders one static frame and skips the animation loop.
- Resize-responsive — re-renders on window resize.
- Pointer-events disabled on the canvas — your buttons and links stay clickable.

**Browser support**

Latest two versions of Chrome, Firefox, Safari, and Edge. Requires Canvas 2D API (universally available since ~2012).

**License**

MIT — see [LICENSE](./LICENSE).
