"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ItemCard, AddButton, SectionHeader, Textarea, Select, Checkbox } from "./DashboardUI";
import { Input } from "@/components/ui/Input";
import { Plus, X } from "lucide-react";

/* ─── TYPES ─── */
export type FieldType = "text" | "textarea" | "date" | "select" | "checkbox" | "list";

export interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: { value: string; label: string }[]; // for select
    required?: boolean;
}

export interface SectionConfig {
    id: string;
    label: string;
    icon: any;
    category: string;
    fields: FieldConfig[];
    renderSubtitle: (item: any) => string;
    renderBadges?: (item: any) => string[];
}

const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px",
};
const inputRow: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "18px" };

interface GenericSectionProps {
    config: SectionConfig;
    data: any[];
    onAdd: (item: any) => Promise<void>;
    onDelete: (index: number) => Promise<void>;
    actionLoading: string | null;
}

export default function GenericSection({ config, data, onAdd, onDelete, actionLoading }: GenericSectionProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState<any>({});

    // Helper state for list inputs (e.g. description points)
    const [tempListInput, setTempListInput] = useState<Record<string, string>>({});

    const handleAdd = async () => {
        // Validate required fields
        const missing = config.fields.filter(f => f.required && !newItem[f.name]);
        if (missing.length > 0) {
            alert(`Please fill in required fields: ${missing.map(f => f.label).join(", ")}`);
            return;
        }
        await onAdd(newItem);
        setNewItem({});
        setShowAdd(false);
    };

    const handleListAdd = (fieldName: string) => {
        const val = tempListInput[fieldName]?.trim();
        if (!val) return;
        const currentList = newItem[fieldName] || [];
        setNewItem({ ...newItem, [fieldName]: [...currentList, val] });
        setTempListInput({ ...tempListInput, [fieldName]: "" });
    };

    const handleListRemove = (fieldName: string, index: number) => {
        const currentList = newItem[fieldName] || [];
        setNewItem({ ...newItem, [fieldName]: currentList.filter((_: any, i: number) => i !== index) });
    };

    // Initialize default values based on type
    const getInitialValue = (field: FieldConfig) => {
        if (field.type === "checkbox") return false;
        if (field.type === "list") return [];
        return "";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SectionHeader title={config.label} subtitle={`Manage your ${config.label.toLowerCase()}.`} />

            {/* List Existing Items */}
            {data.map((item, i) => (
                <ItemCard key={i}
                    title={item.title || item.name || item.company || item.organization || item.university || item.event_name || item.club_name || item.exam_name || item.startup_name || item.provider || "Untitled"}
                    subtitle={config.renderSubtitle(item)}
                    badges={config.renderBadges ? config.renderBadges(item) : undefined}
                    onDelete={() => onDelete(i)}
                    loading={actionLoading === `del-${config.id}-${i}`}
                >
                    {/* Render specific children for lists if needed, e.g. description_points */}
                    {item.description_points && Array.isArray(item.description_points) && item.description_points.length > 0 && (
                        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--foreground-muted)", fontSize: "0.8rem", lineHeight: 1.8 }}>
                            {item.description_points.map((p: string, j: number) => <li key={j}>{p}</li>)}
                        </ul>
                    )}
                </ItemCard>
            ))}

            <AddButton show={showAdd} setShow={setShowAdd} label={`Add ${config.label}`} />

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden" }}>
                        <div style={card}>
                            <h4 style={{ fontWeight: 700, color: "var(--foreground)", marginBottom: 18, fontSize: "0.95rem" }}>New {config.label}</h4>
                            <div style={inputRow}>
                                {config.fields.map((field) => {
                                    const val = newItem[field.name] !== undefined ? newItem[field.name] : getInitialValue(field);

                                    if (field.type === "textarea") {
                                        return <Textarea key={field.name} label={field.label} value={val}
                                            onChange={(v) => setNewItem({ ...newItem, [field.name]: v })}
                                            placeholder={field.placeholder} />;
                                    }
                                    if (field.type === "select") {
                                        return <Select key={field.name} label={field.label} value={val}
                                            onChange={(v) => setNewItem({ ...newItem, [field.name]: v })}
                                            options={field.options || []} />;
                                    }
                                    if (field.type === "checkbox") {
                                        return <Checkbox key={field.name} label={field.label} checked={!!val}
                                            onChange={(v) => setNewItem({ ...newItem, [field.name]: v })} />;
                                    }
                                    if (field.type === "list") {
                                        return (
                                            <div key={field.name}>
                                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--foreground-muted)", marginBottom: "8px" }}>{field.label}</label>
                                                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                                    <Input value={tempListInput[field.name] || ""}
                                                        onChange={(e) => setTempListInput({ ...tempListInput, [field.name]: e.target.value })}
                                                        placeholder={field.placeholder} />
                                                    <button onClick={() => handleListAdd(field.name)} style={{
                                                        background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", border: "none", borderRadius: 8,
                                                        width: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                                    }}><Plus size={18} /></button>
                                                </div>
                                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                                                    {(val as string[]).map((p, i) => (
                                                        <li key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground)", background: "rgba(255,255,255,0.02)", padding: "6px 12px", borderRadius: 8 }}>
                                                            <span>{p}</span>
                                                            <button onClick={() => handleListRemove(field.name, i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}><X size={14} /></button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    }
                                    // Default text input
                                    return <Input key={field.name} label={field.label} value={val}
                                        onChange={(e) => setNewItem({ ...newItem, [field.name]: e.target.value })}
                                        placeholder={field.placeholder} />;
                                })}
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                                <button onClick={() => setShowAdd(false)} style={{ padding: "10px 20px", borderRadius: 12, background: "transparent", color: "var(--foreground-muted)", border: "none", cursor: "pointer" }}>Cancel</button>
                                <button onClick={handleAdd} style={{ padding: "10px 24px", borderRadius: 12, background: "#6366f1", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>Save</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
