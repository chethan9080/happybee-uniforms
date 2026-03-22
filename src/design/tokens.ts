/**
 * The Sun-Drenched Atelier - Design System Tokens
 * This file serves as the single source of truth for the platform's visual identity.
 * Values are used in combination with Tailwind CSS and Shadcn/ui.
 */

export const spacing = {
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3.5rem", // 56px (Card Side Padding)
  "2xl": "5.5rem", // 88px (Card Top/Bottom Padding)
} as const;

export const radius = {
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px (Buttons)
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px (Signature Card)
} as const;

export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', sans-serif",
    headline: "'Plus Jakarta Sans', sans-serif",
    body: "'Be Vietnam Pro', sans-serif",
    label: "'Plus Jakarta Sans', sans-serif",
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const colors = {
  // Brand Tonal Tokens
  background: "#fff9ea", // surface
  primary: "#755b00",
  primaryContainer: "#f5c200", // used for main CTAs
  onPrimaryFixed: "#241a00", // text on primary container

  // Surface Tiers
  surfaceContainerLowest: "#ffffff", // primary content cards
  surfaceContainerLow: "#faf4dd", // secondary background sections
  surfaceContainerHighest: "#e9e2cc", // tiny decorative elements

  // Text & Accents
  onBackground: "#1e1c0e", // Display/Headlines
  onSurfaceVariant: "#4e4632", // Labels & subtle text
  outlineVariant: "rgba(210, 197, 171, 0.2)", // ghost border at 20% opacity
} as const;

export const shadows = {
  ambient: "0px 20px 40px rgba(117, 91, 0, 0.06)", // Warm, ambient shadow for floating elements
} as const;
