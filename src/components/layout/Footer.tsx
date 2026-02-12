"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Heart } from "lucide-react";

const quickLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/login", label: "Login" },
];

const supportLinks = [
    { href: "/docs", label: "Documentation" },
    { href: "/contact", label: "Contact Us" },
];

const socials = [
    { href: "https://github.com", icon: Github },
    { href: "https://twitter.com", icon: Twitter },
];

export function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--card-border)",
                background: "var(--card-bg)",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "64px 32px 0",
                }}
            >
                {/* Top Section — 4 columns on desktop */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr",
                        gap: "48px",
                    }}
                >
                    {/* Brand Column */}
                    <div>
                        <Link
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                textDecoration: "none",
                                marginBottom: "16px",
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
                                <Sparkles style={{ width: "16px", height: "16px", color: "white" }} />
                            </div>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    color: "var(--foreground)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Portfolio<span className="text-gradient">Hub</span>
                            </span>
                        </Link>
                        <p
                            style={{
                                color: "var(--foreground-muted)",
                                fontSize: "0.9rem",
                                lineHeight: 1.7,
                                maxWidth: "320px",
                                marginTop: "16px",
                            }}
                        >
                            Create stunning portfolios in minutes. Showcase your
                            work, land opportunities, and stand out from the crowd.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                color: "var(--foreground)",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginBottom: "20px",
                            }}
                        >
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {quickLinks.map((link) => (
                                <li key={link.href} style={{ marginBottom: "12px" }}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            color: "var(--foreground-muted)",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            transition: "color 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = "var(--foreground)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = "var(--foreground-muted)";
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4
                            style={{
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                color: "var(--foreground)",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginBottom: "20px",
                            }}
                        >
                            Support
                        </h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {supportLinks.map((link) => (
                                <li key={link.href} style={{ marginBottom: "12px" }}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            color: "var(--foreground-muted)",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            transition: "color 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = "var(--foreground)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = "var(--foreground-muted)";
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        borderTop: "1px solid var(--card-border)",
                        marginTop: "48px",
                        padding: "24px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.85rem",
                            color: "var(--foreground-dim)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            margin: 0,
                        }}
                    >
                        © {new Date().getFullYear()} PortfolioHub. Made with
                        <Heart
                            style={{
                                width: "14px",
                                height: "14px",
                                fill: "#f87171",
                                color: "#f87171",
                            }}
                        />
                        for students.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {socials.map(({ href, icon: Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--foreground-dim)",
                                    textDecoration: "none",
                                    transition: "color 0.2s, background 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--foreground)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--foreground-dim)";
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <Icon style={{ width: "18px", height: "18px" }} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
