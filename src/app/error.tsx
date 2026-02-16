"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background: "var(--background, #030310)",
                color: "var(--foreground, #e2e8f0)",
            }}
        >
            <div style={{ textAlign: "center", maxWidth: "420px" }}>
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                    }}
                >
                    <AlertCircle size={36} color="#f87171" />
                </div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
                    Something went wrong
                </h1>
                <p style={{ color: "var(--foreground-muted, #94a3b8)", marginBottom: "24px", fontSize: "0.95rem" }}>
                    An unexpected error occurred. You can try again or go back home.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Button onClick={reset}>
                        <RefreshCw size={16} style={{ marginRight: "8px" }} />
                        Try again
                    </Button>
                    <Link href="/">
                        <Button variant="secondary">Go home</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
