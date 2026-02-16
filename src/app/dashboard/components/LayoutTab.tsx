"use client";

import { useState } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, Eye, EyeOff, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionHeader, Select, Textarea } from "./DashboardUI";
import { CustomSection } from "@/lib/types";
import { SECTION_CONFIGS } from "../section-configs";

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

// Map config labels
const SECTION_LABELS: Record<string, string> = {
    about: "About",
    contact: "Contact",
    ...Object.fromEntries(SECTION_CONFIGS.map(s => [s.id, s.label]))
};

// Minimal Icon Map for Custom Sections
import {
    User, Code, Briefcase, FolderOpen, Trophy, BookOpen, MessageSquare, Heart, Zap, Globe, Award, Layers, Calendar, MapPin, Building2, ExternalLink, GraduationCap, Download, Mail, Github, Linkedin
} from "lucide-react";

const ICON_MAP = {
    User, Code, Briefcase, FolderOpen, Trophy, BookOpen, MessageSquare, Star, Heart: Star, Zap, Globe, Award, Layers, Calendar, MapPin, Building2, ExternalLink, GraduationCap, Download, Mail, Github, Linkedin
};


interface LayoutTabProps {
    sectionOrder: string[];
    setSectionOrder: (order: string[]) => void;
    hiddenSections: string[];
    setHiddenSections: (sections: string[]) => void;
    customSections: CustomSection[];
    setCustomSections: (sections: CustomSection[]) => void;
}

