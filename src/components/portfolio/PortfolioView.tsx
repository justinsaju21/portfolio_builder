"use client";

import React from "react";
import { BackToTop } from "@/components/ui/BackToTop";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowDown,
    Mail,
    Github,
    Linkedin,
    MapPin,
    Calendar,
    Building2,
    Briefcase,
    ExternalLink,
    GraduationCap,
    Star,
    Code,
    FolderOpen,
    BookOpen,
    MessageSquare,
    Menu,
    X,
    User,
    Download,
    Trophy,
    Users,
    Award,
    Zap,
    Globe,
    Heart,
    Layers,
} from "lucide-react";
import { PortfolioData, CustomSection as CustomSectionType } from "@/lib/types";
import ReactMarkdown from "react-markdown";

/* ─── Icon Map for Dynamic Sections ─── */
const ICON_MAP: Record<string, React.ElementType> = {
    User, Code, Briefcase, FolderOpen, Trophy, BookOpen, MessageSquare,
    Star, Heart, Zap, Globe, Award, Users, Layers, Calendar, MapPin,
    Building2, ExternalLink, GraduationCap, Download, Menu, X, Mail, Github, Linkedin,
};

/* ─── Animation variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};
const stagger = {
    visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Shared inline styles ─── */
const accent = "#818cf8";
const accent2 = "#14b8a6";
const fg = "var(--foreground, #e2e8f0)";
const fgMuted = "var(--foreground-muted, #94a3b8)";
const fgDim = "var(--foreground-dim, #64748b)";
const glassBg = "var(--glass-bg, rgba(255,255,255,0.03))";
const glassBorder = "var(--glass-border, rgba(255,255,255,0.06))";

const container: React.CSSProperties = { maxWidth: "1100px", margin: "0 auto" };
const sectionPad: React.CSSProperties = { padding: "80px 24px" };
const sectionLabel: React.CSSProperties = {
    fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "3px", marginBottom: "12px", display: "block",
};
const sectionTitle: React.CSSProperties = {
    fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, color: fg, lineHeight: 1.2,
};
const card: React.CSSProperties = {
    background: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${glassBorder}`, borderRadius: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
};
const cardHover = (color: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 40px ${color}15`;
        e.currentTarget.style.borderColor = `${color}30`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = glassBorder;
    },
});
const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "8px 18px", borderRadius: "100px", fontSize: "0.85rem", textDecoration: "none",
    transition: "all 0.25s ease",
};
const dividerLine = (a: string, a2: string): React.CSSProperties => ({
    width: "60px", height: "3px", borderRadius: "8px",
    background: `linear-gradient(90deg, ${a}, ${a2})`,
    margin: "16px auto 0",
});

const FONT_MAP: Record<string, string> = {
    inter: "'Inter', sans-serif",
    playfair: "'Playfair Display', serif",
    space_grotesk: "'Space Grotesk', sans-serif",
    jetbrains: "'JetBrains Mono', monospace",
};
const FONT_URLS: Record<string, string> = {
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    playfair: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap",
    space_grotesk: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    jetbrains: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap",
};

