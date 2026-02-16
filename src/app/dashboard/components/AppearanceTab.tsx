"use client";

import { Palette, Check, Zap, Code } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { SectionHeader, Select, Textarea, Checkbox } from "./DashboardUI";
import { PORTFOLIO_THEMES } from "@/lib/themes";

const accent = "#6366f1";
const accent2 = "#14b8a6";
const fg = "var(--foreground, #e2e8f0)";
const fgMuted = "var(--foreground-muted, #94a3b8)";
const fgDim = "var(--foreground-dim, #64748b)";
const glassBg = "rgba(255,255,255,0.03)";
const glassBorder = "rgba(255,255,255,0.06)";

const card: React.CSSProperties = {
    background: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${glassBorder}`, borderRadius: "20px", padding: "28px",
};
const inputRow: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "18px" };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

interface AppearanceTabProps {
    profileData: any;
    setProfileData: (data: any) => void;
}

export default function AppearanceTab({ profileData, setProfileData }: AppearanceTabProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SectionHeader title="Appearance" subtitle="Customize how your portfolio looks to visitors." />

            {/* Theme Presets */}
            <div style={card}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Palette style={{ width: 16, height: 16, color: accent }} /> Choose a Theme
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
                    {Object.values(PORTFOLIO_THEMES).map(theme => (
                        <button key={theme.id}
                            onClick={() => setProfileData({
                                ...profileData,
                                color_theme: theme.id,
                                // Update granular colors for backward compatibility / fine-tuning
                                primary_color: theme.textDim, // Approximation for accent
                                secondary_color: theme.textMuted,
                                bg_color: theme.bg,
                                surface_color: theme.surface,
                                text_primary: theme.textPrimary,
                                text_muted: theme.textMuted,
                                card_style: "glass", // Default to glass for all new themes
                            })}
                            style={{
                                background: theme.bg,
                                border: `2px solid ${profileData.color_theme === theme.id ? accent : glassBorder}`,
                                borderRadius: 12, padding: 12, cursor: "pointer", textAlign: "left",
                                position: "relative", overflow: "hidden", minHeight: 80,
                                transition: "transform 0.2s, border-color 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.textDim}, ${theme.textMuted})`, marginBottom: 12 }} />
                            <p style={{ fontWeight: 600, fontSize: "0.85rem", color: theme.textPrimary }}>{theme.label}</p>
                            {profileData.color_theme === theme.id && (
                                <div style={{ position: "absolute", top: 8, right: 8, background: accent, borderRadius: "50%", padding: 2 }}>
                                    <Check size={10} color="white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Customization Toggle */}
            <div style={{ marginTop: 32, borderTop: `1px solid ${glassBorder}`, paddingTop: 24 }}>
                <details style={{ cursor: "pointer" }}>
                    <summary style={{ fontSize: "1rem", fontWeight: 600, color: fg, outline: "none", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "inline-block", transition: "transform 0.2s" }}>⚙️</span> Advanced Customization
                    </summary>

                    <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 24 }}>
                        {/* Color Pickers */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <Palette style={{ width: 16, height: 16, color: profileData.primary_color }} /> Accent Colors
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: fgMuted, marginBottom: 10 }}>Primary Color</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <input type="color" value={profileData.primary_color}
                                            onChange={(e) => setProfileData({ ...profileData, primary_color: e.target.value })}
                                            style={{ width: 48, height: 48, border: "none", borderRadius: 12, cursor: "pointer", background: "transparent" }} />
                                        <div>
                                            <div style={{ width: 100, height: 8, borderRadius: 4, background: profileData.primary_color, marginBottom: 6 }} />
                                            <span style={{ fontSize: "0.78rem", color: fgDim, fontFamily: "monospace" }}>{profileData.primary_color}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: fgMuted, marginBottom: 10 }}>Secondary Color</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <input type="color" value={profileData.secondary_color}
                                            onChange={(e) => setProfileData({ ...profileData, secondary_color: e.target.value })}
                                            style={{ width: 48, height: 48, border: "none", borderRadius: 12, cursor: "pointer", background: "transparent" }} />
                                        <div>
                                            <div style={{ width: 100, height: 8, borderRadius: 4, background: profileData.secondary_color, marginBottom: 6 }} />
                                            <span style={{ fontSize: "0.78rem", color: fgDim, fontFamily: "monospace" }}>{profileData.secondary_color}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Live gradient preview */}
                            <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 14, background: `linear-gradient(135deg, ${profileData.primary_color}, ${profileData.secondary_color})`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Gradient Preview</span>
                                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>Header & Accents</span>
                            </div>
                        </div>

                        {/* Granular Color Control */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>System Colors</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: fgMuted, marginBottom: 8 }}>Background</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={profileData.bg_color} onChange={(e) => setProfileData({ ...profileData, bg_color: e.target.value })}
                                            style={{ width: 34, height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                        <span style={{ fontSize: "0.75rem", color: fgDim, fontFamily: "monospace" }}>{profileData.bg_color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: fgMuted, marginBottom: 8 }}>Surface/Cards</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={profileData.surface_color} onChange={(e) => setProfileData({ ...profileData, surface_color: e.target.value })}
                                            style={{ width: 34, height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                        <span style={{ fontSize: "0.75rem", color: fgDim, fontFamily: "monospace" }}>{profileData.surface_color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: fgMuted, marginBottom: 8 }}>Primary Text</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={profileData.text_primary} onChange={(e) => setProfileData({ ...profileData, text_primary: e.target.value })}
                                            style={{ width: 34, height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                        <span style={{ fontSize: "0.75rem", color: fgDim, fontFamily: "monospace" }}>{profileData.text_primary}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: fgMuted, marginBottom: 8 }}>Muted Text</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={profileData.text_muted} onChange={(e) => setProfileData({ ...profileData, text_muted: e.target.value })}
                                            style={{ width: 34, height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                        <span style={{ fontSize: "0.75rem", color: fgDim, fontFamily: "monospace" }}>{profileData.text_muted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Features */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <Zap style={{ width: 16, height: 16, color: "#eab308" }} /> Premium Features
                            </h3>
                            <div style={{ display: "grid", gap: 16 }}>
                                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Select label="Status Badge" value={profileData.status_badge || "none"}
                                        onChange={(v) => setProfileData({ ...profileData, status_badge: v as any })}
                                        options={[
                                            { value: "none", label: "None" },
                                            { value: "open_to_work", label: "Open to Work" },
                                            { value: "freelance", label: "Freelancing" },
                                            { value: "hiring", label: "Hiring" }
                                        ]} />
                                    <div style={{ display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: 12 }}>
                                        <Checkbox label="Enable Timeline View" checked={profileData.timeline_view || false}
                                            onChange={(v) => setProfileData({ ...profileData, timeline_view: v })} />
                                    </div>
                                </div>
                                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <Input label="Medium/RSS Feed URL" placeholder="https://medium.com/feed/@username" value={profileData.rss_url || ""}
                                        onChange={(e) => setProfileData({ ...profileData, rss_url: e.target.value })} />
                                    <Input label="Google Analytics ID" placeholder="G-XXXXXXXXXX" value={profileData.google_analytics_id || ""}
                                        onChange={(e) => setProfileData({ ...profileData, google_analytics_id: e.target.value })} />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: `${accent}15`, borderRadius: 8, border: `1px solid ${accent}30` }}>
                                    <Checkbox label="Auto-fetch Projects from GitHub" checked={profileData.github_fetching || false}
                                        onChange={(v) => setProfileData({ ...profileData, github_fetching: v })} />
                                    <span style={{ fontSize: "0.8rem", color: fgMuted }}>(Requires GitHub username in Profile)</span>
                                </div>
                            </div>
                        </div>

                        {/* Font Selection */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>Typography</h3>
                            <div style={inputRow}>
                                <Select label="Heading Font" value={profileData.heading_font} onChange={(v) => setProfileData({ ...profileData, heading_font: v })}
                                    options={[
                                        { value: "Inter", label: "Inter (Modern)" },
                                        { value: "Playfair Display", label: "Playfair Display (Serif)" },
                                        { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
                                        { value: "JetBrains Mono", label: "JetBrains Mono (Monospace)" },
                                        { value: "Outfit", label: "Outfit (Geometric)" },
                                        { value: "DM Serif Display", label: "DM Serif Display (Classic)" },
                                    ]} />
                                <Select label="Body Font" value={profileData.body_font} onChange={(v) => setProfileData({ ...profileData, body_font: v })}
                                    options={[
                                        { value: "Inter", label: "Inter (Modern)" },
                                        { value: "Roboto", label: "Roboto (Neutral)" },
                                        { value: "Outfit", label: "Outfit (Geometric)" },
                                        { value: "Open Sans", label: "Open Sans (Readable)" },
                                        { value: "Lora", label: "Lora (Serif)" },
                                    ]} />
                            </div>
                        </div>

                        {/* Layout & Component Style */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>Component & Layout</h3>
                            <div style={inputRow}>
                                <div style={grid2}>
                                    <Select label="Button Style" value={profileData.button_style} onChange={(v) => setProfileData({ ...profileData, button_style: v })}
                                        options={[{ value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "ghost", label: "Ghost" }]} />
                                    <Select label="Container Width" value={profileData.container_width} onChange={(v) => setProfileData({ ...profileData, container_width: v })}
                                        options={[{ value: "narrow", label: "Narrow (768px)" }, { value: "normal", label: "Normal (900px)" }, { value: "wide", label: "Wide (1200px)" }]} />
                                </div>
                                <Select label="Card Appearance" value={profileData.card_style} onChange={(v) => setProfileData({ ...profileData, card_style: v })}
                                    options={[{ value: "glass", label: "Glassmorphism" }, { value: "solid", label: "Solid Surface" }, { value: "outline", label: "Outline Only" }]} />
                            </div>
                        </div>

                        {/* Advanced: Custom CSS */}
                        <div style={card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <Code style={{ width: 16, height: 16, color: accent2 }} /> Custom CSS
                            </h3>
                            <Textarea label="Custom CSS Rules" value={profileData.custom_css} onChange={(v) => setProfileData({ ...profileData, custom_css: v })}
                                placeholder=".hero-title { font-size: 5rem; }\n.skill-badge:hover { transform: rotate(5deg); }" rows={6} />
                            <p style={{ fontSize: "0.72rem", color: fgDim, marginTop: 10 }}>
                                🚀 Target existing classes like `.glass-card`, `.section-title`, `.hero-title`, etc.
                            </p>
                        </div>
                    </div>
                </details>
            </div>

            {/* Animation Toggle */}
            <div style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 4 }}>Animations</h3>
                        <p style={{ fontSize: "0.83rem", color: fgMuted }}>Enable smooth entrance and hover animations</p>
                    </div>
                    <button onClick={() => setProfileData({ ...profileData, animation_enabled: !profileData.animation_enabled })}
                        style={{
                            width: 52, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
                            background: profileData.animation_enabled ? profileData.primary_color : "rgba(255,255,255,0.1)",
                            position: "relative", transition: "background 0.2s", flexShrink: 0,
                        }}>
                        <div style={{
                            width: 22, height: 22, borderRadius: 11, background: "white",
                            position: "absolute", top: 3,
                            left: profileData.animation_enabled ? 27 : 3,
                            transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }} />
                    </button>
                </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: fgDim, textAlign: "center", padding: "8px 0" }}>
                💡 Click <strong style={{ color: fg }}>Save</strong> in the top bar to apply your changes to the live portfolio.
            </p>
        </div>
    );
}
