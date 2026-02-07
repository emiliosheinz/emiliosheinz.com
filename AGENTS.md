# Agent Guidelines

## Project Overview

This is a personal portfolio website built with Next.js 16, React 19, and TypeScript. The primary goals are clarity, maintainability, and performance.

## Architecture

**Tech Stack:**
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4 + CVA (class-variance-authority)
- UI Components: shadcn/ui (New York style)
- Content: Contentlayer2 (MDX processing)
- Animations: Motion (Framer Motion)
- 3D Graphics: Three.js + React Three Fiber + Drei
- State: Zustand
- Linting: Biome
- Testing: Jest + React Testing Library

**Folder Structure:**
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Shared UI components
- `src/components/ui/` - shadcn/ui components (managed via CLI)
- `src/features/` - Feature-specific components and logic (command-bar, theme, interactive-rubiks-cube, etc.)
- `src/data/` - MDX content (posts, experiences)
- `src/lib/` - Third-party integrations and utilities
- `src/utils/` - Pure utility functions
- `src/config/` - Configuration constants
- `public/` - Static assets

**3D Features Structure (interactive-rubiks-cube):**
- `components/` - React Three Fiber 3D components (Canvas, meshes, etc.)
- `hooks/` - 3D-specific hooks (rotation, gestures, textures)
- `logic/` - Pure functions for cube state, moves, and transformations
- `utils/` - 3D math utilities and helpers

**Path Aliases:**
- `~/` resolves to `src/`
- `contentlayer/generated` resolves to `.contentlayer/generated`

## Code Conventions

**Components:**
- Use functional components with TypeScript
- Server components by default; add `"use client"` only when needed
- Co-locate tests in `__tests__` directories
- Export components as named exports

**Styling:**
- Tailwind utility classes for styling
- Use CVA for component variants
- Use `cn()` utility (tailwind-merge + clsx) for conditional classes
- Follow Tailwind v4 syntax

**Naming:**
- Files: kebab-case (e.g., `experience-card.tsx`)
- Components: PascalCase (e.g., `ExperienceCard`)
- Functions/variables: camelCase
- Constants: SCREAMING_SNAKE_CASE

**Formatting:**
- 2-space indentation
- 80 character line width
- Double quotes for strings
- Run `pnpm lint:fix` before committing

**Content:**
- Blog posts go in `src/data/posts/` as MDX files
- Experiences go in `src/data/experiences/` as MDX files
- Each post requires: `title`, `publishedAt`, `description`
- Each experience requires: `title`, `company`, `employmentType`, `startDate`, `skills`

## Agent Guidelines

**Safe Changes:**
- Adding new components in `src/components/` or `src/features/`
- Creating new blog posts or experiences in `src/data/`
- Adding utility functions in `src/utils/`
- Updating component styles with Tailwind classes
- Writing tests in `__tests__` directories

**Requires Extra Care:**
- Modifying `src/app/` routing structure
- Changing `contentlayer.config.ts` schema
- Updating Next.js or Tailwind configuration
- Modifying existing UI components used across multiple pages
- Changes to theme or global styles

**Never Change Without Explicit Instruction:**
- `package.json` engines or package manager
- Build pipeline configuration
- Environment variable schemas
- Biome configuration
- Git configuration
- Files in `src/components/ui/` (shadcn components - use shadcn CLI instead)

**shadcn/ui Components:**
- Components in `src/components/ui/` are managed by shadcn CLI
- To add new shadcn components: `pnpm dlx shadcn@latest add <component-name>`
- Do not manually create or edit files in `src/components/ui/` unless fixing a bug
- Use shadcn components as building blocks for custom components in `src/components/`

**Before Making Changes:**
1. Check if component is server or client component
2. Verify imports use correct path aliases (`~/`)
3. Ensure TypeScript strict mode compliance
4. Follow existing component patterns in similar files
5. Run `pnpm lint` after changes

**3D Development (Three.js / React Three Fiber):**
- All 3D components must use `"use client"` directive
- Use `@react-three/fiber` for React integration (Canvas, useFrame, useThree)
- Use `@react-three/drei` for helpers (OrbitControls, PerspectiveCamera, etc.)
- Separate 3D logic from presentation:
  - Pure functions in `logic/` (cube state, transformations)
  - React Three Fiber components in `components/`
  - Custom hooks in `hooks/` (rotation, gestures)
- Use refs with proper Three.js types (e.g., `Group`, `Mesh`, `PointLight`)
- Test 3D logic functions separately from rendering components
- Keep performance in mind: minimize re-renders, use `useMemo` for geometries/materials

**Anti-Patterns to Avoid:**
- Default exports (use named exports)
- Inline styles instead of Tailwind
- Client components when server components suffice
- Absolute paths instead of `~/` alias
- Any/unknown types without justification
- Duplicate utility functions
- Manual modifications to `src/components/ui/` files
- Mixing 3D logic with Three.js rendering (keep logic pure)
- Creating new Canvas instances (reuse existing Canvas setup)
