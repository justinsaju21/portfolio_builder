import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByUsername } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, full_name, email, password_pin } = body;

        // Validation
        if (!username || !full_name || !password_pin) {
            return NextResponse.json(
                { error: "Username, full name, and PIN are required" },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: "Username must be at least 3 characters" },
                { status: 400 }
            );
        }

        if (password_pin.length < 4) {
            return NextResponse.json(
                { error: "PIN must be at least 4 digits" },
                { status: 400 }
            );
        }

        // Check if username exists
        const existing = await getUserByUsername(username);
        if (existing) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Create user
        const success = await createUser({
            username: username.toLowerCase(),
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
        });

        if (!success) {
            return NextResponse.json(
                { error: "Failed to create account. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, username });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
