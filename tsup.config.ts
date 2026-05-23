import { defineConfig } from "tsup"
import { readFileSync, writeFileSync } from "node:fs"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
    external: ["react", "react/jsx-runtime"],
    target: "es2020",
    // Rollup strips module-level "use client" directives during bundling, but
    // Next.js App Router consumers need it on the published file. Re-prepend
    // after the build so OrbitButton / SilkWave can be imported without each
    // consumer wrapping them in their own client component.
    async onSuccess() {
        const file = "dist/index.js"
        const content = readFileSync(file, "utf8")
        if (!content.startsWith('"use client"')) {
            writeFileSync(file, '"use client";\n' + content)
        }
    },
})