export default function LayoutTab({
    sectionOrder, setSectionOrder, hiddenSections, setHiddenSections, customSections, setCustomSections
}: LayoutTabProps) {

    /* ─── CUSTOM SECTION MODAL STATE ─── */
    const [showAddSection, setShowAddSection] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [newSection, setNewSection] = useState<Partial<CustomSection>>({ type: "text", icon: "Star", visible: true });

    // For List/Grid builder inside modal
    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemDesc, setNewItemDesc] = useState("");
    const [newItemUrl, setNewItemUrl] = useState("");

    const handleToggleVisibility = (id: string) => {
        if (hiddenSections.includes(id)) {
            setHiddenSections(hiddenSections.filter(s => s !== id));
        } else {
            setHiddenSections([...hiddenSections, id]);
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!confirm("Are you sure you want to delete this section?")) return;
        setCustomSections(customSections.filter(s => s.id !== id));
        setSectionOrder(sectionOrder.filter(s => s !== id));
    };

    const handleEditSection = (section: CustomSection) => {
        setEditId(section.id);
        setNewSection({ ...section });
        setShowAddSection(true);
    };

    const handleSaveSection = () => {
        if (editId) {
            setCustomSections(customSections.map(s => s.id === editId ? { ...s, ...newSection } as CustomSection : s));
            setEditId(null);
        } else {
            const id = `custom-${Date.now()}`;
            const section: CustomSection = {
                id,
                title: newSection.title || "New Section",
                type: newSection.type as "text" | "list" | "grid" || "text",
                icon: newSection.icon || "Star",
                content: newSection.content || "",
                items: newSection.items || [],
                visible: true,
            };
            setCustomSections([...customSections, section]);
            setSectionOrder([...sectionOrder, id]);
        }
        setShowAddSection(false);
        setNewSection({ type: "text", icon: "Star", visible: true });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SectionHeader title="Layout & Visibility" subtitle="Reorder sections and toggle visibility. Add custom sections." />

            <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: fg }}>Sections Order</h3>
                    <Button onClick={() => setShowAddSection(true)} size="sm">
                        <Plus size={14} /> Add Custom Section
                    </Button>
                </div>

                <Reorder.Group axis="y" values={sectionOrder} onReorder={setSectionOrder} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sectionOrder.map((id) => {
                        const isCustom = id.startsWith("custom-");
                        const customSec = customSections.find(s => s.id === id);
                        const label = customSec?.title || SECTION_LABELS[id] || id;
                        const isHidden = hiddenSections.includes(id);

                        return (
                            <Reorder.Item key={id} value={id} style={{
                                ...miniCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "grab",
                                border: isHidden ? `1px dashed ${glassBorder}` : miniCard.border,
                                opacity: isHidden ? 0.6 : 1,
                            }}>
                                <div style={{ padding: "8px 4px", cursor: "grab", touchAction: "none", display: "flex", alignItems: "center" }}>
                                    <GripVertical size={18} style={{ color: fgDim }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{ fontWeight: 600, color: fg, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{label}</span>
                                    {isCustom && <span style={{ marginLeft: 8, fontSize: "0.7rem", padding: "2px 6px", borderRadius: 4, background: `${accent}20`, color: accent }}>Custom</span>}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <button onClick={() => handleToggleVisibility(id)} style={{ background: "none", border: "none", cursor: "pointer", color: isHidden ? fgDim : accent }}>
                                        {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {isCustom && (
                                        <>
                                            <button onClick={() => handleEditSection(customSec!)} style={{ background: "none", border: "none", cursor: "pointer", color: fgMuted }}>
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteSection(id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Reorder.Item>
                        );
                    })}
                </Reorder.Group>
            </div>

            {/* Add Section Modal */}
            <AnimatePresence>
                {showAddSection && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="responsive-modal-padding"
                            style={{ ...card, width: "100%", maxWidth: 500, padding: 32, background: "#0f172a" }}> {/* Force dark bg for modal */}
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: fg, marginBottom: 24 }}>{editId ? "Edit Section" : "Add Custom Section"}</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
                                {/* Title & Type */}
                                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
                                    <Input label="Section Title" value={newSection.title || ""} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} />
                                    <Select label="Layout Type" value={newSection.type || "text"} onChange={(v) => setNewSection({ ...newSection, type: v as any })}
                                        options={[{ value: "text", label: "Rich Text" }, { value: "list", label: "List Items" }, { value: "grid", label: "Grid Cards" }]} />
                                </div>

                                {/* Visual Icon Picker */}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: fgMuted, marginBottom: 10 }}>Section Icon</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px", background: glassBg, borderRadius: 12, border: `1px solid ${glassBorder}` }}>
                                        {Object.keys(ICON_MAP).map((iconName) => {
                                            const Icon = (ICON_MAP as any)[iconName] || Star;
                                            const isSelected = (newSection.icon || "Star") === iconName;
                                            return (
                                                <button key={iconName} onClick={() => setNewSection({ ...newSection, icon: iconName })}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: 8, border: isSelected ? `2px solid ${accent}` : "1px solid transparent",
                                                        background: isSelected ? `${accent}20` : "transparent", color: isSelected ? accent : fgDim,
                                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
                                                    }} title={iconName}>
                                                    <Icon size={18} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Content Editors */}
                                {newSection.type === "text" ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        <Textarea label="Content (Markdown)" value={newSection.content || ""} onChange={(v) => setNewSection({ ...newSection, content: v })} rows={8}
                                            placeholder={"## Hello World\nI am a **developer**.\n\nCheck out my [Website](https://example.com) or contact me!"} />
                                        <span style={{ fontSize: "0.8rem", color: fgMuted }}>
                                            Supports Markdown: <code style={{ background: glassBg, padding: "2px 4px", borderRadius: 4 }}>[Link Text](url)</code>, <strong>**Bold**</strong>, <em>*Italic*</em>, etc.
                                        </span>
                                    </div>
                                ) : (
                                    /* List/Grid Item Builder */
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        <div style={{ padding: "16px", background: glassBg, borderRadius: 12, border: `1px solid ${glassBorder}` }}>
                                            <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: fg, marginBottom: 12 }}>Add New Item</h4>
                                            <div style={{ display: "grid", gap: 12 }}>
                                                <Input label="Item Title" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} placeholder="e.g. Project Name or Skill" />
                                                <Input label="Description (Optional)" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} placeholder="Short description..." />
                                                <Input label="URL (Optional)" value={newItemUrl} onChange={(e) => setNewItemUrl(e.target.value)} placeholder="https://..." />
                                                <Button onClick={() => {
                                                    if (!newItemTitle) return;
                                                    const item = { title: newItemTitle, description: newItemDesc, url: newItemUrl };
                                                    const currentItems = (newSection.items || []) as any[];
                                                    setNewSection({ ...newSection, items: [...currentItems, item] });
                                                    setNewItemTitle(""); setNewItemDesc(""); setNewItemUrl("");
                                                }} size="sm" style={{ alignSelf: "start" }}><Plus size={14} /> Add Item</Button>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: fgMuted }}>Items ({newSection.items?.length || 0})</label>
                                            <Reorder.Group axis="y" values={(newSection.items || []) as any[]} onReorder={(newItems) => setNewSection({ ...newSection, items: newItems })} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                {(newSection.items || []).map((item: any, idx: number) => (
                                                    <Reorder.Item key={idx} value={item} style={{ ...miniCard, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "grab" }}>
                                                        <GripVertical size={16} style={{ color: fgDim }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600, color: fg, fontSize: "0.9rem" }}>{typeof item === 'string' ? item : item.title}</div>
                                                            {typeof item !== 'string' && item.description && <div style={{ fontSize: "0.75rem", color: fgMuted }}>{item.description}</div>}
                                                        </div>
                                                        <button onClick={() => {
                                                            const newItems = [...(newSection.items || [])];
                                                            newItems.splice(idx, 1);
                                                            setNewSection({ ...newSection, items: newItems });
                                                        }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={16} /></button>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                            {(!newSection.items || newSection.items.length === 0) && (
                                                <div style={{ textAlign: "center", padding: "20px", color: fgDim, fontSize: "0.85rem", border: `1px dashed ${glassBorder}`, borderRadius: 12 }}>
                                                    No items added yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: 12, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${glassBorder}` }}>
                                    <div style={{ flex: 1 }}>
                                        <Button onClick={() => { setShowAddSection(false); setEditId(null); setNewSection({ type: "text", icon: "Star", visible: true }); }} variant="secondary" style={{ width: '100%' }}>Cancel</Button>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Button onClick={handleSaveSection} style={{ width: '100%' }}>{editId ? "Save Changes" : "Create Section"}</Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
