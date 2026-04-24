import { createWriteStream, mkdirSync, existsSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import archiver from "archiver"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, "..")

const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"))
const version = pkg.version
const releaseName = `silkwave-v${version}`

const distDir = join(rootDir, "dist")
const outputPath = join(distDir, `${releaseName}.zip`)

if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true })
}

const entries = [
    {
        source: join(rootDir, "src/components/SilkWave/SilkWave.tsx"),
        zipPath: `${releaseName}/react/SilkWave.tsx`,
    },
    {
        source: join(rootDir, "src/components/SilkWave/index.ts"),
        zipPath: `${releaseName}/react/index.ts`,
    },
    {
        source: join(rootDir, "silkwave-html/silkwave.js"),
        zipPath: `${releaseName}/html/silkwave.js`,
    },
    {
        source: join(rootDir, "silkwave-html/silkwave.min.js"),
        zipPath: `${releaseName}/html/silkwave.min.js`,
    },
    {
        source: join(rootDir, "silkwave-html/example.html"),
        zipPath: `${releaseName}/html/example.html`,
    },
    {
        source: join(rootDir, "scripts/release-README.md"),
        zipPath: `${releaseName}/README.md`,
    },
    {
        source: join(rootDir, "LICENSE"),
        zipPath: `${releaseName}/LICENSE`,
    },
]

for (const { source } of entries) {
    if (!existsSync(source)) {
        console.error(`Missing source file: ${source}`)
        process.exit(1)
    }
}

const output = createWriteStream(outputPath)
const archive = archiver("zip", { zlib: { level: 9 } })

output.on("close", () => {
    const bytes = archive.pointer()
    const kb = (bytes / 1024).toFixed(2)
    console.log(`Created ${outputPath}`)
    console.log(`Size: ${bytes} bytes (${kb} KB)`)
})

archive.on("warning", (err) => {
    if (err.code === "ENOENT") console.warn(err)
    else throw err
})

archive.on("error", (err) => {
    throw err
})

archive.pipe(output)

for (const { source, zipPath } of entries) {
    archive.file(source, { name: zipPath })
}

archive.finalize()
