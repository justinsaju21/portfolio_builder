"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
    ArrowDown, Mail, Github, Linkedin, MapPin, Calendar, Building2, Briefcase,
    ExternalLink, GraduationCap, Star, Code, FolderOpen, BookOpen, MessageSquare,
    Menu, X, User, Download, Trophy, Users, Award, Zap, Globe, Heart, Layers,
    Sun, Moon, Target, FileText, UserCheck
} from "lucide-react";
import { PortfolioData, CustomSection as CustomSectionType } from "@/lib/types";
import { BackToTop } from "@/components/ui/BackToTop";

// Dynamic Section Renderers
import {
    HackathonSection, ResearchSection, EntrepreneurshipSection, CertificationSection,
    ExamSection, SportsCulturalSection, VolunteeringSection, ScholarshipSection,
    ClubActivitySection, DeptContributionSection, ProfessionalMembershipSection, ReferenceSection
} from "./SectionRenderers";

/* ─── Icon Map ─── */
const ICON_MAP: Record<string, React.ElementType> = {
    User, Code, Briefcase, FolderOpen, Trophy, BookOpen, MessageSquare,
    Star, Heart, Zap, Globe, Award, Users, Layers, Calendar, MapPin,
    Building2, ExternalLink, GraduationCap, Download, Menu, X, Mail, Github, Linkedin,
    Target, FileText, UserCheck
};

/* ─── Constants & Styles ─── */
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const FONT_MAP: Record<string, string> = {
    inter: "'Inter', sans-serif", playfair: "'Playfair Display', serif", space_grotesk: "'Space Grotesk', sans-serif",
    jetbrains: "'JetBrains Mono', monospace", outfit: "'Outfit', sans-serif", roboto: "'Roboto', sans-serif",
    "open sans": "'Open Sans', sans-serif", lora: "'Lora', serif", "dm serif display": "'DM Serif Display', serif",
};
const FONT_URLS: Record<string, string> = {
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    playfair: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap",
    space_grotesk: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    jetbrains: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap",
    outfit: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap",
    roboto: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    "open sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
    lora: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
    "dm serif display": "https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&display=swap",
};

import { PORTFOLIO_THEMES } from "@/lib/themes";

/* ─── Helpers ─── */
function getImageUrl(url: string | undefined): string | null {
    if (!url) return null;
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    if (url.startsWith("http")) return url;
    return null;
}

