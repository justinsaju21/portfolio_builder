"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ExternalLink, Calendar, MapPin, Award, BookOpen, Users, Trophy,
    Zap, Globe, Target, UserCheck, FileText, Briefcase, Building2
} from "lucide-react";
import {
    Hackathon, Research, Entrepreneurship, Certification, Exam,
    SportsCultural, Volunteering, Scholarship, ClubActivity,
    DeptContribution, ProfessionalMembership, Reference
} from "@/lib/types";

/* ─── Shared Styles & Helpers ─── */
// These will be passed from the parent or defined here matching PortfolioView
const glassCardStyle = (theme: any) => ({
    background: theme.glassBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${theme.glassBorder}`,
    borderRadius: "16px",
    padding: "24px",
    transition: "all 0.3s ease",
    position: "relative" as "relative",
    overflow: "hidden" as "hidden"
});

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

interface SectionProps {
    data: any[];
    theme: any;
    accent: string;
    accent2: string;
}

/* ─── 1. HACKATHONS (Grid of Cards) ─── */
export function HackathonSection({ data, theme, accent }: SectionProps) {
    const items = data as Hackathon[];
    const [showAll, setShowAll] = React.useState(false);
    const visibleItems = showAll ? items : items.slice(0, 6);

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                {visibleItems.map((item, i) => (
                    <motion.div key={i} variants={fadeUp} style={glassCardStyle(theme)} className="glass-card-hover">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                            <div style={{ padding: "10px", borderRadius: "10px", background: `${accent}15`, color: accent }}>
                                <Zap size={20} />
                            </div>
                            {item.proof_link && (
                                <a href={item.proof_link} target="_blank" rel="noopener" style={{ color: theme.textMuted, transition: "color 0.2s" }} className="hover-accent">
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 4px", color: theme.textPrimary }}>{item.name}</h3>
                        <p style={{ fontSize: "0.9rem", color: accent, fontWeight: 500, marginBottom: "8px" }}>{item.project_built}</p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.85rem", color: theme.textMuted, marginTop: "16px" }}>
                            {item.position && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Trophy size={14} /> {item.position}</span>}
                            {item.team_size && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Users size={14} /> Team of {item.team_size}</span>}
                        </div>
                    </motion.div>
                ))}
            </div>
            {items.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                    <button onClick={() => setShowAll(!showAll)} style={{ background: "transparent", border: `1px solid ${accent}`, color: accent, padding: "10px 24px", borderRadius: "100px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = `${accent}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {showAll ? "Show Less" : `Show All (${items.length})`}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── 2. RESEARCH (List View) ─── */
export function ResearchSection({ data, theme, accent }: SectionProps) {
    const items = data as Research[];
    const [showAll, setShowAll] = React.useState(false);
    const visibleItems = showAll ? items : items.slice(0, 6);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {visibleItems.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), display: "flex", flexDirection: "column", gap: "8px" }} className="glass-card-hover">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "4px", display: "block" }}>
                                {item.publication_status}
                            </span>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: theme.textPrimary, lineHeight: 1.3 }}>{item.title}</h3>
                        </div>
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener" style={{ padding: "8px", borderRadius: "50%", background: `${accent}10`, color: accent }}>
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: theme.textPrimary, fontWeight: 500, fontSize: "0.95rem" }}>
                        <BookOpen size={16} color={accent} /> {item.journal_conference}
                    </div>
                    {item.index_status && (
                        <div style={{ display: "inline-flex", padding: "4px 10px", borderRadius: "6px", background: `${theme.textMuted}15`, fontSize: "0.8rem", width: "fit-content", color: theme.textMuted }}>
                            Included in {item.index_status}
                        </div>
                    )}
                </motion.div>
            ))}
            {items.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                    <button onClick={() => setShowAll(!showAll)} style={{ background: "transparent", border: `1px solid ${accent}`, color: accent, padding: "10px 24px", borderRadius: "100px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = `${accent}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {showAll ? "Show Less" : `Show All (${items.length})`}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── 3. ENTREPRENEURSHIP (Featured Cards) ─── */
export function EntrepreneurshipSection({ data, theme, accent, accent2 }: SectionProps) {
    const items = data as Entrepreneurship[];
    const [showAll, setShowAll] = React.useState(false);
    const visibleItems = showAll ? items : items.slice(0, 6);

    return (
        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {visibleItems.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={glassCardStyle(theme)} className="glass-card-hover">
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "12px", background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.textPrimary }}>{item.startup_name}</h3>
                            <div style={{ fontSize: "0.9rem", color: theme.textMuted }}>{item.registration_details}</div>
                        </div>
                    </div>
                    <p style={{ color: theme.textPrimary, lineHeight: 1.6, marginBottom: "16px" }}>{item.description}</p>
                    <div style={{ paddingTop: "16px", borderTop: `1px solid ${theme.glassBorder}`, display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                        <span style={{ color: accent, fontWeight: 600 }}>{item.revenue_funding}</span>
                        {item.proof_link && <a href={item.proof_link} target="_blank" rel="noopener" style={{ color: theme.textMuted, display: "flex", alignItems: "center", gap: "4px" }}>Visit <ExternalLink size={14} /></a>}
                    </div>
                </motion.div>
            ))}
            {items.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", gridColumn: "1 / -1" }}>
                    <button onClick={() => setShowAll(!showAll)} style={{ background: "transparent", border: `1px solid ${accent}`, color: accent, padding: "10px 24px", borderRadius: "100px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = `${accent}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {showAll ? "Show Less" : `Show All (${items.length})`}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── 4. CERTIFICATIONS (Compact Grid) ─── */
export function CertificationSection({ data, theme, accent }: SectionProps) {
    const items = data as Certification[];
    const [showAll, setShowAll] = React.useState(false);
    const visibleItems = showAll ? items : items.slice(0, 6);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {visibleItems.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), padding: "20px" }} className="glass-card-hover">
                    <div style={{ marginBottom: "12px", color: accent }}>
                        <Award size={24} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "4px" }}>{item.certificate_name}</h4>
                    <p style={{ fontSize: "0.85rem", color: theme.textMuted, marginBottom: "12px" }}>{item.provider}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
                        <span style={{ fontFamily: "monospace", padding: "2px 6px", background: `${theme.textMuted}10`, borderRadius: "4px", color: theme.textMuted }}>
                            ID: {item.validation_id || "N/A"}
                        </span>
                        {item.proof_link && <a href={item.proof_link} target="_blank" rel="noopener" style={{ color: accent }}><ExternalLink size={14} /></a>}
                    </div>
                </motion.div>
            ))}
            {items.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", gridColumn: "1 / -1" }}>
                    <button onClick={() => setShowAll(!showAll)} style={{ background: "transparent", border: `1px solid ${accent}`, color: accent, padding: "10px 24px", borderRadius: "100px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = `${accent}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {showAll ? "Show Less" : `Show All (${items.length})`}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── 5. COMPETITIVE EXAMS (List) ─── */
export function ExamSection({ data, theme, accent }: SectionProps) {
    const items = data as Exam[];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ padding: "10px", borderRadius: "50%", background: `${accent}15`, color: accent }}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: theme.textPrimary }}>{item.exam_name}</h4>
                        <p style={{ fontSize: "0.9rem", color: theme.textMuted, fontWeight: 500 }}>{item.score_rank}</p>
                        {item.proof_link && <a href={item.proof_link} target="_blank" rel="noopener" style={{ fontSize: "0.75rem", color: accent, display: "block", marginTop: "4px" }}>View Proof</a>}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 6. SPORTS & CULTURAL (Cards) ─── */
