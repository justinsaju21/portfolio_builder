"use client";

import { User, ImageIcon, FileText, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { SectionHeader, Textarea } from "./DashboardUI";

const accent = "#6366f1";
const accent2 = "#14b8a6";
const fg = "var(--foreground, #e2e8f0)";
const fgDim = "var(--foreground-dim, #64748b)";
const glassBg = "rgba(255,255,255,0.03)";
const glassBorder = "rgba(255,255,255,0.06)";

const card: React.CSSProperties = {
    background: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${glassBorder}`, borderRadius: "20px", padding: "28px",
};
const inputRow: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "18px" };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

interface ProfileTabProps {
    profileData: any;
    setProfileData: (data: any) => void;
}

export default function ProfileTab({ profileData, setProfileData }: ProfileTabProps) {
    return (
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
    );
}
