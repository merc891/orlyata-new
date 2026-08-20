---
name: design-system-research
description: Use only to discover, audit, extract, normalize, or document a design system from existing product evidence when the system is missing, incomplete, stale, or undocumented. Trigger for requests to create/update design-system artifacts from an existing UI, component library, style files, Figma, website, screenshots, brand materials, or token/component audit. Do not use this skill just to design or implement UI from an already-created design system; in that case, read the existing docs/design-system artifacts directly and follow them.
---

# Design System Research

## Purpose

Build or repair compact, reusable design-system documentation from existing product evidence. A design system is the product contract between design intent and code: tokens, components, layout rules, interaction states, accessibility policy, content patterns, and governance. It is not just a palette or component library.

Use this skill when a product already has code, screens, Figma files, brand material, a public website, or prior UI decisions, but the design-system contract itself is absent, weak, outdated, or needs an audit. The job is to discover the system that exists and make it explicit.

This is not a UI-generation skill. If `docs/design-system/manifest.json`, `docs/design-system/design-system.md`, and `docs/design-system/component-map.md` already exist and the user asks to design a page, build a screen, update CSS, or implement a component, read those artifacts directly and proceed without invoking this skill unless the user asks to audit or revise the system itself.

## Core Rule

Do not use this skill as a general preflight for every UI task. Use it only when design-system discovery or documentation is part of the work.

When this skill is active, do not start visual implementation until the current design system has been inspected and documented. If the user asks for implementation in the same run, complete the research artifacts first, then continue using them as constraints.

If there is no existing product, no existing UI, and the user wants a new visual system from references or a product idea, use `$design-system-from-scratch` instead.

If the design system already exists and the task is to create a screen from it, this skill is not applicable.

## Workflow

1. Inventory sources.
   - Inspect repo structure, frontend framework, routes/pages, component directories, style files, assets, and package dependencies.
   - Search for Tailwind config, theme files, CSS variables, CSS modules, global styles, design-token files, shadcn/Radix/MUI/Chakra usage, icons, fonts, and animation libraries.
   - If a Figma link is present and Figma MCP is available, pull design context, screenshot/context images, components, styles, and variable definitions. If the tool is unavailable, record that as a limitation instead of guessing.
   - If a website URL is present, capture key pages with browser or Playwright, then save screenshots under `docs/design-system/screenshots/`.
   - If screenshots, PPTX, PDFs, brand books, or moodboards are provided, treat them as design evidence and cite them in the manifest sources.

2. Extract tokens.
   - Capture colors, typography, spacing, radius, shadows/elevation, breakpoints, grid, z-index/layers, motion timings/easing, and imagery rules.
   - Prefer semantic roles over raw values: `surface`, `surface-muted`, `text-primary`, `accent`, `border-subtle`, `danger`, `focus-ring`.
   - When a token is missing but repeatedly needed, propose it in `manifest.json` with a note. Do not silently hardcode new raw values.

3. Map components.
   - Identify buttons, links, inputs, selects, checkboxes/toggles, cards, navigation, tabs, tables, dialogs, toasts, empty states, page shells, data visualizations, and marketing sections.
   - Record component paths, variants, supported states, composition rules, accessibility obligations, and local anti-patterns.
   - Reuse existing components before creating new ones. If an existing component is insufficient, explain the extension needed.

4. Derive layout and visual language.
   - Document grid, page width, section rhythm, density, hierarchy, information architecture, responsive behavior, interaction patterns, motion style, icon style, illustration/photo rules, and content tone.
   - Name anti-patterns clearly: arbitrary gradients, nested decorative cards, floating glass panels, pill overload, fake dashboard widgets, unowned accent colors, inconsistent type scale, and layout drift.

5. Write artifacts.
   - Read `references/manifest-schema.md` before writing `manifest.json`.
   - Create or update:
     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/component-map.md`
   - Optional when useful:
     - `docs/design-system/tokens.css`
     - `docs/design-system/visual-principles.md`
     - `docs/design-system/screenshots/`

6. Protect the project instructions.
   - After the design-system artifacts are written, search the repository root for an existing agent instruction file in this order: `AGENTS.md`, `agents.md`, `AGENT.md`, `agent.md`.
   - If one exists, update it. If none exists, create `AGENTS.md` at the repository root.
   - Add a short "Design System Guard" section explaining that the project's visual layer is protected by the design system: the design system is the source of truth for visual decisions, and UI work must follow it before introducing new styles, tokens, or components.
   - List the design-system files that own the contract. Include required files and any optional files that were actually created, for example:
     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/component-map.md`
     - `docs/design-system/tokens.css`
     - `docs/design-system/visual-principles.md`
     - `docs/design-system/screenshots/`
   - Keep this instruction block concise. Do not duplicate the full design-system documentation inside the agent instruction file.
   - Use this shape, adapted to the project's language and actual file list:
     ```md
     ## Design System Guard

     The visual layer of this project is protected by the design system. The design system is the source of truth for UI decisions: colors, typography, spacing, components, layout, motion, and visual QA. Before changing UI, read and follow these files:

     - `docs/design-system/manifest.json`
     - `docs/design-system/design-system.md`
     - `docs/design-system/component-map.md`

     Do not introduce new visual tokens, component variants, or layout patterns unless they are added to the design-system contract first.
     ```

7. Continue or stop.
   - If the user asked only for research, stop after the artifacts and summarize findings, open questions, and next recommended implementation step.
   - If the user asked for UI implementation too, proceed only after the artifacts exist. Treat the manifest as the source of truth.

## Artifact Guidance

`manifest.json` is the machine-readable contract. Keep it compact, structured, and specific enough that another Codex run can implement from it.

`design-system.md` is the human-readable explanation. Explain what the system is, how to apply it, and where the strongest design decisions come from.

`component-map.md` is the engineering handoff. Link component names to file paths, variants, usage rules, states, and gaps.

The project agent instruction file (`AGENTS.md`, `agents.md`, `AGENT.md`, or `agent.md`) is the persistent guardrail. It should point future agents back to the design-system files and state that the design system is authoritative for visual work.

## Verification

Before finishing a UI task that used this skill:

- Run relevant lint, typecheck, tests, and build commands when available.
- Render affected screens in browser or Playwright across mobile, tablet, and desktop when possible.
- Check token usage, typography hierarchy, spacing rhythm, overflow, responsive states, focus states, contrast, and visual drift from `manifest.json`.
- Confirm the project agent instruction file exists and references the design-system source-of-truth files.
- Report verification commands, screenshots or capture paths, deviations, and remaining risks.
