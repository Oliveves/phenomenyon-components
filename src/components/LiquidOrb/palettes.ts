export type LiquidOrbPalette =
    | "sunset"
    | "aurora"
    | "magma"
    | "ocean"
    | "iris"

export const LIQUID_ORB_PALETTES: Record<LiquidOrbPalette, string[]> = {
    sunset: ["#FF6A3D", "#FFB27A", "#79C7C9", "#6F8FD0"],
    aurora: ["#3DFFB0", "#5ED6C0", "#6F8FD0", "#9F7FE0"],
    magma: ["#FFD23D", "#FF8A3D", "#FF3D5A", "#7A2D3D"],
    ocean: ["#3DCFFF", "#5E9FD6", "#6F8FD0", "#324E8F"],
    iris: ["#FF9EE0", "#C8A8FF", "#9F7FE0", "#6F8FD0"],
}
