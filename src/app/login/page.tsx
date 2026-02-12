"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        pin: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("portfolio_user", formData.username);
            router.push("/dashboard");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background glows */}
            <div
                style={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    top: "15%",
                    left: "20%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)",
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
                    right: "20%",
                    background: "radial-gradient(circle, rgba(20,184,166,0.08), transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    pointerEvents: "none",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "420px",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        textDecoration: "none",
                        marginBottom: "32px",
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                        }}
                    >
                        <Sparkles style={{ width: "20px", height: "20px", color: "white" }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.35rem", color: "var(--foreground)" }}>
                        Portfolio<span className="text-gradient">Hub</span>
                    </span>
                </Link>

                {/* Card */}
                <div
                    style={{
                        background: "var(--glass-bg)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "24px",
                        padding: "40px 32px",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                color: "var(--foreground)",
                                marginBottom: "8px",
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
                            Login to manage your portfolio
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Input
                                label="Username"
                                placeholder="yourname"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "") })
                                }
                                icon={<User style={{ width: "18px", height: "18px" }} />}
                                required
                            />

                            <Input
                                label="PIN"
                                type="password"
                                placeholder="••••"
                                maxLength={6}
                                value={formData.pin}
                                onChange={(e) =>
                                    setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })
                                }
                                icon={<Lock style={{ width: "18px", height: "18px" }} />}
                                required
                            />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        background: "rgba(239,68,68,0.08)",
                                        border: "1px solid rgba(239,68,68,0.2)",
                                        color: "#f87171",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button type="submit" loading={loading} style={{ width: "100%", marginTop: "4px" }}>
                                Login
                                <ArrowRight style={{ width: "18px", height: "18px" }} />
                            </Button>
                        </div>
                    </form>

                    <div
                        style={{
                            marginTop: "24px",
                            textAlign: "center",
                            fontSize: "0.875rem",
                            color: "var(--foreground-muted)",
                        }}
                    >
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

                {/* Demo link */}
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "0.85rem",
                        color: "var(--foreground-dim)",
                        marginTop: "24px",
                    }}
                >
                    Just want to view a portfolio?{" "}
                    <Link
                        href="/demo"
                        style={{ color: "var(--foreground-muted)", textDecoration: "none" }}
                    >
                        See demo →
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
