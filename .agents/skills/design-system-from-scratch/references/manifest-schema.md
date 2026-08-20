# Design System Manifest Schema

Use this reference when creating `docs/design-system/manifest.json` for a new design system.

The manifest is the system contract. It should be concise, valid JSON, and specific enough to guide future implementation.

## Required Shape

```json
{
  "version": 1,
  "updated_at": "YYYY-MM-DD",
  "system_origin": "greenfield",
  "product": {
    "name": "",
    "category": "",
    "audience": "",
    "platforms": [],
    "primary_workflows": []
  },
  "sources": {
    "brief": [],
    "references": [],
    "figma": [],
    "website": [],
    "screenshots": [],
    "brand_docs": []
  },
  "direction": {
    "name": "",
    "mood": "",
    "principles": [],
    "anti_principles": []
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
    "composition_rules": [],
    "imagery_rules": [],
    "iconography_rules": [],
    "data_visualization_rules": [],
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

## Token Guidance

- Use semantic roles, not decorative names.
- Give colors light/dark or state variants only when the product needs them.
- Define type by role: display, heading, body, caption, label, mono.
- Define spacing as a limited scale with layout examples.
- Motion tokens need purpose: feedback, transition, entrance, emphasis.
- Record unresolved choices in `open_questions` instead of hiding them.
