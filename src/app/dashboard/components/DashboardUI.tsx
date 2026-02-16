"use client";

import { motion } from "framer-motion";
import { Trash2, ChevronUp, Plus, Check } from "lucide-react";
import { ReactNode } from "react";

/* ─── STYLE CONSTANTS ─── */
const accent = "#6366f1";
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

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: fg, marginBottom: "6px" }}>{title}</h2>
        <p style={{ color: fgMuted, fontSize: "0.9rem" }}>{subtitle}</p>
    </div>
);

export const ItemCard = ({ title, subtitle, badges, onDelete, loading, children }: {
    title: string; subtitle: string; badges?: string[];
    onDelete: () => void; loading: boolean; children?: ReactNode;
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
                onClick={onDelete}
                disabled={loading}
                style={{
                    background: "rgba(239,68,68,0.08)", border: "none", cursor: "pointer",
                    padding: "8px", borderRadius: "10px", color: "#f87171", flexShrink: 0,
                    transition: "all 0.2s", opacity: loading ? 0.5 : 1,
                }}
                title="Delete"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </motion.div>
);

export const AddButton = ({ show, setShow, label }: { show: boolean; setShow: (v: boolean) => void; label: string }) => (
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

export const Textarea = ({ label, value, onChange, placeholder, rows = 3 }: {
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

export const Select = ({ label, value, onChange, options }: {
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

export const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
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
