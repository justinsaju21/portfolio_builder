"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={hover ? { y: -5, scale: 1.01 } : undefined}
            className={cn(
                "glass-card p-6 h-full flex flex-col transition-all duration-300",
                hover && "cursor-pointer",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
