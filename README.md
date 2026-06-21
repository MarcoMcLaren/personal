# Marco McLaren — Personal Website 🌌

A galaxy-themed personal portfolio built with **React**, **Three.js**, and **Vite**.
Features an interactive 3D spiral galaxy, floating planets, a cursor "shooting star"
comet trail, glassmorphism content cards, and full mobile responsiveness.

## ✨ Highlights

- **3D cosmos** — a procedurally generated spiral galaxy (60k particles), drifting
  planets, starfield, and bloom post-processing, via `@react-three/fiber` + `drei`.
- **Cursor comet** — a custom canvas overlay draws a glowing shooting-star trail that
  chases the pointer (desktop only; respects reduced-motion).
- **Glass UI** — every text block sits in a frosted glass panel for readability over
  the animated background.
- **Performance-aware** — particle counts, device-pixel-ratio, bloom, and the render
  loop all scale down on mobile and for users who prefer reduced motion.
- **Accessible** — semantic landmarks, skip link, keyboard focus rings, and
  `prefers-reduced-motion` handling throughout.

## 🧱 Architecture — Atomic Design

```
src/
├── components/
│   ├── atoms/        Button, Tag, Icon, GlassPanel, Reveal
│   ├── molecules/    SectionHeading, SocialLinks, StatCard,
│   │                 ExperienceCard, AwardCard, SkillCluster
│   ├── organisms/    Navbar, Hero, About, Experience, Skills,
│   │                 Awards, Contact, Footer
│   ├── templates/    PageLayout
│   └── pages/        HomePage
├── three/            Scene, Galaxy, FloatingPlanet, useStarTexture
├── effects/          CursorTrail
├── hooks/            useMediaQuery, useScrollReveal
├── data/             profile.ts  (single source of CV content)
└── styles/           tokens.css, global.css
```

Content lives in [`src/data/profile.ts`](src/data/profile.ts) — update it there and the
whole site updates.

## 🚀 Getting started

```bash
pnpm install
pnpm dev        # start the dev server (http://localhost:5173)
pnpm build      # type-check + production build to /dist
pnpm preview    # preview the production build
```

## 🛠️ Tech stack

React 18 · TypeScript · Vite · Three.js · @react-three/fiber · @react-three/drei ·
@react-three/postprocessing · framer-motion · CSS Modules
