"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 80], [0.6, 0.95]);
    const borderOpacity = useTransform(scrollY, [0, 80], [0.06, 0.12]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: "12px 16px",
            }}
        >
            <motion.div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    borderRadius: "16px",
                    padding: "0",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    overflow: "hidden",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.25)",
                }}
            >
                {/* Use a layered approach for the dynamic background */}
                <motion.div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "16px",
                        background: "rgba(10,10,30,1)",
                        opacity: bgOpacity,
                        pointerEvents: "none",
                    }}
                />
                <motion.div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "16px",
                        border: "1px solid rgba(100,100,255,1)",
                        opacity: borderOpacity,
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 24px",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            textDecoration: "none",
                        }}
                    >
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                            }}
                        >
                            <Sparkles style={{ width: "18px", height: "18px", color: "white" }} />
                        </div>
                        <span
                            style={{
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                color: "var(--foreground)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Portfolio<span className="text-gradient">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                        className="hidden md:flex"
                    >
                        {[
                            { href: "#features", label: "Features" },
                            { href: "#how-it-works", label: "How It Works" },
                            { href: "/login", label: "Login" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "var(--foreground-muted)",
                                    textDecoration: "none",
                                    borderRadius: "10px",
                                    transition: "color 0.2s, background 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--foreground)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--foreground-muted)";
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div style={{ marginLeft: "8px" }}>
                            <Link href="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden"
                        style={{
                            padding: "8px",
                            color: "var(--foreground-muted)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "10px",
                        }}
                    >
                        {isOpen ? (
                            <X style={{ width: "24px", height: "24px" }} />
                        ) : (
                            <Menu style={{ width: "24px", height: "24px" }} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            position: "relative",
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            padding: "12px 24px 16px",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {[
                                { href: "#features", label: "Features" },
                                { href: "#how-it-works", label: "How It Works" },
                                { href: "/login", label: "Login" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        padding: "12px 12px",
                                        fontSize: "0.9rem",
                                        color: "var(--foreground-muted)",
                                        textDecoration: "none",
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                style={{ marginTop: "4px" }}
                            >
                                <Button className="w-full" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.nav>
    );
}
