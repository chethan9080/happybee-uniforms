# Design System Strategy: The Sun-Drenched Hive

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Apiary"**
This design system moves away from the chaotic "primary color" palette typical of children's brands and instead embraces a sophisticated, editorial approach to playfulness. We are building a "Digital Apiary"—a space that feels warm, structured, and organic. 

To break the "template" look, we utilize **Intentional Asymmetry**. Hero sections should not be perfectly centered; instead, they should feature overlapping elements (e.g., a card bleeding off-edge or a honeycomb texture peeking from behind a high-resolution lifestyle image). By pairing the warmth of `primary_container` (#F5C200) with the vast breathing room of a `surface` (#FBFAEE) background, we create a premium environment that respects both the child's joy and the parent's aesthetic sensibilities.

---

## 2. Colors & Surface Architecture
Our palette is rooted in the warmth of golden hour. We avoid "flatness" by using tonal depth.

*   **Primary (The Glow):** `primary` (#755B00) for high-contrast actions and `primary_container` (#F5C200) for vibrant, welcoming surfaces.
*   **Neutral (The Canvas):** `surface` (#FBFAEE) is our soft cream foundation. It provides a more premium, "paper-like" feel than a clinical pure white.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning. Separation must be achieved through **Background Shifts**.
*   **Example:** A `surface_container_low` section sitting on a `surface` background provides all the definition a modern UI needs without the "boxed-in" feel of traditional outlines.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine materials.
*   **Base:** `surface` (#FBFAEE)
*   **Sectioning:** `surface_container_low` (#F5F4E8)
*   **Interactive Cards:** `surface_container_highest` (#E4E3D7)
*   **Floating Elements:** `surface_container_lowest` (#FFFFFF)

### The Glass & Gradient Rule
To add "soul" to the interface, use subtle linear gradients on primary CTAs (e.g., `primary` transitioning to `primary_container` at a 135-degree angle). For floating navigation or modals, employ **Glassmorphism**: use `surface_container_lowest` at 80% opacity with a `20px` backdrop blur to allow the honeycomb textures below to bleed through softly.

---

## 3. Typography: Editorial Play
We pair two distinct personalities to create a "Professional-Playful" tension.

*   **Display & Headlines (Plus Jakarta Sans):** This font provides the "Professional" anchor. Its geometric clarity feels modern and high-end. Use `display-lg` (3.5rem) for hero statements to create an editorial impact.
*   **Body & Titles (Be Vietnam Pro):** A softer, more humanist sans-serif that feels approachable and "Friendly."
*   **Hierarchy as Identity:** Use extreme scale. A very large `display-md` headline paired with a significantly smaller, all-caps `label-md` creates a sophisticated rhythmic contrast that signals a premium brand.

---

## 4. Elevation & Depth: Tonal Layering
We reject the standard Material Design "Drop Shadow" in favor of **Ambient Diffusion**.

*   **The Layering Principle:** Instead of shadows, place a `surface_container_lowest` (#FFFFFF) card on top of a `surface_container` (#EFEEE3) background. The 2% shift in brightness creates a natural, "soft-touch" lift.
*   **Ambient Shadows:** When a shadow is necessary (e.g., for a floating CTA), use a blur of `32px` with an opacity of `6%`. The shadow color should be a tint of our `on_surface` (#1B1C15) rather than pure black, ensuring the shadow feels like a warm glow rather than a dark void.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components & Signature Patterns

### Signature Element: The Honeycomb Texture
Never use the honeycomb as a full-page background. Instead, mask it into specific shapes or use it as a "peek-a-boo" element inside `primary_container` sections. The pattern should be subtle—stroke weight of `1px` using `on_primary_container` at 10% opacity.

### Buttons
*   **Primary:** High-rounded (`full` corner radius), using the `primary` to `primary_container` gradient. 
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Interaction:** On hover, the button should "grow" slightly (1.02x scale) rather than just changing color.

### Cards
*   **Rule:** Forbid divider lines. 
*   **Structure:** Use `spacing-6` (2rem) as the standard internal padding. Separate content using typography weight and `spacing-3` (1rem) vertical gaps. 
*   **Radius:** Use `xl` (3rem) for large lifestyle cards and `DEFAULT` (1rem) for smaller utility cards.

### Input Fields
*   **Style:** `surface_container_low` background with a `full` (pill-shaped) radius.
*   **Focus State:** Instead of a heavy border, use a soft glow (a 4px outer spread of `primary_fixed`).

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Whitespace:** Use `spacing-20` (7rem) between major sections to let the brand breathe.
*   **Nesting Surfaces:** Place a "White" card on a "Cream" background for a premium, layered effect.
*   **Asymmetric Layouts:** Allow images to overlap the boundary between two different surface colors.

### Don’t:
*   **Don't use 1px black borders:** It kills the "soft and welcoming" atmosphere instantly.
*   **Don't center everything:** Stagger your grid items to create a sense of movement and "play."
*   **Don't use harsh shadows:** If the shadow is clearly visible, it’s too dark. It should be an ambient suggestion of depth.
*   **Don't over-texture:** The honeycomb is a spice, not the main course. Use it sparingly on 10-15% of the screen real estate.