export function SportsCulturalSection({ data, theme, accent }: SectionProps) {
    const items = data as SportsCultural[];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={glassCardStyle(theme)}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: accent }}>{item.level}</span>
                        {item.position_won && <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fbbf24", display: "flex", alignItems: "center", gap: "4px" }}><Trophy size={12} /> {item.position_won}</span>}
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: theme.textPrimary, marginBottom: "4px" }}>{item.event_name}</h3>
                    {item.proof_link && <a href={item.proof_link} target="_blank" rel="noopener" style={{ fontSize: "0.8rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: "4px", marginTop: "12px" }}><ExternalLink size={12} /> View Certificate</a>}
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 7. VOLUNTEERING (Timeline-ish) ─── */
export function VolunteeringSection({ data, theme, accent }: SectionProps) {
    const items = data as Volunteering[];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={glassCardStyle(theme)}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary }}>{item.role}</h3>
                        <span style={{ fontSize: "0.9rem", color: accent, fontWeight: 500 }}>{item.organization}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: theme.textMuted, marginBottom: "12px" }}>
                        <Calendar size={14} /> {item.hours_served} Hours Served
                    </div>
                    <p style={{ fontSize: "0.95rem", color: theme.textMuted, lineHeight: 1.6 }}>{item.impact}</p>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 8. SCHOLARSHIPS (Ribbon Style) ─── */
