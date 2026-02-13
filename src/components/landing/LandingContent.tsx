"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Sparkles,
    Zap,
    Shield,
    Download,
    Globe,
    Palette,
    Users,
    Star,
    Code2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Create your portfolio in under 5 minutes with our intuitive form-based editor.",
        gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
    {
        icon: Globe,
        title: "Instant Hosting",
        description:
            "Your portfolio goes live immediately at a unique URL you can share anywhere.",
        gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    },
    {
        icon: Palette,
        title: "Beautiful Designs",
        description:
            "Modern, responsive templates that look stunning on every device and screen size.",
        gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    },
    {
        icon: Shield,
        title: "Your Data, Your Control",
        description:
            "Download your portfolio code anytime. Deploy it yourself whenever you want.",
        gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    },
    {
        icon: Users,
        title: "Built for Students",
        description:
            "Designed specifically for students to showcase projects and land internships.",
        gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    },
    {
        icon: Download,
        title: "Export Anytime",
        description:
            "Get your data as JSON or download the full Next.js source code to self-host.",
        gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    },
];

const steps = [
    {
        number: "01",
        title: "Sign Up",
        description:
            "Create your account with just a username and PIN. No email required.",
    },
    {
        number: "02",
        title: "Fill Your Details",
        description:
            "Enter your education, projects, skills, and experience using our easy form.",
    },
    {
        number: "03",
        title: "Go Live!",
        description:
            "Your portfolio is instantly available at your-domain.com/yourname.",
    },
];

