export interface ThemeConfig {
    id: string;
    label: string;
    bg: string;
    surface: string;
    textPrimary: string;
    textMuted: string;
    textDim: string;
    glassBg: string;
    glassBorder: string;
    cardBg: string;
    navBg: string; // Used for navbar background
}

export const PORTFOLIO_THEMES: Record<string, ThemeConfig> = {
    // 1. Standard Dark
    dark: {
        id: "dark", label: "Classic Dark",
        bg: "#030310", surface: "rgba(255,255,255,0.03)",
        textPrimary: "#e2e8f0", textMuted: "#94a3b8", textDim: "#64748b",
        glassBg: "rgba(255,255,255,0.03)", glassBorder: "rgba(255,255,255,0.06)",
        cardBg: "rgba(20,20,40,0.92)", navBg: "rgba(10, 10, 30, 0.85)"
    },
    // 2. Standard Light
    light: {
        id: "light", label: "Classic Light",
        bg: "#ffffff", surface: "#f8fafc",
        textPrimary: "#0f172a", textMuted: "#475569", textDim: "#94a3b8",
        glassBg: "rgba(15, 23, 42, 0.03)", glassBorder: "rgba(15, 23, 42, 0.08)",
        cardBg: "#ffffff", navBg: "rgba(255, 255, 255, 0.9)"
    },
    // 3. Midnight Blue
    midnight: {
        id: "midnight", label: "Midnight Blue",
        bg: "#020617", surface: "#0f172a",
        textPrimary: "#f8fafc", textMuted: "#94a3b8", textDim: "#64748b",
        glassBg: "rgba(30, 41, 59, 0.3)", glassBorder: "rgba(51, 65, 85, 0.4)",
        cardBg: "#0f172a", navBg: "rgba(15, 23, 42, 0.85)"
    },
    // 4. Sunset / Purple
    sunset: {
        id: "sunset", label: "Sunset Vibes",
        bg: "#1a0b1c", surface: "#2d1b2e",
        textPrimary: "#fae8ff", textMuted: "#d8b4fe", textDim: "#a855f7",
        glassBg: "rgba(88, 28, 135, 0.15)", glassBorder: "rgba(168, 85, 247, 0.2)",
        cardBg: "#2d1b2e", navBg: "rgba(45, 27, 46, 0.85)"
    },
    // 5. Ocean / Teal
    ocean: {
        id: "ocean", label: "Ocean Depths",
        bg: "#041C2C", surface: "#0A2A3D",
        textPrimary: "#ecfeff", textMuted: "#67e8f9", textDim: "#22d3ee",
        glassBg: "rgba(8, 145, 178, 0.1)", glassBorder: "rgba(34, 211, 238, 0.2)",
        cardBg: "#0A2A3D", navBg: "rgba(10, 42, 61, 0.85)"
    },
    // 6. Forest / Green
    forest: {
        id: "forest", label: "Deep Forest",
        bg: "#051C12", surface: "#0B291D",
        textPrimary: "#f0fdf4", textMuted: "#86efac", textDim: "#4ade80",
        glassBg: "rgba(22, 101, 52, 0.15)", glassBorder: "rgba(74, 222, 128, 0.2)",
        cardBg: "#0B291D", navBg: "rgba(11, 41, 29, 0.85)"
    },
    // 7. Cyberpunk
    cyberpunk: {
        id: "cyberpunk", label: "Cyberpunk",
        bg: "#000000", surface: "#1a1a1a",
        textPrimary: "#fce7f3", textMuted: "#f472b6", textDim: "#ec4899",
        glassBg: "rgba(236, 72, 153, 0.1)", glassBorder: "rgba(236, 72, 153, 0.4)",
        cardBg: "#121212", navBg: "rgba(20, 20, 20, 0.9)"
    },
    // 8. Coffee / Warm
    coffee: {
        id: "coffee", label: "Coffee Shop",
        bg: "#1C1917", surface: "#292524",
        textPrimary: "#f5f5f4", textMuted: "#a8a29e", textDim: "#78716c",
        glassBg: "rgba(120, 113, 108, 0.1)", glassBorder: "rgba(168, 162, 158, 0.2)",
        cardBg: "#292524", navBg: "rgba(41, 37, 36, 0.85)"
    },
    // 9. Rose
    rose: {
        id: "rose", label: "Rose Petal",
        bg: "#fff1f2", surface: "#ffe4e6",
        textPrimary: "#881337", textMuted: "#be123c", textDim: "#e11d48",
        glassBg: "rgba(255, 255, 255, 0.6)", glassBorder: "rgba(225, 29, 72, 0.2)",
        cardBg: "#fff1f2", navBg: "rgba(255, 241, 242, 0.9)"
    },
    // 10. Slate / Minimal
    slate: {
        id: "slate", label: "Minimal Slate",
        bg: "#f8fafc", surface: "#f1f5f9",
        textPrimary: "#0f172a", textMuted: "#64748b", textDim: "#94a3b8",
        glassBg: "rgba(255, 255, 255, 0.8)", glassBorder: "rgba(148, 163, 184, 0.3)",
        cardBg: "#ffffff", navBg: "rgba(248, 250, 252, 0.9)"
    },
    // 11. Terminal
    terminal: {
        id: "terminal", label: "Hacker Terminal",
        bg: "#0c0c0c", surface: "#121212",
        textPrimary: "#22c55e", textMuted: "#4ade80", textDim: "#166534",
        glassBg: "rgba(34, 197, 94, 0.05)", glassBorder: "rgba(34, 197, 94, 0.3)",
        cardBg: "#121212", navBg: "rgba(12, 12, 12, 0.95)"
    },
    // 12. Royal / Gold
    royal: {
        id: "royal", label: "Royal Gold",
        bg: "#2A2312", surface: "#3F351B",
        textPrimary: "#fefce8", textMuted: "#fde047", textDim: "#eab308",
        glassBg: "rgba(234, 179, 8, 0.1)", glassBorder: "rgba(250, 204, 21, 0.3)",
        cardBg: "#3F351B", navBg: "rgba(42, 35, 18, 0.9)"
    },
    // 13. Lavender
    lavender: {
        id: "lavender", label: "Soft Lavender",
        bg: "#faf5ff", surface: "#f3e8ff",
        textPrimary: "#581c87", textMuted: "#7e22ce", textDim: "#a855f7",
        glassBg: "rgba(255, 255, 255, 0.6)", glassBorder: "rgba(168, 85, 247, 0.2)",
        cardBg: "#ffffff", navBg: "rgba(250, 245, 255, 0.9)"
    },
    // 14. Nordic / Blue-Grey
    nordic: {
        id: "nordic", label: "Nordic Frost",
        bg: "#262b32", surface: "#313840",
        textPrimary: "#eceff4", textMuted: "#d8dee9", textDim: "#81a1c1",
        glassBg: "rgba(129, 161, 193, 0.1)", glassBorder: "rgba(129, 161, 193, 0.3)",
        cardBg: "#313840", navBg: "rgba(38, 43, 50, 0.9)"
    },
    // 15. Blackout
    blackout: {
        id: "blackout", label: "True Blackout",
        bg: "#000000", surface: "#0a0a0a",
        textPrimary: "#ffffff", textMuted: "#a3a3a3", textDim: "#525252",
        glassBg: "rgba(255, 255, 255, 0.05)", glassBorder: "rgba(255, 255, 255, 0.15)",
        cardBg: "#0a0a0a", navBg: "rgba(0, 0, 0, 0.9)"
    },
    // 16. Glassmorphism
    glass: {
        id: "glass", label: "Glassmorphism",
        bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        surface: "rgba(255,255,255,0.05)",
        textPrimary: "#ffffff",
        textMuted: "#cbd5e1",
        textDim: "#94a3b8",
        glassBg: "rgba(255,255,255,0.03)",
        glassBorder: "rgba(255,255,255,0.1)",
        cardBg: "rgba(255,255,255,0.02)",
        navBg: "rgba(15, 23, 42, 0.6)"
    },
    // 17. Snow (True Light)
    snow: {
        id: "snow", label: "Snow White",
        bg: "#ffffff", surface: "#f9fafb",
        textPrimary: "#111827", textMuted: "#4b5563", textDim: "#9ca3af",
        glassBg: "rgba(255, 255, 255, 0.9)", glassBorder: "rgba(229, 231, 235, 0.8)",
        cardBg: "#ffffff", navBg: "rgba(255, 255, 255, 0.95)"
    },
    // 18. Solarized Light
    solar: {
        id: "solar", label: "Solarized Sun",
        bg: "#fdf6e3", surface: "#eee8d5",
        textPrimary: "#073642", textMuted: "#586e75", textDim: "#93a1a1",
        glassBg: "rgba(238, 232, 213, 0.6)", glassBorder: "rgba(147, 161, 161, 0.2)",
        cardBg: "#eee8d5", navBg: "rgba(253, 246, 227, 0.95)"
    },
    // 19. Corporate (Blue/White)
    corporate: {
        id: "corporate", label: "Corporate Blue",
        bg: "#f0f4f8", surface: "#ffffff",
        textPrimary: "#102a43", textMuted: "#486581", textDim: "#829ab1",
        glassBg: "rgba(255, 255, 255, 0.8)", glassBorder: "rgba(188, 204, 220, 0.5)",
        cardBg: "#ffffff", navBg: "rgba(240, 244, 248, 0.95)"
    },
    // 20. Matcha (Green/Cream)
    matcha: {
        id: "matcha", label: "Matcha Tea",
        bg: "#f1f8e9", surface: "#ffffff",
        textPrimary: "#33691e", textMuted: "#689f38", textDim: "#9ccc65",
        glassBg: "rgba(255, 255, 255, 0.7)", glassBorder: "rgba(197, 225, 165, 0.5)",
        cardBg: "#ffffff", navBg: "rgba(241, 248, 233, 0.95)"
    },
    // 21. Synthwave (Retro)
    synthwave: {
        id: "synthwave", label: "Synthwave 80s",
        bg: "#2b213a", surface: "#241b35",
        textPrimary: "#ff71ce", textMuted: "#01cdfe", textDim: "#b967ff",
        glassBg: "rgba(36, 27, 53, 0.6)", glassBorder: "rgba(255, 113, 206, 0.3)",
        cardBg: "#241b35", navBg: "rgba(43, 33, 58, 0.9)"
    },
    // 22. Pop (Vibrant)
    pop: {
        id: "pop", label: "Pop Art",
        bg: "#fffbe6", surface: "#ffffff",
        textPrimary: "#121212", textMuted: "#444444", textDim: "#888888",
        glassBg: "rgba(255, 255, 255, 0.9)", glassBorder: "rgba(0, 0, 0, 0.1)",
        cardBg: "#ffffff", navBg: "rgba(255, 251, 230, 0.95)"
    },
    // 23. Liquid (Dark Gradient)
    liquid: {
        id: "liquid", label: "Liquid Metal",
        bg: "linear-gradient(to bottom right, #232526, #414345)", surface: "rgba(255,255,255,0.05)",
        textPrimary: "#e0e0e0", textMuted: "#a0a0a0", textDim: "#606060",
        glassBg: "rgba(0, 0, 0, 0.2)", glassBorder: "rgba(255, 255, 255, 0.1)",
        cardBg: "rgba(35, 37, 38, 0.8)", navBg: "rgba(35, 37, 38, 0.9)"
    }
};