function getCardStyle(style: string, theme: any) {
    if (style === "solid") return { background: theme.cardBg, border: `1px solid ${theme.glassBorder}`, borderRadius: "20px" };
    if (style === "outline") return { background: "transparent", border: `2px solid ${theme.glassBorder}`, borderRadius: "20px" };
    return { background: theme.glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${theme.glassBorder}`, borderRadius: "20px" };
}

/* ─── Components ─── */
const SectionWrapper = ({ id, label, title, children, accent, dividerStyle }: any) => (
    <section id={id} style={{ padding: "80px 24px", position: "relative" }}>
        <div className="portfolio-container" style={{ margin: "0 auto", maxWidth: "1100px" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
                {label && <motion.span variants={fadeUp} style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "12px", display: "block", color: accent }}>{label}</motion.span>}
                {title && <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2 }}>{title}</motion.h2>}
                {title && <motion.div variants={fadeUp} style={dividerStyle} />}
                <div style={{ marginTop: "48px" }}>
                    {children}
                </div>
            </motion.div>
        </div>
    </section>
);

/* ─── Main Component ─── */
export function PortfolioView({ data }: { data: PortfolioData }) {
    const { profile, experiences, projects, skills, education, leadership, customSections, sectionOrder, hiddenSections } = data;
    const profileImg = getImageUrl(profile.profile_image);

    // Theme Resolution
    // Use the profile's selected theme ID, defaulting to 'dark' if invalid or missing
    const themeId = profile.color_theme || "dark";
    const themeBase = PORTFOLIO_THEMES[themeId] || PORTFOLIO_THEMES.dark;
    const currentTheme = themeId;

    // We strictly use the selected theme, no toggling allowed on public view.
    // Backward compatibility: If no theme ID (old profiles), it might fall back to dark logic
    // but the dashboard rewrite ensures new saves have IDs.

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Resolved Theme Colors
    // Resolved Theme Colors
    const accent = profile.primary_color || themeBase.textDim;
    const accent2 = profile.secondary_color || themeBase.textMuted;

    // ─── Theme Values ───
    // ─── Theme Values ───
    const theme = {
        bg: themeBase.bg,
        surface: themeBase.surface,
        textPrimary: themeBase.textPrimary,
        textMuted: themeBase.textMuted,
        textDim: themeBase.textDim,
        glassBg: themeBase.glassBg,
        glassBorder: themeBase.glassBorder,
        cardBg: themeBase.cardBg,
        navBg: themeBase.navBg,
    };

    // Fonts & Styles
    const headingFont = FONT_MAP[profile.heading_font?.toLowerCase() || "inter"] || FONT_MAP.inter;
    const bodyFont = FONT_MAP[profile.body_font?.toLowerCase() || "inter"] || FONT_MAP.inter;
    const headingFontUrl = FONT_URLS[profile.heading_font?.toLowerCase() || "inter"] || FONT_URLS.inter;
    const bodyFontUrl = FONT_URLS[profile.body_font?.toLowerCase() || "inter"] || FONT_URLS.inter;
    const cardStyle = getCardStyle(profile.card_style || "glass", theme);
    const divider = { width: "60px", height: "3px", borderRadius: "8px", background: `linear-gradient(90deg, ${accent}, ${accent2})`, margin: "16px auto 0" };

    // --- Data Pre-processing ---
    // Extract Nav Links
    const navLinks = sectionOrder.filter(id => {
        if (hiddenSections.includes(id)) return false;
        if (id === "about" || id === "contact") return true;
        if (id === "blog") return !!profile.rss_url;
        if (Array.isArray((data as any)[id]) && ((data as any)[id] as any[]).length === 0) return false;
        return true;
    }).map(id => {
        const labels: Record<string, string> = { about: "About", experience: "Experience", projects: "Projects", skills: "Skills", education: "Education", leadership: "Leadership", contact: "Contact", blog: "Blog" };
        const label = labels[id] || customSections.find(s => s.id === id)?.title;
        // Always return an object
        if (!label && id in data) return { id, label: id.charAt(0).toUpperCase() + id.slice(1).replace('_', ' ') };
        return { id, label: label || id };
    }).filter(l => l.label);

    // Blog fetch
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    useEffect(() => {
        if (profile.rss_url) {
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(profile.rss_url)}`)
                .then(res => res.json()).then(d => d.items && setBlogPosts(d.items.slice(0, 3))).catch(console.error);
        }
    }, [profile.rss_url]);

    // Renderers for Built-in Sections
    const renderers: Record<string, () => React.ReactNode> = {
        about: () => (
            <SectionWrapper id="about" label="About Me" title="Get to Know Me" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "start" }}>
                    <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "32px", gridColumn: profileImg ? "span 1" : "span 2" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "16px" }}>👋 Hello, World!</h3>
                        <p style={{ color: theme.textMuted, lineHeight: 1.8, fontSize: "0.95rem" }}>
                            {profile.bio || `Hi, I'm ${profile.full_name}. Welcome to my portfolio!`}
                        </p>
                    </motion.div>
                    {profileImg && (
                        <motion.div variants={fadeUp} style={{ ...cardStyle, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${accent}08, ${accent2}08)` }}>
                            <img src={profileImg} alt={profile.full_name} style={{ width: "200px", height: "200px", borderRadius: "20px", objectFit: "cover" }} />
                        </motion.div>
                    )}
                </div>
            </SectionWrapper>
        ),
        skills: () => skills.length ? (
            <SectionWrapper id="skills" label="Expertise" title="Skills & Technologies" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {skills.map(cat => (
                        <motion.div key={cat.category} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Code size={16} color={accent} /> {cat.category}
                            </h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {cat.skills_list.map(s => (
                                    <span key={s} style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "0.78rem", background: `${accent}10`, border: `1px solid ${accent}20`, color: theme.textMuted }}>{s}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,
        experience: () => experiences.length ? (
            <SectionWrapper id="experience" label="Experience" title="Where I've Worked" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "24px" }}>
                    {experiences.map((exp, i) => (
                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: theme.textPrimary }}>{exp.title}</h3>
                            <div style={{ display: "flex", gap: "10px", marginTop: "4px", fontSize: "0.9rem", color: accent2 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building2 size={14} /> {exp.company}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}</span>
                            </div>
                            <ul style={{ marginTop: "16px", paddingLeft: "16px", color: theme.textMuted }}>
                                {exp.description_points.map((p, j) => <li key={j} style={{ marginBottom: "6px", lineHeight: 1.6 }}>{p}</li>)}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,
        projects: () => projects.length ? (
            <SectionWrapper id="projects" label="Portfolio" title="Featured Projects" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {projects.map((proj, i) => (
                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "28px", position: "relative" }}>
                            {proj.featured && <div style={{ position: "absolute", top: 16, right: 16 }}><Star size={16} color={accent} fill={accent} /></div>}
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "12px" }}>{proj.title}</h3>
                            <p style={{ fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.6, marginBottom: "16px" }}>{proj.description}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                                {proj.tech_stack.map(t => <span key={t} style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "100px", background: `${accent2}10`, color: theme.textMuted }}>{t}</span>)}
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                {proj.repo_url && <a href={proj.repo_url} target="_blank" style={{ fontSize: "0.85rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: 6 }}><Github size={14} /> Code</a>}
                                {proj.live_url && <a href={proj.live_url} target="_blank" style={{ fontSize: "0.85rem", color: accent, display: "flex", alignItems: "center", gap: 6 }}><ExternalLink size={14} /> Live Demo</a>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,
        leadership: () => leadership.length ? (
            <SectionWrapper id="leadership" label="Leadership" title="Making an Impact" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {leadership.map((role, i) => (
                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "28px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary }}>{role.title}</h3>
                            <p style={{ color: accent, fontWeight: 500, fontSize: "0.9rem", margin: "4px 0 12px" }}>{role.organization}</p>
                            <p style={{ color: theme.textMuted, fontSize: "0.9rem", lineHeight: 1.6 }}>{role.description}</p>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,
        education: () => education.length ? (
            <SectionWrapper id="education" label="Education" title="Academic Background" accent={accent} dividerStyle={divider}>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
                    {education.map((edu, i) => (
                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "28px", display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{ padding: "12px", background: `${accent}15`, borderRadius: "12px", color: accent }}><GraduationCap size={24} /></div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary }}>{edu.institution}</h3>
                                <p style={{ color: theme.textMuted, fontSize: "0.95rem" }}>{edu.degree} in {edu.field}</p>
                            </div>
                            <span style={{ fontWeight: 600, color: accent }}>{edu.year}</span>
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,
        contact: () => (
            <SectionWrapper id="contact" label="Get in Touch" title="Let's Connect" accent={accent} dividerStyle={divider}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ color: theme.textMuted, maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 }}>I&apos;m always open to new opportunities, collaborations, and conversations.</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                        {profile.email && <a href={`mailto:${profile.email}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: "100px", background: accent, color: "white", fontWeight: 600, textDecoration: "none" }}><Mail size={18} /> Say Hello</a>}
                    </div>
                </div>
            </SectionWrapper>
        ),
        blog: () => blogPosts.length ? (
            <SectionWrapper id="blog" label="Articles" title="Latest Posts" accent={accent} dividerStyle={divider}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                    {blogPosts.map((post, i) => (
                        <motion.a key={i} href={post.link} target="_blank" variants={fadeUp} style={{ ...cardStyle, padding: "24px", display: "block", textDecoration: "none" }}>
                            {post.thumbnail && <img src={post.thumbnail} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "12px", marginBottom: "16px" }} />}
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "8px" }}>{post.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: theme.textMuted }}>{new Date(post.pubDate).toLocaleDateString()}</p>
                        </motion.a>
                    ))}
                </div>
            </SectionWrapper>
        ) : null,

        // ─── NEW SECTIONS ───
        hackathons: () => data.hackathons?.length ? (
            <SectionWrapper id="hackathons" label="Innovations" title="Hackathons" accent={accent} dividerStyle={divider}>
                <HackathonSection data={data.hackathons} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        research: () => data.research?.length ? (
            <SectionWrapper id="research" label="Academic" title="Research Publications" accent={accent} dividerStyle={divider}>
                <ResearchSection data={data.research} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        entrepreneurship: () => data.entrepreneurship?.length ? (
            <SectionWrapper id="entrepreneurship" label="Ventures" title="Entrepreneurship" accent={accent} dividerStyle={divider}>
                <EntrepreneurshipSection data={data.entrepreneurship} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        certifications: () => data.certifications?.length ? (
            <SectionWrapper id="certifications" label="Credentials" title="Certifications" accent={accent} dividerStyle={divider}>
                <CertificationSection data={data.certifications} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        exams: () => data.exams?.length ? (
            <SectionWrapper id="exams" label="Achievements" title="Competitive Exams" accent={accent} dividerStyle={divider}>
                <ExamSection data={data.exams} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        sports_cultural: () => data.sports_cultural?.length ? (
            <SectionWrapper id="sports_cultural" label="Extra-Curricular" title="Sports & Cultural" accent={accent} dividerStyle={divider}>
                <SportsCulturalSection data={data.sports_cultural} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        volunteering: () => data.volunteering?.length ? (
            <SectionWrapper id="volunteering" label="Community" title="Volunteering" accent={accent} dividerStyle={divider}>
                <VolunteeringSection data={data.volunteering} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        scholarships: () => data.scholarships?.length ? (
            <SectionWrapper id="scholarships" label="Awards" title="Scholarships" accent={accent} dividerStyle={divider}>
                <ScholarshipSection data={data.scholarships} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        club_activities: () => data.club_activities?.length ? (
            <SectionWrapper id="club_activities" label="Campus Life" title="Club Activities" accent={accent} dividerStyle={divider}>
                <ClubActivitySection data={data.club_activities} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        dept_contributions: () => data.dept_contributions?.length ? (
            <SectionWrapper id="dept_contributions" label="Service" title="Department Contributions" accent={accent} dividerStyle={divider}>
                <DeptContributionSection data={data.dept_contributions} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        professional_memberships: () => data.professional_memberships?.length ? (
            <SectionWrapper id="professional_memberships" label="Network" title="Memberships" accent={accent} dividerStyle={divider}>
                <ProfessionalMembershipSection data={data.professional_memberships} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
        references: () => data.references?.length ? (
            <SectionWrapper id="references" label="Endorsements" title="References" accent={accent} dividerStyle={divider}>
                <ReferenceSection data={data.references} theme={theme} accent={accent} accent2={accent2} />
            </SectionWrapper>
        ) : null,
    };

    return (
        <div style={{ minHeight: "100vh", fontFamily: bodyFont, background: theme.bg, color: theme.textPrimary }}>
            <link rel="stylesheet" href={headingFontUrl} />
            {headingFontUrl !== bodyFontUrl && <link rel="stylesheet" href={bodyFontUrl} />}
            <style dangerouslySetInnerHTML={{ __html: `:root { --background: ${theme.bg}; --foreground: ${theme.textPrimary}; } ${profile.custom_css || ""}` }} />

            {/* Navbar */}
            <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 24px", background: "transparent" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 24px", borderRadius: "100px", background: theme.navBg, backdropFilter: "blur(20px)", border: `1px solid ${theme.glassBorder}` }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{profile.full_name?.split(" ")[0] || "Portfolio"}</h3>

                    {/* Desktop Nav */}
                    <div className="desktop-nav" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {/* Direct Links */}
                        {["about", "experience", "projects", "skills"].map(id => {
                            if (hiddenSections.includes(id)) return null;
                            if (id === "skills" && !skills.length) return null;
                            if (id === "experience" && !experiences.length) return null;
                            if (id === "projects" && !projects.length) return null;
                            return (
                                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: theme.textPrimary, fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: "8px", transition: "background 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = `${accent}15`}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </button>
                            );
                        })}

                        {/* Dropdown Groups */}
                        {/* Academic Group */}
                        {(education.length > 0 || data.research?.length > 0 || data.certifications?.length > 0 || data.scholarships?.length > 0) && (
                            <div style={{ position: "relative" }} className="group">
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: theme.textPrimary, fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: 4 }}>
                                    Academic <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>▼</span>
                                </button>
                                <div className="dropdown-menu" style={{
                                    position: "absolute", top: "100%", right: 0, paddingTop: 12, display: "none", flexDirection: "column", minWidth: 160
                                }}>
                                    <div style={{ background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.glassBorder}`, overflow: "hidden", padding: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                                        {education.length > 0 && <button onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Education</button>}
                                        {data.research?.length > 0 && <button onClick={() => document.getElementById("research")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Research</button>}
                                        {data.certifications?.length > 0 && <button onClick={() => document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Certifications</button>}
                                        {data.scholarships?.length > 0 && <button onClick={() => document.getElementById("scholarships")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Scholarships</button>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Achievements Group */}
                        {(data.hackathons?.length > 0 || data.entrepreneurship?.length > 0 || data.exams?.length > 0 || data.sports_cultural?.length > 0) && (
                            <div style={{ position: "relative" }} className="group">
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: theme.textPrimary, fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: 4 }}>
                                    Achievements <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>▼</span>
                                </button>
                                <div className="dropdown-menu" style={{
                                    position: "absolute", top: "100%", right: 0, paddingTop: 12, display: "none", flexDirection: "column", minWidth: 160
                                }}>
                                    <div style={{ background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.glassBorder}`, overflow: "hidden", padding: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                                        {data.hackathons?.length > 0 && <button onClick={() => document.getElementById("hackathons")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Hackathons</button>}
                                        {data.entrepreneurship?.length > 0 && <button onClick={() => document.getElementById("entrepreneurship")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Ventures</button>}
                                        {data.exams?.length > 0 && <button onClick={() => document.getElementById("exams")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Exams</button>}
                                        {data.sports_cultural?.length > 0 && <button onClick={() => document.getElementById("sports_cultural")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Sports & Cultural</button>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leadership Group */}
                        {(leadership.length > 0 || data.volunteering?.length > 0 || data.club_activities?.length > 0 || data.professional_memberships?.length > 0) && (
                            <div style={{ position: "relative" }} className="group">
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: theme.textPrimary, fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: 4 }}>
                                    Leadership <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>▼</span>
                                </button>
                                <div className="dropdown-menu" style={{
                                    position: "absolute", top: "100%", right: -20, paddingTop: 12, display: "none", flexDirection: "column", minWidth: 160
                                }}>
                                    <div style={{ background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.glassBorder}`, overflow: "hidden", padding: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                                        {leadership.length > 0 && <button onClick={() => document.getElementById("leadership")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Leadership</button>}
                                        {data.club_activities?.length > 0 && <button onClick={() => document.getElementById("club_activities")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Clubs</button>}
                                        {data.volunteering?.length > 0 && <button onClick={() => document.getElementById("volunteering")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Volunteering</button>}
                                        {data.professional_memberships?.length > 0 && <button onClick={() => document.getElementById("professional_memberships")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: "0.85rem", fontWeight: 500, borderRadius: 8 }} onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.color = theme.textPrimary }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted }}>Memberships</button>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ background: accent, border: "none", cursor: "pointer", color: "white", fontSize: "0.85rem", fontWeight: 600, padding: "8px 18px", borderRadius: "100px", marginLeft: 8 }}>Contact</button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-only-btn" style={{ display: "none", background: "none", border: "none", color: theme.textPrimary, cursor: "pointer" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        style={{ position: "fixed", inset: 0, zIndex: 49, background: theme.bg, paddingTop: "100px", paddingInline: "24px", overflowY: "auto" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {["about", "experience", "projects", "skills"].map(id => {
                                if (hiddenSections.includes(id)) return null;
                                if (id === "skills" && !skills.length) return null;
                                return (
                                    <button key={id} onClick={() => { setMobileMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}
                                        style={{ background: "none", border: "none", cursor: "pointer", color: theme.textPrimary, fontSize: "1.5rem", fontWeight: 700, textAlign: "left" }}>
                                        {id.charAt(0).toUpperCase() + id.slice(1)}
                                    </button>
                                );
                            })}

                            {/* Academic Group Mobile */}
                            {(education.length > 0 || data.research?.length > 0) && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <h4 style={{ color: accent, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 2 }}>Academic</h4>
                                    {education.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("education")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Education</button>}
                                    {data.research?.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("research")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Research</button>}
                                    {data.certifications?.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Certifications</button>}
                                </div>
                            )}

                            {/* Achievements Group Mobile */}
                            {(data.hackathons?.length > 0 || data.entrepreneurship?.length > 0) && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <h4 style={{ color: accent, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 2 }}>Achievements</h4>
                                    {data.hackathons?.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("hackathons")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Hackathons</button>}
                                    {data.entrepreneurship?.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("entrepreneurship")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Ventures</button>}
                                </div>
                            )}

                            {/* Leadership Group Mobile */}
                            {(leadership.length > 0 || data.volunteering?.length > 0) && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <h4 style={{ color: accent, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 2 }}>Leadership</h4>
                                    {leadership.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("leadership")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Leadership</button>}
                                    {data.volunteering?.length > 0 && <button onClick={() => { setMobileMenuOpen(false); document.getElementById("volunteering")?.scrollIntoView({ behavior: "smooth" }) }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", textAlign: "left" }}>Volunteering</button>}
                                </div>
                            )}

                            <button onClick={() => { setMobileMenuOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                                style={{ background: accent, border: "none", cursor: "pointer", color: "white", fontSize: "1.2rem", fontWeight: 700, padding: "16px", borderRadius: "12px", marginTop: 20 }}>
                                Contact Me
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", padding: "120px 24px" }}>
                <div style={{ position: "absolute", top: "20%", left: "20%", width: "400px", height: "400px", background: `radial-gradient(${accent}15, transparent 70%)`, filter: "blur(60px)", borderRadius: "50%" }} />
                <motion.div initial="hidden" animate="visible" variants={stagger} style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
                    {/* Status Badge */}
                    {profile.status_badge && profile.status_badge !== 'none' && (
                        <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "8px 20px", borderRadius: "100px",
                                background: profile.status_badge === 'hiring' ? 'rgba(16, 185, 129, 0.1)' : `${accent}15`,
                                border: `1px solid ${profile.status_badge === 'hiring' ? '#10b981' : accent}`,
                                color: profile.status_badge === 'hiring' ? '#10b981' : accent,
                                fontSize: "0.9rem", fontWeight: 600,
                            }}>
                                <span style={{ position: "relative", display: "flex", height: 8, width: 8 }}>
                                    <span style={{ position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "50%", background: "currentColor", opacity: 0.75, animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" }}></span>
                                    <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: 8, width: 8, background: "currentColor" }}></span>
                                </span>
                                {profile.status_badge === 'open_to_work' ? 'Open to Work' : profile.status_badge === 'freelance' ? 'Available for Freelance' : 'Hiring Now'}
                            </div>
                        </motion.div>
                    )}

                    {profileImg && (
                        <motion.div variants={fadeUp} style={{ margin: "0 auto 32px", width: "160px", height: "160px", padding: "4px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
                            <img src={profileImg} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `4px solid ${theme.bg}` }} />
                        </motion.div>
                    )}
                    <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "20px", background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {profile.full_name}
                    </motion.h1>

                    {/* Education Info */}
                    {(profile.degree || profile.university) && (
                        <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "24px", color: theme.textMuted }}>
                            {profile.degree && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><GraduationCap size={16} color={accent} /> {profile.degree}</span>}
                            {profile.university && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Building2 size={16} color={accent2} /> {profile.university}</span>}
                        </motion.div>
                    )}

                    {profile.tagline && <motion.p variants={fadeUp} style={{ fontSize: "1.2rem", color: theme.textMuted, marginBottom: "24px" }}>{profile.tagline}</motion.p>}
                    <motion.div variants={fadeUp} style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        {profile.resume_url && <a href={profile.resume_url} target="_blank" style={{ padding: "12px 28px", borderRadius: "100px", background: accent, color: "white", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Download size={18} /> Resume</a>}
                        {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" style={{ padding: "12px", borderRadius: "50%", background: theme.glassBg, border: `1px solid ${theme.glassBorder}`, color: theme.textMuted }}><Github size={20} /></a>}
                        {profile.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" style={{ padding: "12px", borderRadius: "50%", background: theme.glassBg, border: `1px solid ${theme.glassBorder}`, color: theme.textMuted }}><Linkedin size={20} /></a>}
                    </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 1, duration: 2, repeat: Infinity }} style={{ position: "absolute", bottom: "40px", width: "100%", textAlign: "center", color: theme.textDim }}>
                    <ArrowDown size={20} />
                </motion.div>
            </section>

            {/* Render Sections */}
            {sectionOrder.map(id => {
                if (hiddenSections.includes(id)) return null;
                if (renderers[id]) return <React.Fragment key={id}>{renderers[id]()}</React.Fragment>;

                // Custom sections
                const custom = customSections.find(s => s.id === id);
                if (custom?.visible && custom.title) {
                    return (
                        <SectionWrapper key={id} id={id} title={custom.title} accent={accent} dividerStyle={divider}>
                            {custom.type === "text" && (
                                <div style={{ color: theme.textMuted, lineHeight: 1.7 }}>
                                    <ReactMarkdown components={{
                                        a: ({ node, ...props }) => <a {...props} style={{ color: accent, textDecoration: "underline", fontWeight: 500 }} target="_blank" rel="noopener noreferrer" />,
                                        strong: ({ node, ...props }) => <strong {...props} style={{ color: theme.textPrimary, fontWeight: 700 }} />,
                                    }}>{custom.content}</ReactMarkdown>
                                </div>
                            )}

                            {custom.type === "list" && custom.items?.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    {custom.items.map((item: any, i: number) => (
                                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "4px" }}>{typeof item === 'string' ? item : item.title}</h3>
                                                {typeof item !== 'string' && item.description && <p style={{ fontSize: "0.9rem", color: theme.textMuted }}>{item.description}</p>}
                                            </div>
                                            {typeof item !== 'string' && item.url && (
                                                <a href={item.url} target="_blank" rel="noopener" style={{ padding: "10px", borderRadius: "50%", background: `${accent}15`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {custom.type === "grid" && custom.items?.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                                    {custom.items.map((item: any, i: number) => (
                                        <motion.div key={i} variants={fadeUp} style={{ ...cardStyle, padding: "24px" }}>
                                            <div style={{ marginBottom: "12px", width: "40px", height: "40px", borderRadius: "10px", background: `${accent2}15`, display: "flex", alignItems: "center", justifyContent: "center", color: accent2 }}>
                                                {ICON_MAP[custom.icon] ? React.createElement(ICON_MAP[custom.icon], { size: 20 }) : <Star size={20} />}
                                            </div>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "8px" }}>{typeof item === 'string' ? item : item.title}</h3>
                                            {typeof item !== 'string' && item.description && <p style={{ fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.6, marginBottom: "16px" }}>{item.description}</p>}
                                            {typeof item !== 'string' && item.url && (
                                                <a href={item.url} target="_blank" rel="noopener" style={{ fontSize: "0.85rem", color: accent, fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                                                    View Details <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </SectionWrapper>
                    );
                }
                return null;
            })}

            <footer style={{ textAlign: "center", padding: "60px 24px", color: theme.textDim, fontSize: "0.9rem", borderTop: `1px solid ${theme.glassBorder}` }}>
                <p>&copy; {new Date().getFullYear()} {profile.full_name}. Built with <a href="#" style={{ color: accent, textDecoration: "none" }}>PortfolioHub</a>.</p>
            </footer>
            <BackToTop />
        </div>
    );
}
