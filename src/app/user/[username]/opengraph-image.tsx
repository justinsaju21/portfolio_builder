import { ImageResponse } from "next/og";
import { getUserByUsername } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
    const { username } = await params;
    const data = await getUserByUsername(username);

    if (!data) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: "#0f172a",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 48,
                    }}
                >
                    User not found
                </div>
            ),
            { ...size }
        );
    }

    // Fallbacks
    const primary = data.primary_color || "#6366f1";
    const secondary = data.secondary_color || "#14b8a6";
    const name = data.full_name || username;
    const tagline = data.tagline || "Portfolio";

    return new ImageResponse(
        (
            <div
                style={{
                    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    fontFamily: '"Inter", sans-serif',
                }}
            >
                {/* Glass card effect */}
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "40px",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                        padding: "60px 80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        maxWidth: "80%",
                        textAlign: "center",
                    }}
                >
                    {data.profile_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.profile_image}
                            alt={name}
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 75,
                                objectFit: "cover",
                                border: "4px solid white",
                                marginBottom: 20,
                            }}
                        />
                    )}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            color: "white",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            textShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        {name}
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 0.9)",
                            fontFamily: "monospace",
                        }}
                    >
                        {tagline}
                    </div>
                </div>

                {/* Branding */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 40,
                        right: 50,
                        fontSize: 24,
                        fontWeight: 600,
                        color: "rgba(255, 255, 255, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    PortfolioHub
                </div>
            </div>
        ),
        {
            ...size,
            // We could load custom fonts here, but default system fonts are safer for now to avoid fetch issues
        }
    );
}
