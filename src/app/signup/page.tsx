"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"form" | "success">("form");
    const [createdUsername, setCreatedUsername] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        email: "",
        pin: "",
        confirm_pin: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.pin !== formData.confirm_pin) {
            setError("PINs do not match");
            return;
        }
        if (formData.pin.length < 4) {
            setError("PIN must be at least 4 digits");
            return;
        }
        if (formData.username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    full_name: formData.full_name,
                    email: formData.email,
                    password_pin: formData.pin,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Signup failed");
                return;
            }
            const canonicalUsername = data.username || formData.username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
            setCreatedUsername(canonicalUsername);
            setFormData((prev) => ({ ...prev, username: canonicalUsername }));
            setStep("success");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "24px",
        padding: "40px 32px",
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
                    top: "10%",
                    right: "15%",
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
                    bottom: "10%",
                    left: "15%",
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
                    maxWidth: "460px",
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

                {step === "form" ? (
                    <div style={cardStyle}>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <h1
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: "var(--foreground)",
                                    marginBottom: "8px",
                                }}
                            >
                                Create Your Portfolio
                            </h1>
                            <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
                                Get started in under 5 minutes
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div>
                                    <Input
                                        label="Choose a Username"
                                        placeholder="yourname (letters, numbers, _ -)"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                                            })
                                        }
                                        icon={<User style={{ width: "18px", height: "18px" }} />}
                                        required
                                    />
                                    <p
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--foreground-dim)",
                                            marginTop: "6px",
                                        }}
                                    >
                                        Your portfolio will be at:{" "}
                                        <span style={{ color: "var(--foreground-muted)", fontWeight: 500 }}>
                                            portfoliohub.com/{formData.username || "yourname"}
                                        </span>
                                    </p>
                                </div>

                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, full_name: e.target.value })
                                    }
                                    required
                                />

                                <Input
                                    label="Email (optional)"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    icon={<Mail style={{ width: "18px", height: "18px" }} />}
                                />

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <Input
                                        label="Create PIN"
                                        type="password"
                                        placeholder="••••"
                                        maxLength={20}
                                        value={formData.pin}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pin: e.target.value.replace(/\D/g, ""),
                                            })
                                        }
                                        icon={<Lock style={{ width: "18px", height: "18px" }} />}
                                        required
                                    />
                                    <Input
                                        label="Confirm PIN"
                                        type="password"
                                        placeholder="••••"
                                        maxLength={20}
                                        value={formData.confirm_pin}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirm_pin: e.target.value.replace(/\D/g, ""),
                                            })
                                        }
                                        icon={<Lock style={{ width: "18px", height: "18px" }} />}
                                        required
                                    />
                                </div>

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
                                    Create Portfolio
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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div style={{ ...cardStyle, textAlign: "center" as const }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #34d399, #10b981)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                            }}
                        >
                            <Check style={{ width: "40px", height: "40px", color: "white" }} />
                        </motion.div>

                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                color: "var(--foreground)",
                                marginBottom: "8px",
                            }}
                        >
                            Account Created!
                        </h2>
                        <p style={{ color: "var(--foreground-muted)", marginBottom: "24px", fontSize: "0.95rem" }}>
                            Your portfolio is now live at:
                        </p>
                        <div
                            style={{
                                padding: "14px 20px",
                                borderRadius: "12px",
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                marginBottom: "24px",
                            }}
                        >
                            <code style={{ color: "#818cf8", fontFamily: "monospace", fontSize: "0.95rem" }}>
                                your-site.com/{createdUsername || formData.username}
                            </code>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <Button
                                style={{ width: "100%" }}
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const loginRes = await fetch("/api/auth/login", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ username: createdUsername, pin: formData.pin }),
                                        });
                                        const loginData = await loginRes.json();
                                        if (loginRes.ok && loginData.username) {
                                            localStorage.setItem("portfolio_user", loginData.username);
                                            router.push("/dashboard");
                                            return;
                                        }
                                    } catch { /* fallback to login page */ }
                                    setLoading(false);
                                    router.push("/login");
                                }}
                                loading={loading}
                            >
                                Go to Dashboard
                                <ArrowRight style={{ width: "18px", height: "18px" }} />
                            </Button>
                            <Link href={`/${createdUsername || formData.username}`}>
                                <Button variant="secondary" style={{ width: "100%" }}>
                                    View Your Portfolio
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
