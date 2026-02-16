import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/google-sheets";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const data = await getPortfolioData(username);

        if (!data) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return formatted data for export
        const exportData = {
            exportedAt: new Date().toISOString(),
            username: data.profile.username,
            profile: {
                name: data.profile.full_name,
                tagline: data.profile.tagline,
                bio: data.profile.bio,
                email: data.profile.email,
                github: data.profile.github,
                linkedin: data.profile.linkedin,
                education: {
                    degree: data.profile.degree,
                    university: data.profile.university,
                    graduationYear: data.profile.graduation_year,
                },
            },
            experiences: data.experience.map((exp) => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                period: `${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date}`,
                type: exp.type,
                highlights: exp.description_points,
            })),
            projects: data.projects.map((proj) => ({
                title: proj.title,
                description: proj.description,
                techStack: proj.tech_stack,
                repoUrl: proj.repo_url,
                liveUrl: proj.live_url,
                featured: proj.featured,
            })),
            skills: data.skills.map((skill) => ({
                category: skill.category,
                items: skill.skills_list,
            })),
            education: data.education.map((edu) => ({
                degree: edu.degree,
                field: edu.field,
                institution: edu.institution,
                year: edu.year,
                isCurrent: edu.is_current,
            })),
        };

        return NextResponse.json(exportData);
    } catch (error) {
        console.error("Error exporting data:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
