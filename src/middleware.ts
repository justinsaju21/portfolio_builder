import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, test.localhost:3000)
    const hostname = req.headers.get("host") || "portfolio-platform.vercel.app";

    // Define allowed platforms (main domains)
    // In production, this would be your actual domain
    const searchParams = url.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // Get the subdomain from the hostname
    // Example: "justin.localhost:3000" -> subdomain stays "justin"
    // Example: "portfoliohub.com" -> path stays as is

    // Check if we are on localhost for development
    const isLocalhost = hostname.includes("localhost");

    let subdomain = "";
    if (isLocalhost) {
        // Handle localhost development
        const parts = hostname.split(".");
        if (parts.length > 1) {
            subdomain = parts[0];
        }
    } else {
        // Handle production domains
        // This logic assumes you have one main domain and all others are subdomains
        const parts = hostname.split(".");
        // If it's user.yourdomain.com, parts.length will be 3
        if (parts.length > 2) {
            subdomain = parts[0];
        }
    }

    // Special case handling for 'www' and the app's own subdomain
    if (subdomain === "www" || subdomain === "myportfolio" || subdomain === "portfolio") subdomain = "";

    // If there is a subdomain, rewrite to /[username] path
    if (subdomain && subdomain !== "") {
        console.log(`Rewriting subdomain ${subdomain} to /${subdomain}${path}`);
        return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
    }

    return NextResponse.next();
}
