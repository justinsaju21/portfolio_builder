import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "portfolio_session";
const MAX_AGE_DAYS = 30;

function getSecret(): string {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 16) {
        console.warn("AUTH_SECRET not set or too short; auth cookies will be insecure.");
        return process.env.GOOGLE_SHEET_ID || "fallback-secret-change-me";
    }
    return secret;
}

function sign(payload: string): string {
    const secret = getSecret();
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Create a signed session token for the given username.
 * Token format: base64(username:expiry).hex(signature)
 */
export function createSessionToken(username: string): string {
    const expiry = Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const payload = `${username}:${expiry}`;
    const encoded = Buffer.from(payload, "utf8").toString("base64url");
    const signature = sign(payload);
    return `${encoded}.${signature}`;
}

/**
 * Verify a session token and return the username, or null if invalid/expired.
 */
export function verifySessionToken(token: string): string | null {
    try {
        const [encoded, signature] = token.split(".");
        if (!encoded || !signature) return null;
        const payload = Buffer.from(encoded, "base64url").toString("utf8");
        const [username, expiryStr] = payload.split(":");
        const expiry = Number(expiryStr);
        if (!username || isNaN(expiry) || Date.now() > expiry) return null;
        if (sign(payload) !== signature) return null;
        return username;
    } catch {
        return null;
    }
}

/**
 * Set the session cookie on the response (call from login route).
 */
export function sessionCookieHeader(username: string): { name: string; value: string; options: Record<string, unknown> } {
    const token = createSessionToken(username);
    const isProd = process.env.NODE_ENV === "production";
    return {
        name: COOKIE_NAME,
        value: token,
        options: {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax" as const,
            maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
            path: "/",
        },
    };
}

/**
 * Get the authenticated username from the request (cookies). Returns null if not logged in or invalid.
 * Use in API routes that must verify the user can only edit their own data.
 */
export async function getAuthUsername(request: NextRequest): Promise<string | null> {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
}
