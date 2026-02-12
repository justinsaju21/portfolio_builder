"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Sparkles, User, Briefcase, FolderOpen, Code, GraduationCap,
    LogOut, Eye, Download, Save, Menu, X, Trophy, Image as ImageIcon,
    FileText, Check, Plus, Trash2, ChevronDown, ChevronUp, Star, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton, DashboardSkeleton } from "@/components/ui/Skeleton";

/* ─── TYPES ─── */
type TabType = "profile" | "experience" | "projects" | "skills" | "education" | "leadership" | "appearance";

interface ProfileData {
    full_name: string; tagline: string; bio: string; email: string;
    github: string; linkedin: string; degree: string; university: string;
    graduation_year: string; profile_image: string; resume_url: string;
    primary_color: string; secondary_color: string; font_choice: string;
    card_style: string; animation_enabled: boolean;
}
interface ExperienceItem {
    title: string; company: string; location: string; start_date: string;
    end_date: string; is_current: boolean; description_points: string[]; type: string;
}
interface ProjectItem {
    title: string; description: string; tech_stack: string[];
    repo_url: string; live_url: string; image_url: string; featured: boolean;
}
interface SkillItem { category: string; skills_list: string[]; }
interface EducationItem {
    degree: string; field: string; institution: string;
    year: string; is_current: boolean;
}
interface LeadershipItem {
    title: string; organization: string; description: string;
    achievements: string[]; type: string;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "leadership", label: "Leadership", icon: Trophy },
    { id: "appearance", label: "Appearance", icon: Palette },
];

/* ─── STYLE CONSTANTS ─── */
const accent = "#6366f1";
const accent2 = "#14b8a6";
const glassBg = "rgba(255,255,255,0.03)";
const glassBorder = "rgba(255,255,255,0.06)";
const fg = "var(--foreground, #e2e8f0)";
const fgMuted = "var(--foreground-muted, #94a3b8)";
const fgDim = "var(--foreground-dim, #64748b)";

