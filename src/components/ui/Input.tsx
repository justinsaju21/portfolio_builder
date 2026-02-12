"use client";

import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, style, ...props }, ref) => {
        const [focused, setFocused] = useState(false);

        const inputStyle: React.CSSProperties = {
            width: "100%",
            padding: icon ? "14px 16px 14px 48px" : "14px 16px",
            fontSize: "0.9rem",
            color: "var(--foreground)",
            background: "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${focused ? "rgba(99,102,241,0.5)" : error ? "rgba(239,68,68,0.5)" : "var(--glass-border)"}`,
            borderRadius: "12px",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
            ...style,
        };

        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label
                        style={{
                            display: "block",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: "var(--foreground-muted)",
                            marginBottom: "8px",
                        }}
                    >
                        {label}
                    </label>
                )}
                <div style={{ position: "relative" }}>
                    {icon && (
                        <div
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--foreground-dim)",
                                display: "flex",
                                alignItems: "center",
                                pointerEvents: "none",
                            }}
                        >
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        style={inputStyle}
                        onFocus={(e) => {
                            setFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                </div>
                {error && (
                    <p style={{ marginTop: "4px", fontSize: "0.8rem", color: "#ef4444" }}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
