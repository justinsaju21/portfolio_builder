import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByUsername, ensureSheetsExist } from "@/lib/google-sheets";
import { z } from "zod";

const SignupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
    full_name: z.string().min(1, "Full name is required").max(200, "Full name is too long"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    password_pin: z.string().min(4, "PIN must be at least 4 characters").max(20, "PIN is too long"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = SignupSchema.safeParse(body);

        if (!parsed.success) {
            const first = parsed.error.issues[0];
            return NextResponse.json(
                { error: first?.message || "Validation failed" },
                { status: 400 }
            );
        }

        const { username, full_name, email, password_pin } = parsed.data;
        const normalizedUsername = username.toLowerCase();

        // Check if username exists
        const existing = await getUserByUsername(normalizedUsername);
        if (existing) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Create user
        const success = await createUser({
            username: normalizedUsername,
            password_pin,
            full_name,
            email: email || "",
            tagline: "",
            github: "",
            linkedin: "",
            bio: "",
            degree: "",
            university: "",
            graduation_year: "",
            theme_preference: "modern",
            profile_image: "",
            primary_color: "#6366f1",
            secondary_color: "#14b8a6",
            font_choice: "inter",
            card_style: "glass",
            animation_enabled: true,
            section_order: "about,skills,experience,projects,leadership,education,contact",
            section_visibility: "",
            custom_sections: "[]",
            resume_url: "",
            bg_color: "#030310",
            surface_color: "rgba(255,255,255,0.03)",
            text_primary: "#e2e8f0",
            text_muted: "#94a3b8",
            text_dim: "#64748b",
            heading_font: "Inter",
            body_font: "Inter",
            button_style: "solid",
            container_width: "normal",
            custom_css: "",
            color_theme: "dark",
            rss_url: "",
            google_analytics_id: "",
            status_badge: "none",
            timeline_view: false,
            github_fetching: false,
        });

        if (!success) {
            return NextResponse.json(
                { error: "Failed to create account. Please try again." },
                { status: 500 }
            );
        }

        // Initialize user's sheets/database
        await ensureSheetsExist(normalizedUsername);

        return NextResponse.json({ success: true, username: normalizedUsername });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