export function ScholarshipSection({ data, theme, accent }: SectionProps) {
    const items = data as Scholarship[];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), borderLeft: `4px solid ${accent}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: theme.textPrimary }}>{item.name}</h3>
                        <span style={{ fontWeight: 600, color: theme.textMuted }}>{item.amount_prestige}</span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: theme.textMuted, marginTop: "4px" }}>Awarded by {item.awarding_body}</p>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 9. CLUB ACTIVITIES (Cards) ─── */
export function ClubActivitySection({ data, theme, accent }: SectionProps) {
    const items = data as ClubActivity[];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={glassCardStyle(theme)}>
                    <div style={{ marginBottom: "12px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary }}>{item.position}</h3>
                        <div style={{ color: accent, fontSize: "0.9rem", fontWeight: 500 }}>{item.club_name}</div>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: theme.textMuted, marginBottom: "12px" }}>
                        <strong>Key Events:</strong> {item.key_events}
                    </div>
                    <p style={{ fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.5 }}>{item.impact_description}</p>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 10. DEPARTMENT CONTRIBUTIONS (List) ─── */
export function DeptContributionSection({ data, theme, accent }: SectionProps) {
    const items = data as DeptContribution[];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), display: "flex", gap: "20px", alignItems: "start" }}>
                    <div style={{ padding: "12px", borderRadius: "12px", background: `${accent}10`, color: accent, flexShrink: 0 }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.textPrimary }}>{item.event_name}</h3>
                        <p style={{ fontSize: "0.9rem", color: accent, fontWeight: 500, marginBottom: "8px" }}>{item.role}</p>
                        <p style={{ fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.6 }}>{item.contribution_description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 11. PROFESSIONAL MEMBERSHIPS (Compact) ─── */
export function ProfessionalMembershipSection({ data, theme, accent }: SectionProps) {
    const items = data as ProfessionalMembership[];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), padding: "20px", textAlign: "center" }}>
                    <div style={{ margin: "0 auto 12px", width: "40px", height: "40px", borderRadius: "50%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textPrimary }}>
                        <Briefcase size={20} />
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: theme.textPrimary }}>{item.organization}</h3>
                    <p style={{ fontSize: "0.9rem", color: accent, margin: "4px 0" }}>{item.role}</p>
                    <p style={{ fontSize: "0.8rem", color: theme.textMuted, fontFamily: "monospace" }}>ID: {item.membership_id}</p>
                </motion.div>
            ))}
        </div>
    );
}

/* ─── 12. REFERENCES (Contact Cards) ─── */
export function ReferenceSection({ data, theme, accent }: SectionProps) {
    const items = data as Reference[];
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ ...glassCardStyle(theme), padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: theme.textPrimary }}>{item.faculty_name}</h3>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: theme.textMuted }}>
                            <Briefcase size={14} /> {item.contact}
                        </div>
                        {item.lor_link && (
                            <a href={item.lor_link} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: "8px", color: accent, textDecoration: "none", fontWeight: 500 }}>
                                <FileText size={14} /> Download Letter
                            </a>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
