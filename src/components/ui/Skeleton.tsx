"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, borderRadius, style }: SkeletonProps) {
    return (
        <div
            className={className}
            style={{
                width,
                height,
                borderRadius: borderRadius || 8,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                overflow: "hidden",
                position: "relative",
                ...style,
            }}
        >
            <motion.div
                animate={{
                    translateX: ["-100%", "100%"],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
                }}
            />
        </div>
    );
}

// Pre-built skeleton layouts for common use cases
export function DashboardSkeleton() {
    return (
        <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#0f172a" }}>
            {/* Sidebar Skeleton */}
            <div style={{
                width: 280, borderRight: "1px solid rgba(255,255,255,0.1)", padding: 24,
                display: "flex", flexDirection: "column", gap: 32
            }} className="sidebar-desktop">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Skeleton width={32} height={32} borderRadius={10} />
                    <Skeleton width={120} height={24} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} width="100%" height={40} borderRadius={12} />
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div style={{ flex: 1, padding: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                    <Skeleton width={200} height={32} />
                    <Skeleton width={100} height={32} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <Skeleton width="100%" height={180} borderRadius={16} />
                    <Skeleton width="100%" height={180} borderRadius={16} />
                    <Skeleton width="100%" height={180} borderRadius={16} style={{ gridColumn: "span 2" }} />
                </div>
            </div>
        </div>
    );
}
