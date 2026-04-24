import puppeteer from "puppeteer-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "example.html");
const url = pathToFileURL(htmlPath).href;

const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
});

try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle2" });
    // Let fonts load + rAF warm up
    await new Promise((r) => setTimeout(r, 1500));

    const shots = [
        { section: 1, name: "champagne" },
        { section: 2, name: "platinum" },
        { section: 3, name: "blush" },
        { section: 4, name: "midnight" },
        { section: 5, name: "js-api" },
    ];

    for (const { section, name } of shots) {
        await page.evaluate((n) => {
            const el = document.getElementById(`sec-${n}`);
            if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        }, section);
        // Wait for a few animation frames so the canvas captures movement
        await new Promise((r) => setTimeout(r, 600));
        const out = resolve(__dirname, "screenshots", `${name}.png`);
        await page.screenshot({ path: out, type: "png" });
        console.log(`captured ${out}`);
    }
} finally {
    await browser.close();
}
