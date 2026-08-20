# Reference Intake

Use this reference when a design system is being created from scratch.

## Minimum Brief

Capture:

- Product name and category
- Target audience and use context
- Primary jobs to be done
- First screens or flows
- Platform targets: web, mobile, desktop, dashboard, marketing site
- Technical stack if known
- Brand traits to express
- Brand traits to avoid
- Accessibility requirements
- Deadline or fidelity level

## Reference Types

Ask the user for 3-7 total references when possible:

- Aspirational references: products or brands that communicate the desired feeling.
- Direct competitors: products solving similar user problems.
- Layout references: examples of information density, navigation, or screen structure.
- Typography references: examples of hierarchy, type personality, and reading rhythm.
- Color/material references: examples of palette, contrast, texture, or surface treatment.
- Interaction references: examples of motion, state transitions, editing flows, or data interactions.
- Anti-references: examples to avoid.

## Evaluation Prompts

For each reference, extract:

- What should be borrowed as a principle?
- What must not be copied?
- Is the useful part layout, typography, color, motion, content tone, or component behavior?
- Is it appropriate for the target audience and workflow frequency?
- Does it imply high-density operational UI or expressive marketing UI?
- What accessibility or implementation risks does it introduce?

## Direction Synthesis Template

```md
## Direction: [Name]

Mood:
Typography:
Color/material:
Layout/density:
Components:
Motion:
Imagery/iconography:
Best for:
Risks:
Avoid:
```

## Common Failure Modes

- Starting with a palette before understanding workflow and audience.
- Treating a moodboard as a spec.
- Copying a reference's surface styling without its layout logic.
- Creating too many accent colors.
- Designing expressive components before primitives.
- Writing tokens as raw values without semantic roles.
- Ignoring empty, loading, error, hover, focus, disabled, and responsive states.