export function LandingContent() {
    return (
        <div style={{ overflow: "hidden" }}>
            <style>{`
                @media (max-width: 768px) {
                    .landing-features-grid { grid-template-columns: 1fr !important; }
                    .landing-steps-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                    .landing-cta-card { padding: 48px 24px !important; }
                }
            `}</style>
            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "120px 24px 80px",
                }}
            >
                {/* Ambient glow orbs */}
                <div
                    style={{
                        position: "absolute",
                        width: "500px",
                        height: "500px",
                        top: "10%",
                        left: "10%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        width: "400px",
                        height: "400px",
                        bottom: "15%",
                        right: "10%",
                        background: "radial-gradient(circle, rgba(20,184,166,0.1), transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", width: "100%", textAlign: "center" }}>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 20px",
                                borderRadius: "50px",
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.15)",
                                color: "#818cf8",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                marginBottom: "32px",
                            }}
                        >
                            <Sparkles style={{ width: "16px", height: "16px" }} />
                            Free for Students
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{
                            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            marginBottom: "24px",
                            color: "var(--foreground)",
                        }}
                    >
                        Create Your{" "}
                        <span className="text-gradient">Professional Portfolio</span>
                        <br />
                        In Minutes, Not Hours
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            fontSize: "1.125rem",
                            color: "var(--foreground-muted)",
                            maxWidth: "560px",
                            margin: "0 auto 40px",
                            lineHeight: 1.7,
                        }}
                    >
                        No coding required. Just fill in your details and get a stunning,
                        hosted portfolio at{" "}
                        <strong style={{ color: "var(--foreground)" }}>
                            your-domain.com/yourname
                        </strong>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "16px",
                            marginBottom: "48px",
                        }}
                    >
                        <Link href="/signup">
                            <Button size="lg">
                                Create Your Portfolio
                                <ArrowRight style={{ width: "20px", height: "20px" }} />
                            </Button>
                        </Link>
                        <Link href="/demo">
                            <Button variant="secondary" size="lg">
                                See Demo Portfolio
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "32px",
                            color: "var(--foreground-dim)",
                            fontSize: "0.875rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ display: "flex" }}>
                                {[
                                    "linear-gradient(135deg, #a855f7, #ec4899)",
                                    "linear-gradient(135deg, #3b82f6, #06b6d4)",
                                    "linear-gradient(135deg, #10b981, #34d399)",
                                    "linear-gradient(135deg, #f59e0b, #f97316)",
                                ].map((gradient, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background: gradient,
                                            border: "2px solid var(--background)",
                                            marginLeft: i > 0 ? "-8px" : "0",
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ fontWeight: 500 }}>Used by 500+ students</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        fill: "#fbbf24",
                                        color: "#fbbf24",
                                    }}
                                />
                            ))}
                            <span style={{ marginLeft: "6px", fontWeight: 500 }}>4.9/5 rating</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ FEATURES SECTION ═══════════════ */}
            <section
                id="features"
                style={{ padding: "100px 24px", position: "relative" }}
            >
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: "center", marginBottom: "64px" }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                borderRadius: "50px",
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.15)",
                                color: "#818cf8",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                marginBottom: "20px",
                            }}
                        >
                            ✦ Features
                        </span>
                        <h2
                            style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                marginBottom: "16px",
                                color: "var(--foreground)",
                            }}
                        >
                            Everything You Need
                        </h2>
                        <p
                            style={{
                                color: "var(--foreground-muted)",
                                fontSize: "1.05rem",
                                maxWidth: "500px",
                                margin: "0 auto",
                                lineHeight: 1.6,
                            }}
                        >
                            We handle the technical stuff so you can focus on
                            showcasing your amazing work.
                        </p>
                    </motion.div>

                    {/* Feature Cards Grid */}
                    <div
                        className="landing-features-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "24px",
                        }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.5 }}
                                whileHover={{ y: -6 }}
                                style={{
                                    background: "var(--glass-bg)",
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    border: "1px solid var(--glass-border)",
                                    borderRadius: "20px",
                                    padding: "32px",
                                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--glass-border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "14px",
                                        background: feature.gradient,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <feature.icon style={{ width: "24px", height: "24px", color: "white" }} />
                                </div>
                                <h3
                                    style={{
                                        fontSize: "1.1rem",
                                        fontWeight: 700,
                                        color: "var(--foreground)",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    style={{
                                        color: "var(--foreground-muted)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}
                                >
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ HOW IT WORKS ═══════════════ */}
            <section
                id="how-it-works"
                style={{
                    padding: "100px 24px",
                    background: "linear-gradient(180deg, var(--card-bg) 0%, var(--background) 100%)",
                }}
            >
                <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: "center", marginBottom: "64px" }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                borderRadius: "50px",
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.15)",
                                color: "#818cf8",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                marginBottom: "20px",
                            }}
                        >
                            ✦ How It Works
                        </span>
                        <h2
                            style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                marginBottom: "16px",
                                color: "var(--foreground)",
                            }}
                        >
                            Three Simple Steps
                        </h2>
                        <p
                            style={{
                                color: "var(--foreground-muted)",
                                fontSize: "1.05rem",
                                maxWidth: "480px",
                                margin: "0 auto",
                                lineHeight: 1.6,
                            }}
                        >
                            From signup to a live portfolio in under 5 minutes.
                        </p>
                    </motion.div>

                    {/* Steps */}
                    <div
                        className="landing-steps-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "48px",
                        }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                style={{ textAlign: "center" }}
                            >
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "24px",
                                        background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "24px",
                                        boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 800,
                                            color: "white",
                                        }}
                                    >
                                        {step.number}
                                    </span>
                                </div>
                                <h3
                                    style={{
                                        fontSize: "1.15rem",
                                        fontWeight: 700,
                                        color: "var(--foreground)",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        color: "var(--foreground-muted)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.65,
                                        maxWidth: "260px",
                                        margin: "0 auto",
                                    }}
                                >
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA SECTION ═══════════════ */}
            <section style={{ padding: "100px 24px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="landing-cta-card"
                        style={{
                            background: "var(--glass-bg)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "28px",
                            padding: "72px 48px",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Inner glow */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-60px",
                                right: "-60px",
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)",
                                pointerEvents: "none",
                            }}
                        />

                        <h2
                            style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                marginBottom: "16px",
                                color: "var(--foreground)",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Ready to{" "}
                            <span className="text-gradient">Stand Out</span>?
                        </h2>
                        <p
                            style={{
                                color: "var(--foreground-muted)",
                                fontSize: "1.05rem",
                                maxWidth: "480px",
                                margin: "0 auto 32px",
                                lineHeight: 1.65,
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Join hundreds of students who are already showcasing
                            their work with PortfolioHub.
                        </p>
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <Link href="/signup">
                                <Button size="lg">
                                    Create Your Free Portfolio
                                    <ArrowRight style={{ width: "20px", height: "20px" }} />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