function getCardStyle(style: string, accent: string): React.CSSProperties {
    switch (style) {
        case "solid":
            return {
                background: "rgba(20,20,40,0.92)", border: `1px solid rgba(255,255,255,0.06)`,
                borderRadius: "20px", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            };
        case "outline":
            return {
                background: "transparent", border: `2px solid rgba(255,255,255,0.1)`,
                borderRadius: "20px", transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            };
        default: // glass
            return {
                background: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${glassBorder}`, borderRadius: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            };
    }
}

/* ─── Google Drive image URL helper ─── */
function getImageUrl(url: string | undefined): string | null {
    if (!url) return null;
    // Convert Google Drive share links to direct image URLs
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    // Already a direct URL
    if (url.startsWith("http")) return url;
    return null;
}

/* ─── Nav links generation ─── */
const SECTION_META: Record<string, { label: string; icon: React.ElementType }> = {
    about: { label: "About", icon: User },
    skills: { label: "Skills", icon: Code },
    experience: { label: "Experience", icon: Briefcase },
    projects: { label: "Projects", icon: FolderOpen },
    leadership: { label: "Leadership", icon: Trophy },
    education: { label: "Education", icon: BookOpen },
    contact: { label: "Contact", icon: MessageSquare },
};

function buildNavLinks(data: PortfolioData) {
    const { sectionOrder, hiddenSections, customSections } = data;
    const links: { id: string; label: string; icon: React.ElementType }[] = [];

    // Check if a built-in section has data
    const hasData: Record<string, boolean> = {
        about: true, // always present
        skills: data.skills.length > 0,
        experience: data.experiences.length > 0,
        projects: data.projects.length > 0,
        leadership: data.leadership.length > 0,
        education: data.education.length > 0,
        contact: true, // always present
    };

    for (const id of sectionOrder) {
        if (hiddenSections.includes(id)) continue;

        // Built-in section
        if (SECTION_META[id] && hasData[id]) {
            links.push({ id, ...SECTION_META[id] });
            continue;
        }

        // Custom section
        const custom = customSections.find(s => s.id === id);
        if (custom && custom.visible) {
            const IconComponent = ICON_MAP[custom.icon] || Layers;
            links.push({ id: custom.id, label: custom.title, icon: IconComponent });
        }
    }

    return links;
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO NAVBAR
   ═══════════════════════════════════════════════════════════ */
function PortfolioNavbar({ data }: { data: PortfolioData }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const navLinks = buildNavLinks(data);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
            // If near bottom of page, activate last nav link (Contact)
            const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 150;
            if (atBottom) {
                setActiveSection(navLinks[navLinks.length - 1].id);
                return;
            }
            const checkY = window.innerHeight * 0.3;
            for (const link of navLinks) {
                const el = document.getElementById(link.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= checkY && rect.bottom >= checkY) {
                        setActiveSection(link.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
                transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
                ...(scrolled ? {
                    padding: "8px 24px",
                } : {
                    padding: "0 24px",
                }),
            }}
        >
            <motion.div
                animate={scrolled ? { opacity: 1 } : { opacity: 1 }}
                style={{
                    transition: "all 0.4s cubic-bezier(0.25,0.1,0.25,1)",
                    ...(scrolled ? {
                        maxWidth: "720px", margin: "0 auto",
                        borderRadius: "100px",
                        background: "rgba(10,10,30,0.85)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: `1px solid ${glassBorder}`,
                        boxShadow: `0 4px 30px rgba(0,0,0,0.3), 0 0 40px ${accent}08`,
                    } : {
                        width: "100%",
                        background: "transparent",
                        borderBottom: "1px solid transparent",
                        paddingTop: "8px",
                    }),
                }}
            >
                <nav style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.4s ease",
                    ...(scrolled ? { padding: "10px 24px" } : { padding: "8px 24px", maxWidth: "1100px", margin: "0 auto" }),
                }}>
                    {/* Name / Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        style={{
                            border: "none", cursor: "pointer",
                            fontWeight: 800, fontSize: scrolled ? "1rem" : "1.15rem",
                            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text", transition: "all 0.3s ease",
                        } as React.CSSProperties}
                    >
                        {data.profile.full_name.split(" ")[0]}
                    </button>

                    {/* Desktop links */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav-links">
                        {navLinks.map(link => {
                            const isActive = activeSection === link.id;
                            return (
                                <button
                                    key={link.id}
                                    onClick={() => scrollTo(link.id)}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        padding: "8px 14px", fontSize: "0.82rem",
                                        color: isActive ? accent : fgMuted,
                                        fontWeight: isActive ? 600 : 400,
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                        borderRadius: "8px",
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = fg; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = fgMuted; }}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            style={{
                                                position: "absolute", bottom: "0", left: "15%", right: "15%",
                                                height: "2px", borderRadius: "2px",
                                                background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: fg, padding: "8px" }}
                        className="mobile-menu-btn"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </nav>
            </motion.div>

            {/* Mobile fullscreen overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed", inset: 0, zIndex: 999,
                            background: "rgba(5,5,20,0.95)", backdropFilter: "blur(20px)",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: "16px",
                        }}
                    >
                        {navLinks.map((link, i) => (
                            <motion.button
                                key={link.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={() => scrollTo(link.id)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    color: activeSection === link.id ? accent : fg,
                                    fontSize: "1.3rem", fontWeight: 600,
                                    display: "flex", alignItems: "center", gap: "12px",
                                    padding: "14px 32px", borderRadius: "16px",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <link.icon size={20} />
                                {link.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive CSS for mobile */}
            <style>{`
                .mobile-menu-btn { display: none !important; }
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex !important; }
                    .desktop-nav-links { display: none !important; }
                }
            `}</style>
        </motion.header>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PORTFOLIO VIEW
   ═══════════════════════════════════════════════════════════ */
export function PortfolioView({ data }: { data: PortfolioData }) {
    const { profile, experiences, projects, skills, education, leadership, customSections, sectionOrder, hiddenSections } = data;
    const profileImg = getImageUrl(profile.profile_image);

    // Dynamic UI from profile settings
    const accent = profile.primary_color || "#818cf8";
    const accent2 = profile.secondary_color || "#14b8a6";
    const fontFamily = FONT_MAP[profile.font_choice || "inter"] || FONT_MAP.inter;
    const fontUrl = FONT_URLS[profile.font_choice || "inter"] || FONT_URLS.inter;
    const cardStyle = getCardStyle(profile.card_style || "glass", accent);
    const animEnabled = profile.animation_enabled !== false;
    const divider = dividerLine(accent, accent2);

    // Animation helpers — if disabled, show instantly
    const anim = animEnabled ? fadeUp : { hidden: {}, visible: {} };
    const stag = animEnabled ? stagger : { visible: {} };

    const typeColor = (t: string) => {
        switch (t) {
            case "internship": return "#3b82f6";
            case "job": return "#f59e0b";
            case "volunteer": return "#10b981";
            case "club": return "#a855f6";
            default: return accent;
        }
    };

    const leadershipColor = (t: string) => {
        switch (t) {
            case "club": return "#818cf8";
            case "academic": return "#f59e0b";
            case "volunteer": return "#10b981";
            case "competition": return "#f43f5e";
            default: return accent;
        }
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily }}>
            {/* Dynamic font import */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link rel="stylesheet" href={fontUrl} />
            <PortfolioNavbar data={data} />

            {/* ─── HERO ─── */}
            <section style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "120px 24px 80px", position: "relative",
            }}>
                {/* Background glows */}
                <div style={{ position: "absolute", width: "500px", height: "500px", top: "10%", left: "20%", background: `radial-gradient(circle, ${accent}10, transparent 70%)`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", width: "400px", height: "400px", bottom: "15%", right: "15%", background: `radial-gradient(circle, ${accent2}08, transparent 70%)`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

                <motion.div initial="hidden" animate="visible" variants={stagger} style={{ ...container, position: "relative", zIndex: 1 }}>
                    {/* Profile Image */}
                    {profileImg && (
                        <motion.div variants={fadeUp} style={{ marginBottom: "28px" }}>
                            <div style={{
                                width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto",
                                border: `3px solid ${accent}40`,
                                padding: "3px", background: `linear-gradient(135deg, ${accent}30, ${accent2}30)`,
                            }}>
                                <img
                                    src={profileImg}
                                    alt={profile.full_name}
                                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Status badge */}
                    <motion.div variants={fadeUp} style={{ marginBottom: "24px" }}>
                        <span className="pf-hero-pill" style={{
                            ...pill, background: `${accent}10`, border: `1px solid ${accent}20`, color: fgMuted, fontSize: "0.8rem",
                        }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent2, display: "inline-block", animation: "pulse 2s infinite" }} />
                            {profile.tagline || `${profile.degree || "Student"} | ${profile.university || ""}`}
                        </span>
                    </motion.div>

                    {/* Name */}
                    <motion.h1 variants={fadeUp} style={{
                        fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "20px",
                        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    } as React.CSSProperties}>
                        {profile.full_name}
                    </motion.h1>

                    {/* Education quick info */}
                    {(profile.degree || profile.university) && (
                        <motion.div variants={fadeUp} style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: "24px", flexWrap: "wrap", marginBottom: "24px",
                        }}>
                            {profile.degree && (
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", color: fgMuted, fontSize: "0.9rem" }}>
                                    <GraduationCap size={16} color={accent} /> {profile.degree}
                                </span>
                            )}
                            {profile.university && (
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", color: fgMuted, fontSize: "0.9rem" }}>
                                    <Building2 size={16} color={accent2} /> {profile.university}
                                </span>
                            )}
                        </motion.div>
                    )}

                    {/* Bio */}
                    {profile.bio && (
                        <motion.p variants={fadeUp} style={{
                            maxWidth: "680px", margin: "0 auto 32px", color: fgMuted,
                            fontSize: "1rem", lineHeight: 1.7, textAlign: "center",
                        }}>
                            {profile.bio}
                        </motion.p>
                    )}

                    {/* CTA Buttons */}
                    <motion.div variants={fadeUp} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "12px", flexWrap: "wrap", marginBottom: "20px",
                    }}>
                        {profile.email && (
                            <a href={`mailto:${profile.email}`} className="pf-cta-pill" style={{
                                ...pill, background: glassBg, border: `1px solid ${glassBorder}`, color: fgMuted,
                            }}>
                                <Mail size={16} /> {profile.email}
                            </a>
                        )}
                        {profile.github && (
                            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" style={{
                                ...pill, background: glassBg, border: `1px solid ${glassBorder}`, color: fgMuted,
                            }}>
                                <Github size={16} /> GitHub
                            </a>
                        )}
                        {profile.linkedin && (
                            <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" style={{
                                ...pill, background: glassBg, border: `1px solid ${glassBorder}`, color: fgMuted,
                            }}>
                                <Linkedin size={16} /> LinkedIn
                            </a>
                        )}
                    </motion.div>

                    {/* Resume Download Button */}
                    {profile.resume_url && (
                        <motion.div variants={fadeUp} style={{ marginBottom: "16px" }}>
                            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" style={{
                                ...pill, background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                color: "#fff", fontWeight: 600, fontSize: "0.9rem",
                                boxShadow: `0 4px 20px ${accent}30`,
                            }}>
                                <Download size={16} /> Download Resume
                            </a>
                        </motion.div>
                    )}

                    {/* Scroll */}
                    <motion.div
                        variants={fadeUp}
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ color: fgDim, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", marginTop: "40px" }}
                    >
                        SCROLL<br />
                        <ArrowDown size={16} style={{ marginTop: "6px" }} />
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── ABOUT ─── */}
            <section id="about" style={{ ...sectionPad, position: "relative" }}>
                <div style={container}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>About Me</motion.span>
                        <motion.h2 variants={fadeUp} style={sectionTitle}>Get to Know Me</motion.h2>
                        <motion.div variants={fadeUp} style={divider} />

                        <div className="pf-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "48px" }}>
                            {/* Bio Card */}
                            <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "32px", gridColumn: profileImg ? "span 1" : "span 2" }} {...cardHover(accent)}>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: fg, marginBottom: "16px" }}>👋 Hello, World!</h3>
                                <p style={{ color: fgMuted, lineHeight: 1.8, fontSize: "0.95rem" }}>
                                    {profile.bio || `Hi, I'm ${profile.full_name}. Welcome to my portfolio!`}
                                </p>
                            </motion.div>

                            {/* Profile Image in About (if exists) */}
                            {profileImg && (
                                <motion.div variants={fadeUp} style={{
                                    ...cardStyle, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center",
                                    background: `linear-gradient(135deg, ${accent}08, ${accent2}08)`,
                                }} {...cardHover(accent2)}>
                                    <img
                                        src={profileImg}
                                        alt={profile.full_name}
                                        style={{ width: "200px", height: "200px", borderRadius: "20px", objectFit: "cover" }}
                                        referrerPolicy="no-referrer"
                                    />
                                </motion.div>
                            )}

                            {/* Education Card */}
                            {(profile.degree || profile.university) && (
                                <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(accent2)}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div>
                                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "2px" }}>🎓 Education</span>
                                            <p style={{ color: fg, fontWeight: 600, fontSize: "1rem", marginTop: "8px" }}>{profile.degree}</p>
                                            <p style={{ color: fgMuted, fontSize: "0.85rem", marginTop: "4px" }}>{profile.university}</p>
                                        </div>
                                        {profile.graduation_year && (
                                            <div style={{ textAlign: "right", paddingLeft: "16px", borderLeft: `1px solid ${glassBorder}` }}>
                                                <span style={{
                                                    fontSize: "1.8rem", fontWeight: 900,
                                                    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                                } as React.CSSProperties}>{profile.graduation_year}</span>
                                                <p style={{ fontSize: "0.65rem", color: fgDim, textTransform: "uppercase", letterSpacing: "1px" }}>Expected</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Stats Grid */}
                            <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(accent)}>
                                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: accent2, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", display: "block" }}>📊 Quick Stats</span>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "12px" }}>
                                    {[
                                        { val: projects.length, label: "Projects" },
                                        { val: experiences.length, label: "Experiences" },
                                        { val: skills.reduce((a, s) => a + s.skills_list.length, 0), label: "Skills" },
                                    ].map(s => (
                                        <div key={s.label} style={{ textAlign: "center" }}>
                                            <p style={{
                                                fontSize: "1.8rem", fontWeight: 900,
                                                background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                            } as React.CSSProperties}>{s.val}</p>
                                            <p style={{ fontSize: "0.72rem", color: fgDim, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ DYNAMIC SECTIONS ═══════ */}
            {(() => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const sectionRenderers = React.useMemo(() => {
                    const renderers: Record<string, () => React.ReactNode> = {
                        about: () => null, // About is always rendered above

                        skills: () => skills.length > 0 ? (
                            <section id="skills" style={{ ...sectionPad, position: "relative" }}>
                                <div style={container}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Expertise</motion.span>
                                        <motion.h2 variants={fadeUp} style={sectionTitle}>Skills & Technologies</motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <div className="pf-skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "48px" }}>
                                            {skills.map((cat) => (
                                                <motion.div key={cat.category} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(accent)}>
                                                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: fg, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Code size={16} color={accent} />
                                                        {cat.category}
                                                    </h3>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                        {cat.skills_list.map(skill => (
                                                            <span key={skill} style={{
                                                                padding: "6px 14px", borderRadius: "100px", fontSize: "0.78rem",
                                                                background: `${accent}10`, border: `1px solid ${accent}20`, color: fgMuted,
                                                                transition: "all 0.2s ease",
                                                            }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        ) : null,

                        experience: () => experiences.length > 0 ? (
                            <section id="experience" style={{ ...sectionPad, position: "relative" }}>
                                <div style={container}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Experience</motion.span>
                                        <motion.h2 variants={fadeUp} style={sectionTitle}>Where I&apos;ve Worked</motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <div className="pf-exp-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "24px", marginTop: "48px" }}>
                                            {experiences.map((exp, i) => {
                                                const tc = typeColor(exp.type);
                                                return (
                                                    <motion.div key={`${exp.title}-${i}`} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(tc)}>
                                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                                                            <div style={{
                                                                padding: "12px", borderRadius: "14px",
                                                                background: `${tc}15`, border: `1px solid ${tc}25`, flexShrink: 0,
                                                            }}>
                                                                <Briefcase size={20} color={tc} />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                                                    <span style={{
                                                                        padding: "3px 10px", borderRadius: "100px", fontSize: "0.68rem", fontWeight: 600,
                                                                        background: `${tc}15`, border: `1px solid ${tc}30`, color: tc,
                                                                        textTransform: "capitalize",
                                                                    }}>{exp.type}</span>
                                                                    <span style={{ fontSize: "0.75rem", color: fgDim }}>
                                                                        {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                                                                    </span>
                                                                </div>
                                                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: fg }}>{exp.title}</h3>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                                                                    <Building2 size={14} color={accent2} />
                                                                    <span style={{ fontSize: "0.85rem", color: accent2 }}>{exp.company}</span>
                                                                    {exp.location && (
                                                                        <span style={{ fontSize: "0.75rem", color: fgDim, marginLeft: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                                            <MapPin size={12} /> {exp.location}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {exp.description_points.length > 0 && (
                                                            <ul style={{ paddingLeft: "16px", margin: 0, listStyle: "none" }}>
                                                                {exp.description_points.map((p, j) => (
                                                                    <li key={j} style={{ color: fgMuted, fontSize: "0.85rem", lineHeight: 1.7, position: "relative", paddingLeft: "16px", marginBottom: "4px" }}>
                                                                        <span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", background: tc }} />
                                                                        {p}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        ) : null,

                        projects: () => projects.length > 0 ? (
                            <section id="projects" style={{ ...sectionPad, position: "relative" }}>
                                <div style={container}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Portfolio</motion.span>
                                        <motion.h2 variants={fadeUp} style={sectionTitle}>Featured Projects</motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <div className="pf-projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", marginTop: "48px" }}>
                                            {projects.map((proj, i) => (
                                                <motion.div key={`${proj.title}-${i}`} variants={fadeUp} style={{ ...cardStyle, padding: "28px", position: "relative" }} {...cardHover(accent)}>
                                                    {proj.featured && (
                                                        <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                                                            <Star size={16} fill={accent} color={accent} />
                                                        </div>
                                                    )}
                                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: fg, marginBottom: "12px", paddingRight: proj.featured ? "32px" : "0" }}>
                                                        {proj.title}
                                                    </h3>
                                                    <p style={{ color: fgMuted, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "16px" }}>
                                                        {proj.description}
                                                    </p>
                                                    {proj.tech_stack.length > 0 && (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                                                            {proj.tech_stack.map(t => (
                                                                <span key={t} style={{
                                                                    padding: "4px 12px", borderRadius: "100px", fontSize: "0.72rem",
                                                                    background: `${accent2}10`, border: `1px solid ${accent2}20`, color: fgMuted,
                                                                }}>{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        {proj.repo_url && (
                                                            <a href={proj.repo_url} target="_blank" rel="noopener noreferrer" style={{
                                                                ...pill, padding: "6px 14px", background: glassBg, border: `1px solid ${glassBorder}`, color: fgMuted, fontSize: "0.78rem",
                                                            }}>
                                                                <Github size={14} /> Code
                                                            </a>
                                                        )}
                                                        {proj.live_url && (
                                                            <a href={proj.live_url} target="_blank" rel="noopener noreferrer" style={{
                                                                ...pill, padding: "6px 14px", background: `${accent}10`, border: `1px solid ${accent}25`, color: accent, fontSize: "0.78rem",
                                                            }}>
                                                                <ExternalLink size={14} /> Live Demo
                                                            </a>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        ) : null,

                        leadership: () => leadership.length > 0 ? (
                            <section id="leadership" style={{ ...sectionPad, position: "relative" }}>
                                <div style={container}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Leadership</motion.span>
                                        <motion.h2 variants={fadeUp} style={sectionTitle}>Making an Impact</motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <div className="pf-leadership-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", marginTop: "48px" }}>
                                            {leadership.map((role, i) => {
                                                const lc = leadershipColor(role.type);
                                                return (
                                                    <motion.div key={`${role.title}-${i}`} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(lc)}>
                                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
                                                            <div style={{
                                                                padding: "12px", borderRadius: "14px",
                                                                background: `${lc}15`, border: `1px solid ${lc}25`, flexShrink: 0,
                                                            }}>
                                                                <Trophy size={20} color={lc} />
                                                            </div>
                                                            <div>
                                                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: fg }}>{role.title}</h3>
                                                                <p style={{ fontSize: "0.9rem", color: lc, fontWeight: 500, margin: "2px 0 6px" }}>{role.organization}</p>
                                                            </div>
                                                        </div>
                                                        <p style={{ color: fgMuted, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "12px" }}>
                                                            {role.description}
                                                        </p>
                                                        {role.achievements.length > 0 && (
                                                            <ul style={{ paddingLeft: "16px", margin: 0, listStyle: "none" }}>
                                                                {role.achievements.map((a, j) => (
                                                                    <li key={j} style={{ color: fgMuted, fontSize: "0.8rem", lineHeight: 1.6, position: "relative", paddingLeft: "12px", marginBottom: "4px" }}>
                                                                        <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", background: lc }} />
                                                                        {a}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        ) : null,

                        education: () => education.length > 0 ? (
                            <section id="education" style={{ ...sectionPad, position: "relative" }}>
                                <div style={container}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Education</motion.span>
                                        <motion.h2 variants={fadeUp} style={sectionTitle}>Academic Background</motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "48px", maxWidth: "700px", margin: "48px auto 0" }}>
                                            {education.map((edu, i) => (
                                                <motion.div key={`${edu.institution}-${i}`} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }} {...cardHover(accent)}>
                                                    <div className="pf-edu-row" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                        <div style={{
                                                            padding: "14px", borderRadius: "16px",
                                                            background: `${accent}15`, border: `1px solid ${accent}25`,
                                                        }}>
                                                            <GraduationCap size={24} color={accent} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: fg }}>{edu.institution}</h3>
                                                            <p style={{ fontSize: "0.95rem", color: fgMuted, marginTop: "2px" }}>{edu.degree} in {edu.field}</p>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <span style={{
                                                                padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                                                                background: glassBg, border: `1px solid ${glassBorder}`, color: fg,
                                                            }}>
                                                                {edu.year}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        ) : null,

                        contact: () => (
                            <section id="contact" style={{ ...sectionPad, paddingBottom: "60px", position: "relative", minHeight: "60vh", display: "flex", alignItems: "center" }}>
                                <div style={{ ...container, textAlign: "center", width: "100%" }}>
                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                        <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>Get in Touch</motion.span>
                                        <motion.h2 variants={fadeUp} style={{ ...sectionTitle, fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                                            Let&apos;s Connect
                                        </motion.h2>
                                        <motion.div variants={fadeUp} style={divider} />
                                        <motion.p variants={fadeUp} style={{ color: fgMuted, maxWidth: "500px", margin: "24px auto 36px", lineHeight: 1.6 }}>
                                            I&apos;m always open to new opportunities, collaborations, and conversations.
                                        </motion.p>
                                        <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                                            {profile.email && (
                                                <a href={`mailto:${profile.email}`} style={{
                                                    ...pill, background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                                    color: "#fff", fontWeight: 600, padding: "12px 28px", fontSize: "1rem",
                                                    boxShadow: `0 8px 30px ${accent}40`,
                                                }}>
                                                    <Mail size={18} /> Say Hello
                                                </a>
                                            )}
                                            {profile.linkedin && (
                                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" style={{
                                                    ...pill, background: glassBg, border: `1px solid ${glassBorder}`, color: fg, padding: "12px 28px", fontSize: "1rem",
                                                }}>
                                                    <Linkedin size={18} /> LinkedIn
                                                </a>
                                            )}
                                            {profile.github && (
                                                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" style={{
                                                    ...pill, background: glassBg, border: `1px solid ${glassBorder}`, color: fg, padding: "12px 28px", fontSize: "1rem",
                                                }}>
                                                    <Github size={18} /> GitHub
                                                </a>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </section>
                        ),
                    };
                    return renderers;
                }, [skills, experiences, projects, leadership, education, profile, accent, accent2, fg, fgMuted, fgDim, sectionPad, sectionLabel, sectionTitle, cardStyle, divider, typeColor, leadershipColor, glassBg, glassBorder, pill]);

                /* ── Custom Section Renderer ── */
                const renderCustomSection = (cs: CustomSectionType) => (
                    <section key={cs.id} id={cs.id} style={{ ...sectionPad, position: "relative" }}>
                        <div style={container}>
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                                <motion.span variants={fadeUp} style={{ ...sectionLabel, color: accent }}>
                                    {cs.title}
                                </motion.span>
                                <motion.h2 variants={fadeUp} style={sectionTitle}>{cs.title}</motion.h2>
                                <motion.div variants={fadeUp} style={divider} />

                                <div style={{ marginTop: "48px" }}>
                                    {cs.type === "text" && (
                                        <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "32px", fontSize: "1rem", color: fgMuted, lineHeight: 1.8 }} {...cardHover(accent)}>
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ ...props }) => <a {...props} style={{ color: accent, textDecoration: "underline" }} target="_blank" rel="noreferrer" />,
                                                    h3: ({ ...props }) => <h3 {...props} style={{ color: fg, fontSize: "1.2rem", fontWeight: 700, margin: "24px 0 16px" }} />,
                                                    ul: ({ ...props }) => <ul {...props} style={{ paddingLeft: "20px", margin: "16px 0" }} />,
                                                    li: ({ ...props }) => <li {...props} style={{ marginBottom: "8px" }} />,
                                                    p: ({ ...props }) => <p {...props} style={{ marginBottom: "16px" }} />,
                                                }}
                                            >
                                                {cs.content}
                                            </ReactMarkdown>
                                        </motion.div>
                                    )}

                                    {cs.type === "list" && (
                                        <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "32px" }} {...cardHover(accent)}>
                                            <ul style={{ paddingLeft: "0", margin: 0, listStyle: "none" }}>
                                                {cs.items.map((item, j) => {
                                                    const isObj = typeof item === "object";
                                                    const text = isObj ? item.title : item;
                                                    const desc = isObj ? item.description : null;
                                                    const url = isObj ? item.url : null;

                                                    return (
                                                        <li key={j} style={{ color: fgMuted, fontSize: "0.95rem", lineHeight: 1.8, position: "relative", paddingLeft: "24px", marginBottom: "16px" }}>
                                                            <span style={{ position: "absolute", left: 0, top: "10px", width: "6px", height: "6px", borderRadius: "50%", background: accent }} />
                                                            {url ? (
                                                                <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontWeight: 500, textDecoration: "none" }}>
                                                                    {text}
                                                                </a>
                                                            ) : (
                                                                <span style={{ color: fg, fontWeight: 500 }}>{text}</span>
                                                            )}
                                                            {desc && (
                                                                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.8 }}>{desc}</p>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {cs.type === "grid" && (
                                        <div className="pf-custom-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                            {cs.items.map((item, j) => {
                                                const isObj = typeof item === "object";
                                                const text = isObj ? item.title : item;
                                                const desc = isObj ? item.description : null;
                                                const url = isObj ? item.url : null;

                                                return (
                                                    <motion.div key={j} variants={fadeUp} style={{ ...cardStyle, padding: "24px", textAlign: "left" }} {...cardHover(accent)}>
                                                        {url ? (
                                                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
                                                                <h4 style={{ color: accent, fontSize: "1.05rem", fontWeight: 700, marginBottom: desc ? "8px" : "0" }}>{text} <ExternalLink size={12} style={{ verticalAlign: "middle" }} /></h4>
                                                            </a>
                                                        ) : (
                                                            <h4 style={{ color: fg, fontSize: "1.05rem", fontWeight: 700, marginBottom: desc ? "8px" : "0" }}>{text}</h4>
                                                        )}
                                                        {desc && <p style={{ color: fgMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                );

                // Main render loop
                return sectionOrder.map(id => {
                    if (hiddenSections.includes(id)) return null;

                    // 1. Built-in section?
                    if (sectionRenderers[id]) {
                        return <React.Fragment key={id}>{sectionRenderers[id]()}</React.Fragment>;
                    }

                    // 2. Custom section?
                    const custom = customSections.find(s => s.id === id);
                    if (custom && custom.visible) {
                        return <React.Fragment key={id}>{renderCustomSection(custom)}</React.Fragment>;
                    }

                    return null;
                });
            })()}

            {/* ─── FOOTER ─── */}
            <footer style={{
                textAlign: "center",
                padding: "40px 24px",
                borderTop: `1px solid ${glassBorder}`,
                background: "rgba(0,0,0,0.2)",
            }}>
                <p style={{ color: fgDim, fontSize: "0.9rem" }}>
                    © {new Date().getFullYear()} {profile.full_name}. Built with PortfolioHub.
                </p>
            </footer>

            <BackToTop />

            {/* Global animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                }
                @media (max-width: 768px) {
                    .pf-about-grid { grid-template-columns: 1fr !important; }
                    .pf-about-grid > * { grid-column: span 1 !important; }
                    .pf-skills-grid { grid-template-columns: 1fr !important; }
                    .pf-exp-grid { grid-template-columns: 1fr !important; }
                    .pf-projects-grid { grid-template-columns: 1fr !important; }
                    .pf-leadership-grid { grid-template-columns: 1fr !important; }
                    .pf-custom-grid { grid-template-columns: 1fr !important; }
                    .pf-edu-row { flex-wrap: wrap !important; gap: 12px !important; }
                    .pf-hero-pill { max-width: 100%; text-align: center; word-break: break-word; }
                    .pf-cta-pill { word-break: break-all; font-size: 0.78rem !important; padding: 8px 14px !important; }
                }
            `}</style>
        </div>
    );
}
