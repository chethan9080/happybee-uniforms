# The Design System: Editorial Sophistication & Organic Warmth

## 1. Overview & Creative North Star: "The Sun-Drenched Atelier"
The Creative North Star for this design system is **"The Sun-Drenched Atelier."** We are moving away from the clinical, "tech-first" aesthetic of standard SaaS platforms. Instead, we are building a digital space that feels like a high-end, bespoke physical studio—airy, warm, and intentionally curated. 

This system rejects the "boxed-in" nature of the web. We achieve a premium feel through **Intentional Asymmetry** (displacing elements slightly off-center to create rhythm), **Extreme Whitespace** (using the Spacing Scale to let elements breathe), and **Tonal Depth** (layering shades of cream and honey instead of using harsh lines). The goal is "Soft Minimalism"—it is simple, but it feels expensive.

---

## 2. Colors & Surface Philosophy
The palette is a monochromatic exploration of warmth. By eliminating blues and purples, we create a specialized, authoritative brand voice that feels organic.

### Tonal Tokens
- **Background (`#fff9ea`):** The foundation. Always apply a subtle, low-opacity honeycomb vector pattern here to provide "tactile soul."
- **Primary (`#755b00`) & Primary Container (`#f5c200`):** Use the container token for high-visibility CTAs and the darker primary for sophisticated text accents or high-contrast icons.
- **Surface Tiers:** 
  - `surface_container_lowest` (#ffffff): Use for primary content cards.
  - `surface_container_low` (#faf4dd): Use for secondary background sections to create soft "zones."
  - `surface_container_highest` (#e9e2cc): Use for small decorative elements or deep-nested components.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. Boundaries must be defined by shifting from `surface` to `surface_container_low`. If you feel the need for a line, increase your vertical spacing by two increments (e.g., move from `8` to `12` on the scale) instead.

### The "Glass & Gradient" Rule
To elevate the "Golden Yellow," avoid flat fills for large hero areas. Use a subtle linear gradient from `primary_container` (#f5c200) to `primary_fixed` (#ffe08f) at a 135-degree angle. For floating navigation or modals, use `surface_container_lowest` at 85% opacity with a `20px` backdrop blur.

---

## 3. Typography: The Editorial Voice
We utilize **Plus Jakarta Sans** for its modern, geometric clarity and friendly apertures.

*   **Display & Headlines:** Use `display-lg` and `headline-lg` with `on_background` (#1e1c0e). Headlines should use "Optical Letter Spacing"—reduce tracking by -2% for a tighter, editorial magazine feel.
*   **Body:** `body-lg` is your workhorse. Ensure a line-height of at least 1.6 to maintain the "Modern & Minimal" requirement.
*   **Labels:** Use `label-md` in `on_surface_variant` (#4e4632). These should never be pure black; they should feel like a soft graphite.

---

## 4. Elevation & Depth: The Layering Principle
We do not build grids; we stack sheets of paper.

*   **Tonal Layering:** Place a `surface_container_lowest` (#ffffff) card directly onto a `surface` (#fff9ea) background. The delta in brightness provides all the "lift" necessary.
*   **Ambient Shadows:** For floating elements (like the 440px cards), use a custom shadow: `0px 20px 40px rgba(117, 91, 0, 0.06)`. Note the tint—the shadow is a diluted version of the `primary` color, not grey. This mimics natural sunlight hitting a warm surface.
*   **The "Ghost Border" Fallback:** If a form field or chip requires a boundary for accessibility, use the `outline_variant` at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Cards & Surfaces
- **The Signature Card:** Max-width `440px`, padding `16` (5.5rem / 88px) on top/bottom and `10` (3.5rem / 56px) on sides to exceed the user’s 48px request for a more luxurious feel. Radius: `xl` (1.5rem/24px).
- **No Dividers:** Lists within cards must use `spacing-4` (1.4rem) gaps rather than lines.

### Buttons
- **Primary:** Background `primary_container` (#f5c200), text `on_primary_fixed` (#241a00). Height: 48px. Radius: `md` (0.75rem/12px).
- **Secondary (The Glass Button):** Transparent background with a `ghost border` and `primary` text.
- **Interactions:** On hover, the primary button should shift to `primary_fixed_dim` with a slight `2px` upward translation (Y-axis).

### Inputs
- **Text Fields:** Height 48px, background `surface_container_lowest`. The focus state is a `2px` solid ring of `primary_container` (#f5c200). 
- **Floating Labels:** Use `label-md` and ensure they sit `spacing-1` above the input, never touching the border.

### Chips & Tags
- Use `surface_container_high` backgrounds with `on_surface_variant` text. Avoid bold weights here; keep it light and secondary.

---

## 6. Do’s and Don’ts

### Do:
- **Exaggerate Whitespace:** If a layout feels "finished," add another 20% of whitespace.
- **Use Nested Surfaces:** Place a `surface_container_highest` button inside a `surface_container_lowest` card to create a "recessed" look.
- **Mix Weights:** Use `Bold` for headlines and `Medium` or `Regular` for body text to create high-contrast hierarchy.

### Don't:
- **Never use Blue or Purple:** Even for "success" or "link" states. Use the `tertiary` (Teal/Cyan) range or `primary` (Gold) range only.
- **No Hard Borders:** A 100% opaque `#E0E0E0` border is too "default." Use the Tonal Layering Principle instead.
- **No Centering Everything:** Use left-aligned editorial layouts. Center-aligned text should be reserved strictly for hero Display types.
- **No Pure Grey Shadows:** Shadows must always contain a hint of the brand’s honey/gold warmth.
