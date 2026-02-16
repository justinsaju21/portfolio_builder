import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, updateUserProfile, ensureSheetsExist } from "@/lib/google-sheets";
import { getAuthUsername } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Ensure database integrity (sheets + headers)
        await ensureSheetsExist(username);

        const data = await getPortfolioData(username);

        if (!data) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const body = await request.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const authUser = await getAuthUsername(request);
        if (!authUser || authUser.toLowerCase() !== username.toLowerCase()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const success = await updateUserProfile(username, body);

        if (!success) {
            return NextResponse.json({ error: "Failed to update" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
