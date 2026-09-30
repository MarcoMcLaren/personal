# Marco McLaren — Personal Website

A space-inspired developer portfolio built with **React**, **Three.js**, and
**Vite**. Three luminous triangle meshes change shape and travel as you scroll through the
portfolio, behind the original frosted glass panels and CV content.

## Highlights

- **Living geometry** — two large meshes and a small companion continuously morph
  between polyhedral surfaces. Every scroll increment advances the transformation;
  surfaces stay assembled instead of exploding at section boundaries.
- **Scroll travel** — each mesh follows a separate smooth path between viewport
  waypoints, with depth changes and independent rotations. Scrolling backwards
  retraces the same routes and reverses the morphs.
- **Faceted surfaces** — custom shaders provide crisp triangle edges, directional
  highlights, a moving light sweep, and restrained cyan/violet bloom.
- **Direct interaction** — hovering pushes nearby triangle faces away and lights
  their edges. Holding attracts faces toward the cursor; releasing sends a ripple
  through them. Spring physics restores the mesh when the cursor leaves. This is
  a spatial force field on individual faces, with a quiet starfield behind it.
- **Glass UI** — the existing copy, section order, and frosted glass panels are
  preserved. The hero panel is slightly narrower to give the sculpture room.
- **Motion controls** — full animation is the only motion mode. Pause/resume the
  background at any point; pausing uses demand rendering.
- **Responsive** — mobile uses 440 triangles and 350 stars, compared with 860
  triangles and 1,100 stars on desktop. Bloom is disabled on mobile; the small
  chapter readout hides on narrow or short viewports to protect content.
- **Resilient** — WebGL failures leave the complete portfolio usable against a
  CSS space background. The cursor trail respects reduced-motion preferences.

## Architecture

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
├── three/            Scene, MeshSculpture, meshGeometry, meshShaders,
│                     Starfield, journey, meshFlight, useStarTexture
├── effects/          CursorTrail
├── hooks/            useMediaQuery, useScrollReveal
├── data/             profile.ts (single source of CV content)
└── styles/           tokens.css, global.css
tests/                Mesh bounds, torus integrity, growth, morph continuity,
                      pointer forces and spring recovery
```

Content lives in `src/data/profile.ts`. Chapter anchors and names are in
`src/three/journey.ts`; sculpture targets are in `src/three/meshGeometry.ts`.
Scroll positions are measured on layout changes, with no layout reads inside the
animation loop. Geometry and texture resources are disposed when unmounted.

## Getting started

Use Node.js 22.6+ (the geometry tests use Node's TypeScript stripping).

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # desktop/mobile geometry integrity checks
pnpm lint       # TypeScript check
pnpm build      # type-check + production build to /dist
pnpm preview    # production preview at /personal/
```

## Tech stack

React 18 · TypeScript · Vite · Three.js · @react-three/fiber ·
@react-three/postprocessing · framer-motion · CSS Modules
