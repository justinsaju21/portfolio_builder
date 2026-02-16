import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/lib/google-sheets";
import { sessionCookieHeader } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, pin } = body;

        if (!username || !pin) {
            return NextResponse.json(
                { error: "Username and PIN are required" },
                { status: 400 }
            );
        }

        const isValid = await verifyLogin(username, pin);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid username or PIN" },
                { status: 401 }
            );
        }

        const normalizedUsername = username.toLowerCase().trim();
        const response = NextResponse.json({ success: true, username: normalizedUsername });
        const { name, value, options } = sessionCookieHeader(normalizedUsername);
        response.cookies.set(name, value, options);
        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
