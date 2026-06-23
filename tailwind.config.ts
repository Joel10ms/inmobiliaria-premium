import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Design Tokens ────────────────────────────────────────────
      colors: {
        // Brand
        crimson: {
          DEFAULT: "#960018",
          50:  "#FFF0F2",
          100: "#FFD6DC",
          200: "#FFAAB5",
          300: "#FF7D8E",
          400: "#FF5068",
          500: "#960018",
          600: "#7A0014",
          700: "#5E000F",
          800: "#42000A",
          900: "#260006",
        },
        gold: {
          DEFAULT: "#C9A86A",
          50:  "#FAF5EC",
          100: "#F2E6CC",
          200: "#E5CDA0",
          300: "#D8B374",
          400: "#C9A86A",
          500: "#B8933D",
          600: "#9A7A32",
          700: "#7C6228",
          800: "#5E4A1E",
          900: "#403214",
        },
        // Neutrals premium
        obsidian: {
          DEFAULT: "#121212",
          50:  "#F2F2F2",
          100: "#E0E0E0",
          200: "#BDBDBD",
          300: "#9E9E9E",
          400: "#757575",
          500: "#616161",
          600: "#424242",
          700: "#2A2A2A",
          800: "#1E1E1E",
          900: "#121212",
        },
        ivory: {
          DEFAULT: "#F8F8F8",
          50: "#FFFFFF",
          100: "#F8F8F8",
          200: "#F0F0F0",
          300: "#E8E8E8",
          400: "#D0D0D0",
        },
        // Semantic aliases (para usar en componentes)
        brand: {
          primary:   "#960018",
          secondary: "#C9A86A",
          dark:      "#121212",
          "dark-2":  "#2A2A2A",
          light:     "#F8F8F8",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display
        "display-2xl": ["4.5rem",  { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.02em" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.25", letterSpacing: "-0.01em" }],
        // Body scale
        "body-xl":  ["1.25rem", { lineHeight: "1.75" }],
        "body-lg":  ["1.125rem",{ lineHeight: "1.75" }],
        "body-md":  ["1rem",    { lineHeight: "1.6"  }],
        "body-sm":  ["0.875rem",{ lineHeight: "1.6"  }],
        "body-xs":  ["0.75rem", { lineHeight: "1.5"  }],
        // Label
        "label-lg": ["0.875rem", { lineHeight: "1.25", letterSpacing: "0.08em", fontWeight: "600" }],
        "label-sm": ["0.75rem",  { lineHeight: "1.25", letterSpacing: "0.1em",  fontWeight: "600" }],
      },
      spacing: {
        "4.5":  "1.125rem",
        "5.5":  "1.375rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "38":   "9.5rem",
        "42":   "10.5rem",
        "section": "6rem",
        "section-lg": "8rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "luxury":    "0 4px 30px rgba(18, 18, 18, 0.15)",
        "luxury-lg": "0 8px 60px rgba(18, 18, 18, 0.2)",
        "luxury-xl": "0 20px 80px rgba(18, 18, 18, 0.25)",
        "gold":      "0 4px 30px rgba(201, 168, 106, 0.3)",
        "crimson":   "0 4px 30px rgba(150, 0, 24, 0.3)",
        "card":      "0 1px 3px rgba(18, 18, 18, 0.08), 0 4px 16px rgba(18, 18, 18, 0.06)",
        "card-hover":"0 4px 20px rgba(18, 18, 18, 0.12), 0 8px 40px rgba(18, 18, 18, 0.08)",
      },
      backgroundImage: {
        "gradient-luxury":  "linear-gradient(135deg, #121212 0%, #2A2A2A 100%)",
        "gradient-crimson": "linear-gradient(135deg, #960018 0%, #7A0014 100%)",
        "gradient-gold":    "linear-gradient(135deg, #C9A86A 0%, #B8933D 100%)",
        "gradient-overlay": "linear-gradient(to bottom, rgba(18,18,18,0) 0%, rgba(18,18,18,0.85) 100%)",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      animation: {
        "fade-in":      "fadeIn 0.6s ease forwards",
        "slide-up":     "slideUp 0.6s ease forwards",
        "slide-in-left":"slideInLeft 0.6s ease forwards",
        "shimmer":      "shimmer 1.5s infinite linear",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        "xs": "480px",
        "3xl": "1920px",
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