const card: React.CSSProperties = {
    background: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${glassBorder}`, borderRadius: "20px", padding: "28px",
};
const miniCard: React.CSSProperties = {
    ...card, padding: "20px", borderRadius: "16px",
};
const inputRow: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "18px" };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

/* ─── DEFAULTS ─── */
const emptyExp: ExperienceItem = { title: "", company: "", location: "", start_date: "", end_date: "", is_current: false, description_points: [], type: "job" };
const emptyProj: ProjectItem = { title: "", description: "", tech_stack: [], repo_url: "", live_url: "", image_url: "", featured: false };
const emptySkill: SkillItem = { category: "", skills_list: [] };
const emptyEdu: EducationItem = { degree: "", field: "", institution: "", year: "", is_current: false };
const emptyLead: LeadershipItem = { title: "", organization: "", description: "", achievements: [], type: "club" };

/* ─── COMPONENT ─── */
export default function DashboardPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("profile");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data states
    const [profileData, setProfileData] = useState<ProfileData>({
        full_name: "", tagline: "", bio: "", email: "", github: "", linkedin: "",
        degree: "", university: "", graduation_year: "", profile_image: "", resume_url: "",
        primary_color: "#6366f1", secondary_color: "#14b8a6", font_choice: "inter",
        card_style: "glass", animation_enabled: true,
    });
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [skills, setSkills] = useState<SkillItem[]>([]);
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [leadership, setLeadership] = useState<LeadershipItem[]>([]);

    // Add-new form states
    const [showAddExp, setShowAddExp] = useState(false);
    const [newExp, setNewExp] = useState<ExperienceItem>({ ...emptyExp });
    const [showAddProj, setShowAddProj] = useState(false);
    const [newProj, setNewProj] = useState<ProjectItem>({ ...emptyProj });
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [newSkill, setNewSkill] = useState<SkillItem>({ ...emptySkill });
    const [showAddEdu, setShowAddEdu] = useState(false);
    const [newEdu, setNewEdu] = useState<EducationItem>({ ...emptyEdu });
    const [showAddLead, setShowAddLead] = useState(false);
    const [newLead, setNewLead] = useState<LeadershipItem>({ ...emptyLead });

    // Temp text inputs for arrays
    const [descPointsText, setDescPointsText] = useState("");
    const [techStackText, setTechStackText] = useState("");
    const [skillsListText, setSkillsListText] = useState("");
    const [achievementsText, setAchievementsText] = useState("");

    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = useCallback(async (user: string) => {
        try {
            const res = await fetch(`/api/user/${user}`);
            const data = await res.json();
            if (data.profile) {
                setProfileData({
                    full_name: data.profile.full_name || "", tagline: data.profile.tagline || "",
                    bio: data.profile.bio || "", email: data.profile.email || "",
                    github: data.profile.github || "", linkedin: data.profile.linkedin || "",
                    degree: data.profile.degree || "", university: data.profile.university || "",
                    graduation_year: data.profile.graduation_year || "",
                    profile_image: data.profile.profile_image || "",
                    resume_url: data.profile.resume_url || "",
                    primary_color: data.profile.primary_color || "#6366f1",
                    secondary_color: data.profile.secondary_color || "#14b8a6",
                    font_choice: data.profile.font_choice || "inter",
                    card_style: data.profile.card_style || "glass",
                    animation_enabled: data.profile.animation_enabled !== false,
                });
            }
            setExperiences(data.experiences || []);
            setProjects(data.projects || []);
            setSkills(data.skills || []);
            setEducation(data.education || []);
            setLeadership(data.leadership || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("portfolio_user");
        if (!storedUser) { router.push("/login"); return; }
        setUsername(storedUser);
        fetchData(storedUser);
    }, [router, fetchData]);

    const handleSave = async () => {
        if (!username) return;
        setSaving(true);
        try {
            await fetch(`/api/user/${username}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            setSaved(true); setTimeout(() => setSaved(false), 3000);
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const addSectionItem = async (section: string, data: Record<string, unknown>) => {
        if (!username) return;
        setActionLoading(`add-${section}`);
        try {
            const res = await fetch(`/api/user/${username}/sections`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, data }),
            });
            if (res.ok) await fetchData(username);
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    const deleteSectionItem = async (section: string, index: number) => {
        if (!username) return;
        setActionLoading(`del-${section}-${index}`);
        try {
            const res = await fetch(`/api/user/${username}/sections`, {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, index }),
            });
            if (res.ok) await fetchData(username);
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    const handleLogout = () => { localStorage.removeItem("portfolio_user"); router.push("/"); };
    const handleExport = async () => {
        if (!username) return;
        try {
            const res = await fetch(`/api/export/${username}`);
            const d = await res.json();
            const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url;
            a.download = `${username}-portfolio-data.json`; a.click();
            URL.revokeObjectURL(url);
        } catch (e) { console.error(e); }
    };

    /* ─── LOADING ─── */
    if (!username) {
        // If username is not set, useEffect will redirect to /login, so no need to render anything here.
        return null;
    }
    if (loading) {
        return <DashboardSkeleton />;
    }

    /* ─── SECTION HEADER HELPER ─── */
    const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: fg, marginBottom: "6px" }}>{title}</h2>
            <p style={{ color: fgMuted, fontSize: "0.9rem" }}>{subtitle}</p>
        </div>
    );

    /* ─── ITEM CARD HELPER ─── */
    const ItemCard = ({ title, subtitle, badges, index, section, children }: {
        title: string; subtitle: string; badges?: string[];
        index: number; section: string; children?: React.ReactNode;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ ...miniCard, position: "relative" }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 700, color: fg, fontSize: "0.95rem", marginBottom: "4px" }}>{title}</h4>
                    <p style={{ color: fgMuted, fontSize: "0.83rem" }}>{subtitle}</p>
                    {badges && badges.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                            {badges.map((b, i) => (
                                <span key={i} style={{
                                    fontSize: "0.72rem", padding: "3px 10px", borderRadius: "8px",
                                    background: `${accent}15`, color: accent, fontWeight: 500,
                                }}>{b}</span>
                            ))}
                        </div>
                    )}
                    {children}
                </div>
                <button
                    onClick={() => deleteSectionItem(section, index)}
                    disabled={actionLoading === `del-${section}-${index}`}
                    style={{
                        background: "rgba(239,68,68,0.08)", border: "none", cursor: "pointer",
                        padding: "8px", borderRadius: "10px", color: "#f87171", flexShrink: 0,
                        transition: "all 0.2s", opacity: actionLoading === `del-${section}-${index}` ? 0.5 : 1,
                    }}
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );

    /* ─── ADD BUTTON ─── */
    const AddButton = ({ show, setShow, label }: { show: boolean; setShow: (v: boolean) => void; label: string }) => (
        <button
            onClick={() => setShow(!show)}
            style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "14px 20px", borderRadius: "14px",
                border: `2px dashed ${show ? accent : glassBorder}`,
                background: show ? `${accent}08` : "transparent",
                color: show ? accent : fgMuted, cursor: "pointer", fontWeight: 600,
                fontSize: "0.88rem", transition: "all 0.2s",
            }}
        >
            {show ? <ChevronUp size={18} /> : <Plus size={18} />}
            {show ? "Cancel" : label}
        </button>
    );

    /* ─── TEXTAREA HELPER ─── */
    const Textarea = ({ label, value, onChange, placeholder, rows = 3 }: {
        label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
    }) => (
        <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: fgMuted, marginBottom: "8px" }}>{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
                style={{
                    width: "100%", padding: "14px 16px", fontSize: "0.9rem", color: fg,
                    background: "rgba(255,255,255,0.03)", border: `1px solid ${glassBorder}`,
                    borderRadius: "12px", outline: "none", transition: "border-color 0.2s",
                    fontFamily: "inherit", lineHeight: 1.6, resize: "vertical",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = `${accent}60`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = glassBorder; }}
            />
        </div>
    );

    /* ─── SELECT HELPER ─── */
    const Select = ({ label, value, onChange, options }: {
        label: string; value: string; onChange: (v: string) => void;
        options: { value: string; label: string }[];
    }) => (
        <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: fgMuted, marginBottom: "8px" }}>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%", padding: "14px 16px", fontSize: "0.9rem", color: fg,
                    background: "rgba(255,255,255,0.03)", border: `1px solid ${glassBorder}`,
                    borderRadius: "12px", outline: "none", appearance: "none",
                    cursor: "pointer",
                }}
            >
                {options.map((o) => (<option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: fg }}>{o.label}</option>))}
            </select>
        </div>
    );

    /* ─── CHECKBOX HELPER ─── */
    const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.88rem", color: fgMuted }}>
            <div onClick={(e) => { e.preventDefault(); onChange(!checked); }}
                style={{
                    width: 22, height: 22, borderRadius: 7, border: `2px solid ${checked ? accent : glassBorder}`,
                    background: checked ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", cursor: "pointer", flexShrink: 0,
                }}>
                {checked && <Check size={14} color="white" />}
            </div>
            {label}
        </label>
    );

    return (
        <div style={{ minHeight: "100vh" }}>
            {/* ─── TOP BAR ─── */}
            <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "12px 16px" }}>
                <div style={{
                    ...card, padding: "12px 20px", borderRadius: "16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    maxWidth: 1400, margin: "0 auto",
                }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 4px 12px ${accent}30`,
                        }}>
                            <Sparkles style={{ width: 16, height: 16, color: "white" }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: fg }}>
                            Portfolio<span style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } as React.CSSProperties}>Hub</span>
                        </span>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Link href={`/${username}`} target="_blank" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm"><Eye style={{ width: 16, height: 16 }} /> <span className="sr-hide-mobile">Preview</span></Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleExport}>
                            <Download style={{ width: 16, height: 16 }} /> <span className="sr-hide-mobile">Export</span>
                        </Button>
                        <Button size="sm" onClick={handleSave} loading={saving}>
                            {saved ? <><Check style={{ width: 16, height: 16 }} /> Saved!</> : <><Save style={{ width: 16, height: 16 }} /> <span className="sr-hide-mobile">Save</span></>}
                        </Button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-only-btn"
                            style={{ background: "none", border: "none", cursor: "pointer", color: fgMuted, padding: 8, display: "none" }}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ display: "flex", paddingTop: 80 }}>
                {/* ─── SIDEBAR ─── */}
                <aside className="sidebar-desktop" style={{ width: 240, flexShrink: 0, position: "fixed", left: 16, top: 80, bottom: 16 }}>
                    <div style={{ ...card, height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "14px 16px", borderRadius: 14, marginBottom: 20, background: `${accent}10`, border: `1px solid ${accent}15` }}>
                            <p style={{ fontWeight: 600, color: fg, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {profileData.full_name || username}
                            </p>
                            <p style={{ fontSize: "0.8rem", color: fgMuted }}>@{username}</p>
                        </div>
                        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const count = tab.id === "experience" ? experiences.length : tab.id === "projects" ? projects.length
                                    : tab.id === "skills" ? skills.length : tab.id === "education" ? education.length
                                        : tab.id === "leadership" ? leadership.length : 0;
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            padding: "12px 16px", borderRadius: 14, border: "none", cursor: "pointer",
                                            textAlign: "left", width: "100%", fontSize: "0.88rem", fontWeight: isActive ? 600 : 400,
                                            transition: "all 0.2s",
                                            ...(isActive ? { background: accent, color: "white", boxShadow: `0 4px 16px ${accent}40` }
                                                : { background: "transparent", color: fgMuted }),
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = fg; } }}
                                        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = fgMuted; } }}
                                    >
                                        <tab.icon style={{ width: 18, height: 18 }} />
                                        <span style={{ flex: 1 }}>{tab.label}</span>
                                        {tab.id !== "profile" && count > 0 && (
                                            <span style={{
                                                fontSize: "0.7rem", padding: "2px 8px", borderRadius: 8,
                                                background: isActive ? "rgba(255,255,255,0.2)" : `${accent}15`, color: isActive ? "white" : accent,
                                                fontWeight: 600,
                                            }}>{count}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                        <button onClick={handleLogout}
                            style={{
                                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                                borderRadius: 14, border: "none", cursor: "pointer", textAlign: "left",
                                width: "100%", fontSize: "0.88rem", background: "transparent",
                                color: fgDim, marginTop: "auto", transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = fgDim; }}
                        >
                            <LogOut style={{ width: 18, height: 18 }} /> Logout
                        </button>
                    </div>
                </aside>

                {/* ─── MOBILE MENU ─── */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 40 }}>
                            <div onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
                            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                style={{
                                    position: "absolute", left: 0, top: 0, bottom: 0, width: 260,
                                    background: "var(--background, #0a0a1a)", borderRight: `1px solid ${glassBorder}`,
                                    padding: "80px 16px 24px", display: "flex", flexDirection: "column", gap: 4,
                                }}
                            >
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                                                borderRadius: 14, border: "none", cursor: "pointer", textAlign: "left",
                                                width: "100%", fontSize: "0.9rem",
                                                ...(isActive ? { background: accent, color: "white" } : { background: "transparent", color: fgMuted }),
                                            }}
                                        >
                                            <tab.icon style={{ width: 18, height: 18 }} /> {tab.label}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ══════════════ MAIN CONTENT ══════════════ */}
                <main className="dashboard-main" style={{ flex: 1, marginLeft: 272, padding: "16px 24px 60px", minHeight: "calc(100vh - 80px)" }}>
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                                {/* ═══════ PROFILE TAB ═══════ */}
                                {activeTab === "profile" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Profile Information" subtitle="This information will be displayed on your public portfolio." />

                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                                <User style={{ width: 16, height: 16, color: accent }} /> Basic Information
                                            </h3>
                                            <div style={inputRow}>
                                                <Input label="Full Name" placeholder="John Doe" value={profileData.full_name}
                                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
                                                <Input label="Tagline" placeholder="3rd Year B.Tech | ECE @ SRMIST" value={profileData.tagline}
                                                    onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })} />
                                                <Textarea label="Bio" value={profileData.bio} onChange={(v) => setProfileData({ ...profileData, bio: v })}
                                                    placeholder="Tell visitors about yourself..." />
                                            </div>
                                        </div>

                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                                <ImageIcon style={{ width: 16, height: 16, color: accent2 }} /> Profile Image & Resume
                                            </h3>
                                            <div style={inputRow}>
                                                <Input label="Profile Image URL" placeholder="https://drive.google.com/file/d/..." value={profileData.profile_image}
                                                    onChange={(e) => setProfileData({ ...profileData, profile_image: e.target.value })}
                                                    icon={<ImageIcon style={{ width: 18, height: 18 }} />} />
                                                <p style={{ fontSize: "0.75rem", color: fgDim, padding: "10px 14px", borderRadius: 10, background: `${accent}08`, border: `1px solid ${accent}12`, lineHeight: 1.6 }}>
                                                    💡 Upload your image to Google Drive → Right-click → Share → &quot;Anyone with the link&quot; → Copy link
                                                </p>
                                                <Input label="Resume URL (optional)" placeholder="https://drive.google.com/file/d/..." value={profileData.resume_url}
                                                    onChange={(e) => setProfileData({ ...profileData, resume_url: e.target.value })}
                                                    icon={<FileText style={{ width: 18, height: 18 }} />} />
                                            </div>
                                        </div>

                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>Contact & Social</h3>
                                            <div style={inputRow}>
                                                <Input label="Email" type="email" placeholder="you@example.com" value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                                                <div style={grid2}>
                                                    <Input label="GitHub Username" placeholder="yourusername" value={profileData.github}
                                                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })} />
                                                    <Input label="LinkedIn Username" placeholder="yourusername" value={profileData.linkedin}
                                                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                                <GraduationCap style={{ width: 16, height: 16, color: accent }} /> Education Summary
                                            </h3>
                                            <div style={inputRow}>
                                                <Input label="Degree" placeholder="B.Tech – Electronics & Communication" value={profileData.degree}
                                                    onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })} />
                                                <div style={grid2}>
                                                    <Input label="University" placeholder="SRM Institute of Science and Technology" value={profileData.university}
                                                        onChange={(e) => setProfileData({ ...profileData, university: e.target.value })} />
                                                    <Input label="Graduation Year" placeholder="2027" value={profileData.graduation_year}
                                                        onChange={(e) => setProfileData({ ...profileData, graduation_year: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ═══════ EXPERIENCE TAB ═══════ */}
                                {activeTab === "experience" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Experience" subtitle="Add your internships, jobs, and volunteer work." />

                                        {experiences.map((exp, i) => (
                                            <ItemCard key={i} index={i} section="experience"
                                                title={exp.title} subtitle={`${exp.company}${exp.location ? ` · ${exp.location}` : ""} · ${exp.start_date}–${exp.is_current ? "Present" : exp.end_date}`}
                                                badges={[exp.type]}
                                            >
                                                {exp.description_points.length > 0 && (
                                                    <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: fgDim, fontSize: "0.8rem", lineHeight: 1.8 }}>
                                                        {exp.description_points.map((p, j) => <li key={j}>{p}</li>)}
                                                    </ul>
                                                )}
                                            </ItemCard>
                                        ))}

                                        <AddButton show={showAddExp} setShow={setShowAddExp} label="Add Experience" />

                                        <AnimatePresence>
                                            {showAddExp && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ overflow: "hidden" }}>
                                                    <div style={card}>
                                                        <h4 style={{ fontWeight: 700, color: fg, marginBottom: 18, fontSize: "0.95rem" }}>New Experience</h4>
                                                        <div style={inputRow}>
                                                            <Input label="Title *" placeholder="Software Engineer" value={newExp.title}
                                                                onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} />
                                                            <div style={grid2}>
                                                                <Input label="Company *" placeholder="Google" value={newExp.company}
                                                                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
                                                                <Input label="Location" placeholder="Mountain View, CA" value={newExp.location}
                                                                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })} />
                                                            </div>
                                                            <div style={grid2}>
                                                                <Input label="Start Date *" placeholder="Jan 2024" value={newExp.start_date}
                                                                    onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })} />
                                                                <Input label="End Date" placeholder="Dec 2024" value={newExp.end_date}
                                                                    onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })} />
                                                            </div>
                                                            <div style={grid2}>
                                                                <Select label="Type" value={newExp.type} onChange={(v) => setNewExp({ ...newExp, type: v })}
                                                                    options={[{ value: "job", label: "Job" }, { value: "internship", label: "Internship" },
                                                                    { value: "volunteer", label: "Volunteer" }, { value: "club", label: "Club" }]} />
                                                                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                                                                    <Checkbox label="Currently working here" checked={newExp.is_current}
                                                                        onChange={(v) => setNewExp({ ...newExp, is_current: v })} />
                                                                </div>
                                                            </div>
                                                            <Textarea label="Description Points (one per line)" value={descPointsText}
                                                                onChange={setDescPointsText} placeholder="Built a REST API for...\nImplemented CI/CD pipeline..." rows={4} />
                                                            <Button onClick={async () => {
                                                                const pts = descPointsText.split("\n").map(s => s.trim()).filter(Boolean);
                                                                await addSectionItem("experience", { ...newExp, description_points: pts });
                                                                setNewExp({ ...emptyExp }); setDescPointsText(""); setShowAddExp(false);
                                                            }} loading={actionLoading === "add-experience"}>
                                                                <Plus size={16} /> Add Experience
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ═══════ PROJECTS TAB ═══════ */}
                                {activeTab === "projects" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Projects" subtitle="Showcase your best work and personal projects." />

                                        {projects.map((proj, i) => (
                                            <ItemCard key={i} index={i} section="projects"
                                                title={`${proj.title}${proj.featured ? " ⭐" : ""}`}
                                                subtitle={proj.description.substring(0, 100) + (proj.description.length > 100 ? "..." : "")}
                                                badges={proj.tech_stack}
                                            />
                                        ))}

                                        <AddButton show={showAddProj} setShow={setShowAddProj} label="Add Project" />

                                        <AnimatePresence>
                                            {showAddProj && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ overflow: "hidden" }}>
                                                    <div style={card}>
                                                        <h4 style={{ fontWeight: 700, color: fg, marginBottom: 18, fontSize: "0.95rem" }}>New Project</h4>
                                                        <div style={inputRow}>
                                                            <Input label="Title *" placeholder="My Cool Project" value={newProj.title}
                                                                onChange={(e) => setNewProj({ ...newProj, title: e.target.value })} />
                                                            <Textarea label="Description *" value={newProj.description}
                                                                onChange={(v) => setNewProj({ ...newProj, description: v })}
                                                                placeholder="A brief description of your project..." />
                                                            <Input label="Tech Stack (comma-separated)" placeholder="React, Node.js, PostgreSQL" value={techStackText}
                                                                onChange={(e) => setTechStackText(e.target.value)} />
                                                            <div style={grid2}>
                                                                <Input label="Repo URL" placeholder="https://github.com/..." value={newProj.repo_url}
                                                                    onChange={(e) => setNewProj({ ...newProj, repo_url: e.target.value })} />
                                                                <Input label="Live URL" placeholder="https://..." value={newProj.live_url}
                                                                    onChange={(e) => setNewProj({ ...newProj, live_url: e.target.value })} />
                                                            </div>
                                                            <Input label="Image URL" placeholder="https://..." value={newProj.image_url}
                                                                onChange={(e) => setNewProj({ ...newProj, image_url: e.target.value })} />
                                                            <Checkbox label="Featured project (shown prominently)" checked={newProj.featured}
                                                                onChange={(v) => setNewProj({ ...newProj, featured: v })} />
                                                            <Button onClick={async () => {
                                                                const ts = techStackText.split(",").map(s => s.trim()).filter(Boolean);
                                                                await addSectionItem("projects", { ...newProj, tech_stack: ts });
                                                                setNewProj({ ...emptyProj }); setTechStackText(""); setShowAddProj(false);
                                                            }} loading={actionLoading === "add-projects"}>
                                                                <Plus size={16} /> Add Project
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ═══════ SKILLS TAB ═══════ */}
                                {activeTab === "skills" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Skills" subtitle="List your technical skills by category." />

                                        {skills.map((skill, i) => (
                                            <ItemCard key={i} index={i} section="skills"
                                                title={skill.category}
                                                subtitle={`${skill.skills_list.length} skills`}
                                                badges={skill.skills_list}
                                            />
                                        ))}

                                        <AddButton show={showAddSkill} setShow={setShowAddSkill} label="Add Skill Category" />

                                        <AnimatePresence>
                                            {showAddSkill && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ overflow: "hidden" }}>
                                                    <div style={card}>
                                                        <h4 style={{ fontWeight: 700, color: fg, marginBottom: 18, fontSize: "0.95rem" }}>New Skill Category</h4>
                                                        <div style={inputRow}>
                                                            <Input label="Category *" placeholder="Frontend Development" value={newSkill.category}
                                                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} />
                                                            <Input label="Skills (comma-separated) *" placeholder="React, Vue, Angular, TypeScript" value={skillsListText}
                                                                onChange={(e) => setSkillsListText(e.target.value)} />
                                                            <Button onClick={async () => {
                                                                const sl = skillsListText.split(",").map(s => s.trim()).filter(Boolean);
                                                                await addSectionItem("skills", { ...newSkill, skills_list: sl });
                                                                setNewSkill({ ...emptySkill }); setSkillsListText(""); setShowAddSkill(false);
                                                            }} loading={actionLoading === "add-skills"}>
                                                                <Plus size={16} /> Add Skills
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ═══════ EDUCATION TAB ═══════ */}
                                {activeTab === "education" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Education" subtitle="Add your educational background." />

                                        {education.map((edu, i) => (
                                            <ItemCard key={i} index={i} section="education"
                                                title={edu.degree}
                                                subtitle={`${edu.institution} · ${edu.field} · ${edu.is_current ? "Current" : edu.year}`}
                                            />
                                        ))}

                                        <AddButton show={showAddEdu} setShow={setShowAddEdu} label="Add Education" />

                                        <AnimatePresence>
                                            {showAddEdu && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ overflow: "hidden" }}>
                                                    <div style={card}>
                                                        <h4 style={{ fontWeight: 700, color: fg, marginBottom: 18, fontSize: "0.95rem" }}>New Education</h4>
                                                        <div style={inputRow}>
                                                            <Input label="Degree *" placeholder="B.Tech Computer Science" value={newEdu.degree}
                                                                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} />
                                                            <Input label="Field of Study *" placeholder="VLSI, Embedded Systems" value={newEdu.field}
                                                                onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })} />
                                                            <Input label="Institution *" placeholder="SRM Institute of Science and Technology" value={newEdu.institution}
                                                                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} />
                                                            <div style={grid2}>
                                                                <Input label="Year" placeholder="2027" value={newEdu.year}
                                                                    onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })} />
                                                                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                                                                    <Checkbox label="Currently studying" checked={newEdu.is_current}
                                                                        onChange={(v) => setNewEdu({ ...newEdu, is_current: v })} />
                                                                </div>
                                                            </div>
                                                            <Button onClick={async () => {
                                                                await addSectionItem("education", { ...newEdu } as Record<string, unknown>);
                                                                setNewEdu({ ...emptyEdu }); setShowAddEdu(false);
                                                            }} loading={actionLoading === "add-education"}>
                                                                <Plus size={16} /> Add Education
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ═══════ LEADERSHIP TAB ═══════ */}
                                {activeTab === "leadership" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Leadership" subtitle="Highlight your leadership roles, clubs, and competitions." />

                                        {leadership.map((lead, i) => (
                                            <ItemCard key={i} index={i} section="leadership"
                                                title={lead.title}
                                                subtitle={lead.organization}
                                                badges={[lead.type]}
                                            >
                                                {lead.description && <p style={{ color: fgDim, fontSize: "0.83rem", marginTop: 8 }}>{lead.description}</p>}
                                                {lead.achievements.length > 0 && (
                                                    <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: fgDim, fontSize: "0.8rem", lineHeight: 1.8 }}>
                                                        {lead.achievements.map((a, j) => <li key={j}>{a}</li>)}
                                                    </ul>
                                                )}
                                            </ItemCard>
                                        ))}

                                        <AddButton show={showAddLead} setShow={setShowAddLead} label="Add Leadership Role" />

                                        <AnimatePresence>
                                            {showAddLead && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                    style={{ overflow: "hidden" }}>
                                                    <div style={card}>
                                                        <h4 style={{ fontWeight: 700, color: fg, marginBottom: 18, fontSize: "0.95rem" }}>New Leadership Role</h4>
                                                        <div style={inputRow}>
                                                            <Input label="Title *" placeholder="Founder & Chairperson" value={newLead.title}
                                                                onChange={(e) => setNewLead({ ...newLead, title: e.target.value })} />
                                                            <Input label="Organization *" placeholder="IEEE MTT-S Student Chapter" value={newLead.organization}
                                                                onChange={(e) => setNewLead({ ...newLead, organization: e.target.value })} />
                                                            <Textarea label="Description" value={newLead.description}
                                                                onChange={(v) => setNewLead({ ...newLead, description: v })}
                                                                placeholder="Describe your role and impact..." />
                                                            <Select label="Type" value={newLead.type} onChange={(v) => setNewLead({ ...newLead, type: v })}
                                                                options={[{ value: "club", label: "Club/Organization" }, { value: "academic", label: "Academic" },
                                                                { value: "volunteer", label: "Volunteer" }, { value: "competition", label: "Competition" }]} />
                                                            <Textarea label="Achievements (one per line)" value={achievementsText}
                                                                onChange={setAchievementsText}
                                                                placeholder="Organized 10+ technical workshops\nGrew membership by 200%" rows={4} />
                                                            <Button onClick={async () => {
                                                                const achs = achievementsText.split("\n").map(s => s.trim()).filter(Boolean);
                                                                await addSectionItem("leadership", { ...newLead, achievements: achs });
                                                                setNewLead({ ...emptyLead }); setAchievementsText(""); setShowAddLead(false);
                                                            }} loading={actionLoading === "add-leadership"}>
                                                                <Plus size={16} /> Add Leadership Role
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ═══════ APPEARANCE TAB ═══════ */}
                                {activeTab === "appearance" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <SectionHeader title="Appearance" subtitle="Customize how your portfolio looks to visitors." />

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
                                                <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Live Preview</span>
                                                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>This is how your gradient will look</span>
                                            </div>
                                        </div>

                                        {/* Font Selection */}
                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>Typography</h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                                {[
                                                    { value: "inter", label: "Inter", preview: "Clean & Modern", family: "Inter, sans-serif" },
                                                    { value: "playfair", label: "Playfair Display", preview: "Elegant & Serif", family: "'Playfair Display', serif" },
                                                    { value: "space_grotesk", label: "Space Grotesk", preview: "Tech & Bold", family: "'Space Grotesk', sans-serif" },
                                                    { value: "jetbrains", label: "JetBrains Mono", preview: "Developer Style", family: "'JetBrains Mono', monospace" },
                                                ].map((font) => {
                                                    const isActive = profileData.font_choice === font.value;
                                                    return (
                                                        <button key={font.value} onClick={() => setProfileData({ ...profileData, font_choice: font.value })}
                                                            style={{
                                                                padding: "16px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                                                                border: `2px solid ${isActive ? profileData.primary_color : glassBorder}`,
                                                                background: isActive ? `${profileData.primary_color}10` : "transparent",
                                                                transition: "all 0.2s",
                                                            }}>
                                                            <span style={{ fontFamily: font.family, fontSize: "1.1rem", fontWeight: 700, color: fg, display: "block", marginBottom: 4 }}>{font.label}</span>
                                                            <span style={{ fontFamily: font.family, fontSize: "0.8rem", color: fgMuted }}>{font.preview}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Card Style */}
                                        <div style={card}>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg, marginBottom: 20 }}>Card Style</h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                                {[
                                                    { value: "glass", label: "Glass", desc: "Frosted glass effect" },
                                                    { value: "solid", label: "Solid", desc: "Opaque cards" },
                                                    { value: "outline", label: "Outline", desc: "Bordered, transparent" },
                                                ].map((style) => {
                                                    const isActive = profileData.card_style === style.value;
                                                    const previewStyle: React.CSSProperties = style.value === "glass"
                                                        ? { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", border: `1px solid rgba(255,255,255,0.08)` }
                                                        : style.value === "solid"
                                                            ? { background: "rgba(30,30,50,0.95)", border: `1px solid rgba(255,255,255,0.06)` }
                                                            : { background: "transparent", border: `2px solid rgba(255,255,255,0.12)` };
                                                    return (
                                                        <button key={style.value} onClick={() => setProfileData({ ...profileData, card_style: style.value })}
                                                            style={{
                                                                padding: 0, borderRadius: 14, cursor: "pointer", textAlign: "center", overflow: "hidden",
                                                                border: `2px solid ${isActive ? profileData.primary_color : glassBorder}`,
                                                                background: isActive ? `${profileData.primary_color}08` : "transparent",
                                                                transition: "all 0.2s",
                                                            }}>
                                                            <div style={{ ...previewStyle, borderRadius: 8, margin: 12, padding: "20px 12px" }}>
                                                                <div style={{ width: "60%", height: 6, borderRadius: 3, background: `${profileData.primary_color}60`, margin: "0 auto 8px" }} />
                                                                <div style={{ width: "80%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", margin: "0 auto 4px" }} />
                                                                <div style={{ width: "50%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", margin: "0 auto" }} />
                                                            </div>
                                                            <div style={{ padding: "8px 12px 14px" }}>
                                                                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: fg, display: "block" }}>{style.label}</span>
                                                                <span style={{ fontSize: "0.72rem", color: fgDim }}>{style.desc}</span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
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
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar-desktop { display: none !important; }
                    .dashboard-main { margin-left: 0 !important; padding: 12px !important; }
                    .mobile-only-btn { display: flex !important; }
                    .sr-hide-mobile { display: none; }
                }
                @media (min-width: 769px) {
                    .mobile-only-btn { display: none !important; }
                    .sr-hide-mobile { display: inline; }
                }
            `}</style>
        </div>
    );
}
