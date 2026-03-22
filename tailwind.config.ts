import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // happyB theme colors
        "surface-bright": "#fbfaee",
        "secondary-fixed-dim": "#c8c6c6",
        "on-surface-variant": "#4e4632",
        "surface-tint": "#755b00",
        "inverse-on-surface": "#f2f1e5",
        "on-primary-container": "#685100",
        "surface-variant": "#e4e3d7",
        "on-primary-fixed": "#241a00",
        "on-tertiary-container": "#005c70",
        "primary-container": "#f5c200",
        "secondary-fixed": "#e4e2e1",
        "surface-container": "#efeee3",
        "tertiary-fixed": "#b3ebff",
        "on-secondary-fixed-variant": "#474747",
        "on-error-container": "#93000a",
        "on-secondary-container": "#656464",
        "error-container": "#ffdad6",
        "on-tertiary-fixed": "#001f27",
        "surface-container-lowest": "#ffffff",
        "outline": "#807660",
        "surface-container-high": "#e9e9dd",
        "surface": "#fbfaee",
        "primary-fixed-dim": "#f3c000",
        "on-tertiary-fixed-variant": "#004e5f",
        "primary-fixed": "#ffe08f",
        "on-primary-fixed-variant": "#584400",
        "inverse-primary": "#f3c000",
        "tertiary-container": "#49d9ff",
        "secondary-container": "#e4e2e1",
        "surface-container-highest": "#e4e3d7",
        "surface-container-low": "#f5f4e8",
        "on-surface": "#1b1c15",
        "tertiary-fixed-dim": "#45d7fc",
        "on-background": "#1b1c15",
        "outline-variant": "#d2c5ab",
        "inverse-surface": "#303129",
        "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff",
        "surface-dim": "#dbdbcf",
        "on-secondary-fixed": "#1b1c1c"
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Be Vietnam Pro", "sans-serif"],
        label: ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% center" },
          "50%": { backgroundPosition: "100% center" },
          "100%": { backgroundPosition: "0% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in": "slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        gradient: "gradient 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
