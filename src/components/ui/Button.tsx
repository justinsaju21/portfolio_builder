"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    loading?: boolean;
}

const sizeStyles = {
    sm: { fontSize: "0.875rem", padding: "8px 18px", borderRadius: "12px" },
    md: { fontSize: "0.95rem", padding: "12px 24px", borderRadius: "14px" },
    lg: { fontSize: "1rem", padding: "14px 32px", borderRadius: "16px" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, loading, disabled, style, ...props }, ref) => {
        const base: React.CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: 600,
            cursor: disabled || loading ? "not-allowed" : "pointer",
            opacity: disabled || loading ? 0.5 : 1,
            transition: "all 0.3s ease",
            border: "none",
            outline: "none",
            textDecoration: "none",
            width: className?.includes("w-full") ? "100%" : undefined,
            ...sizeStyles[size],
        };

        const variantStyles: Record<string, React.CSSProperties> = {
            primary: {
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.35)",
            },
            secondary: {
                background: "var(--glass-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(12px)",
            },
            ghost: {
                background: "transparent",
                color: "var(--foreground-muted)",
                padding: sizeStyles[size].padding,
            },
        };

        return (
            <button
                ref={ref}
                style={{ ...base, ...variantStyles[variant], ...style }}
                disabled={disabled || loading}
                onMouseEnter={(e) => {
                    if (variant === "primary") {
                        e.currentTarget.style.boxShadow = "0 6px 30px rgba(99, 102, 241, 0.5)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    } else if (variant === "secondary") {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    } else {
                        e.currentTarget.style.color = "var(--foreground)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (variant === "primary") {
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.35)";
                        e.currentTarget.style.transform = "translateY(0)";
                    } else if (variant === "secondary") {
                        e.currentTarget.style.borderColor = "var(--glass-border)";
                        e.currentTarget.style.transform = "translateY(0)";
                    } else {
                        e.currentTarget.style.color = "var(--foreground-muted)";
                        e.currentTarget.style.background = "transparent";
                    }
                }}
                {...props}
            >
                {loading && (
                    <svg
                        style={{ animation: "spin 1s linear infinite", width: "16px", height: "16px" }}
                        viewBox="0 0 24 24"
                    >
                        <circle opacity={0.25} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path opacity={0.75} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
