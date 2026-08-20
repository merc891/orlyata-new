# Design System Manifest Schema

Use this reference when creating or updating `docs/design-system/manifest.json`.

The manifest is the durable source of truth for UI work. It should be compact, valid JSON, and explicit about sources, tokens, components, rules, and unresolved questions.

## Required Shape

```json
{
  "version": 1,
  "updated_at": "YYYY-MM-DD",
  "sources": {
    "repo": [],
    "figma": [],
    "website": [],
    "screenshots": [],
    "brand_docs": []
  },
  "tokens": {
    "colors": {},
    "typography": {},
    "spacing": {},
    "radius": {},
    "shadows": {},
    "breakpoints": {},
    "motion": {}
  },
  "components": {},
  "layout": {
    "grid": "",
    "page_width": "",
    "section_rhythm": "",
    "density": "",
    "responsive_rules": []
  },
  "visual_language": {
    "mood": "",
    "composition_rules": [],
    "imagery_rules": [],
    "iconography_rules": [],
    "motion_rules": [],
    "anti_patterns": []
  },
  "accessibility": {
    "contrast_policy": "",
    "keyboard_policy": "",
    "focus_policy": "",
    "reduced_motion_policy": ""
  },
  "governance": {
    "token_policy": "",
    "component_policy": "",
    "when_to_add_new_tokens": "",
    "when_to_add_new_components": ""
  },
  "open_questions": []
}
```

## Component Entry Pattern

```json
{
  "Button": {
    "path": "src/components/ui/button.tsx",
    "variants": ["primary", "secondary", "ghost"],
    "states": ["default", "hover", "focus", "disabled", "loading"],
    "usage_rules": [
      "Use primary for one dominant action per surface.",
      "Use ghost only inside dense toolbars or navigation."
    ],
    "do_not": [
      "Do not create one-off button colors outside semantic tokens."
    ],
    "gaps": []
  }
}
```

## Token Guidance

- Prefer semantic names over literal color names.
- Preserve raw values when they already exist in code, but attach meaning.
- If a repeated value is found in code without a token, propose a token instead of spreading the raw value.
- Include typography as roles: `display`, `heading`, `body`, `caption`, `mono`, not only font names.
- Motion tokens should include duration, easing, and purpose.

## Source Entry Pattern

Use short objects rather than vague strings:

```json
{
  "type": "repo",
  "path": "src/components/ui/button.tsx",
  "notes": "Primary button variants and focus treatment"
}
```

For Figma or website sources, include URL, frame/page when known, and capture path when available.
