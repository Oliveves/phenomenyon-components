export type ComponentStatus = "live" | "soon"

export type ComponentItem = {
  slug: string
  name: string
  desc: string
  status: ComponentStatus
}

export type Category = {
  slug: string
  name: string
  components: ComponentItem[]
}

const soon = (slug: string, n: number): ComponentItem => ({
  slug: `${slug}-soon-${n}`,
  name: "Coming Soon",
  desc: "",
  status: "soon",
})

export const categories: Category[] = [
  {
    slug: "backgrounds",
    name: "Backgrounds",
    components: [
      {
        slug: "silk-wave",
        name: "SilkWave",
        desc: "Animated gradient background with grain texture.",
        status: "live",
      },
      soon("backgrounds", 1),
      soon("backgrounds", 2),
    ],
  },
  {
    slug: "interactions",
    name: "Interactions",
    components: [soon("interactions", 1), soon("interactions", 2), soon("interactions", 3)],
  },
  {
    slug: "typography",
    name: "Typography",
    components: [soon("typography", 1), soon("typography", 2), soon("typography", 3)],
  },
  {
    slug: "buttons",
    name: "Buttons",
    components: [soon("buttons", 1), soon("buttons", 2), soon("buttons", 3)],
  },
]

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug)
