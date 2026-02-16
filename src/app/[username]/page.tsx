import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/google-sheets";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

interface PageProps {
    params: Promise<{ username: string }>;
}

// Revalidate immediately for real-time updates
export const revalidate = 0;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const data = await getPortfolioData(username);

    if (!data) {
        return {
            title: "Portfolio Not Found",
        };
    }

    const name = data.profile.full_name;
    const tagline = data.profile.tagline || `${name}'s professional portfolio`;
    const profileImage = data.profile.profile_image;

    return {
        title: `${name} | Portfolio`,
        description: tagline,
        openGraph: {
            title: `${name} | Portfolio`,
            description: tagline,
            type: "profile",
            firstName: name.split(" ")[0],
            lastName: name.split(" ").slice(1).join(" "),
            username: username,
            images: profileImage ? [{ url: profileImage }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: `${name} | Portfolio`,
            description: tagline,
            images: profileImage ? [profileImage] : [],
        },
    };
}

export default async function PortfolioPage({ params }: PageProps) {
    const { username } = await params;
    const data = await getPortfolioData(username);

    if (!data) {
        notFound();
    }

    return <PortfolioView data={data} />;
}
