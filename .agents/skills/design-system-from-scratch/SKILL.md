---
name: design-system-from-scratch
description: Use when Codex needs to create a new design system before a product has stable UI, components, or tokens. Trigger for greenfield products, new brands, app/site concepts, startup MVPs, reference-driven visual direction, moodboards, screenshots, competitor sites, Figma references, brand exploration, or requests to define colors, typography, components, layout, and visual rules from scratch.
---

# Design System From Scratch

## Purpose

Create a design system when there is no reliable existing UI to extract from. The process starts with product intent and references, not implementation. The output is a usable system: tokens, component foundations, layout rules, accessibility rules, visual principles, and a manifest that future UI work can follow.

This pipeline differs from `$design-system-research`: do not pretend to extract a mature system from an empty repo. First build design direction from brief and references, then author the system deliberately.

## Core Rule

Do not generate polished UI immediately. First clarify the product, gather or request references, synthesize visual direction, define tokens/components, and write `docs/design-system/manifest.json`.

If the repo already has a real product UI, component library, or design tokens that should constrain the work, use `$design-system-research` first.

## Workflow

1. Intake the product.
   - Capture product name, category, audience, primary workflows, business goal, platform targets, technical stack, brand constraints, accessibility expectations, and required deliverables.
   - Ask for references only when missing information would materially change the design direction. Prefer 3-7 strong references over a large unfocused dump.
   - When the user provides sparse input, proceed with stated assumptions and record open questions.

2. Build a reference board.
   - Read `references/reference-intake.md` for reference categories and evaluation prompts.
   - Use provided Figma links, screenshots, public sites, brand books, product docs, competitor URLs, and moodboard images.
   - Separate references by role: aspirational mood, direct competitor, layout, typography, color/material, interaction/motion, imagery, and anti-reference.
   - Save the source list and observations in `docs/design-system/reference-board.md`.

3. Synthesize direction.
   - Define 1-3 design territories when the brief is exploratory. Each territory should include mood, typography direction, color/material approach, layout density, motion attitude, and risks.
   - If the user has already chosen a direction, skip territories and document the chosen direction.
   - Avoid generic style words unless they are converted into concrete rules. "Premium" is not a rule; "low-chroma surfaces, restrained accent color, dense editorial type scale, no glass cards" is a rule.

4. Author tokens.
   - Create semantic colors, typography roles, spacing scale, radius scale, elevation/shadow policy, breakpoints, grid rules, and motion tokens.
   - Define why each major token exists and where it should be used.
   - Keep values implementation-ready for the project's stack when known: CSS variables, Tailwind theme, design tokens JSON, or component props.

5. Define component foundations.
   - Start with primitives: Button, Link, Input, Select, Checkbox, Toggle, Tabs, Tooltip, Modal/Dialog, Toast, Card/Panel, Table/List, Nav, Badge, Avatar, Empty State, Loading, Error.
   - For each component, define variants, states, anatomy, spacing, typography, accessibility, and usage limits.
   - Design for reuse before adding expressive one-off sections.

6. Define layout and visual principles.
   - Specify page shells, grid, max widths, responsive behavior, section rhythm, density, hierarchy, content rules, iconography, imagery, data visualization, and motion.
   - Include anti-patterns so future UI work has guardrails.

7. Write artifacts.
   - Read `references/manifest-schema.md` before writing `manifest.json`.
   - Create or update:
     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/reference-board.md`
     - `docs/design-system/component-map.md`
   - Optional when useful:
     - `docs/design-system/tokens.css`
     - `docs/design-system/tailwind.tokens.js`
     - `docs/design-system/visual-principles.md`

8. Protect the project instructions.
   - After the design-system artifacts are written, search the repository root for an existing agent instruction file in this order: `AGENTS.md`, `agents.md`, `AGENT.md`, `agent.md`.
   - If one exists, update it. If none exists, create `AGENTS.md` at the repository root.
   - Add a short "Design System Guard" section explaining that the project's visual layer is protected by the design system: the design system is the source of truth for visual decisions, and UI work must follow it before introducing new styles, tokens, or components.
   - List the design-system files that own the contract. Include required files and any optional files that were actually created, for example:
     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/reference-board.md`
     - `docs/design-system/component-map.md`
     - `docs/design-system/tokens.css`
     - `docs/design-system/tailwind.tokens.js`
     - `docs/design-system/visual-principles.md`
   - Keep this instruction block concise. Do not duplicate the full design-system documentation inside the agent instruction file.
   - Use this shape, adapted to the project's language and actual file list:
     ```md
     ## Design System Guard

     The visual layer of this project is protected by the design system. The design system is the source of truth for UI decisions: colors, typography, spacing, components, layout, motion, and visual QA. Before changing UI, read and follow these files:

     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/reference-board.md`
     - `docs/design-system/component-map.md`

     Do not introduce new visual tokens, component variants, or layout patterns unless they are added to the design-system contract first.
     ```

9. Prototype only after the system exists.
   - If the user requested screens in the same run, implement a small representative slice first: one page shell plus core components and states.
   - Run visual QA across mobile, tablet, and desktop.
   - Summarize design-system deviations and whether they should become new rules or be removed.

## Reference Expectations

Good reference input includes:

- 2-3 products the user wants to feel adjacent to.
- 1-2 anti-references showing what to avoid.
- Audience and product category.
- Desired brand traits with concrete examples.
- Screens or flows the system must support first.

Do not copy references literally. Extract principles: hierarchy, density, rhythm, material, interaction, contrast, and tone.

## Output Standard

The design system is ready when another Codex run can build UI from the artifacts without re-asking basic visual questions. The final response should include created files, the updated or created project agent instruction file, chosen direction, open questions, verification performed, and the recommended next UI slice.
