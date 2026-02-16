import { NextRequest, NextResponse } from "next/server";
import { addSectionRow, deleteSectionRow, getSectionSheetName } from "@/lib/google-sheets";
import { getAuthUsername } from "@/lib/auth";
import {
    ExperienceSchema,
    ProjectSchema,
    SkillSchema,
    EducationSchema,
    LeadershipSchema,
    HackathonSchema,
    ResearchSchema,
    EntrepreneurshipSchema,
    CertificationSchema,
    ExamSchema,
    SportsCulturalSchema,
    VolunteeringSchema,
    ScholarshipSchema,
    ClubActivitySchema,
    DeptContributionSchema,
    ProfessionalMembershipSchema,
    ReferenceSchema,
} from "@/lib/types";
import { z } from "zod";

// Map section names to their Zod schemas (without username — we inject it)
const sectionSchemas: Record<string, z.ZodTypeAny> = {
    experience: ExperienceSchema,
    projects: ProjectSchema,
    skills: SkillSchema,
    education: EducationSchema,
    leadership: LeadershipSchema,
    hackathons: HackathonSchema,
    research: ResearchSchema,
    entrepreneurship: EntrepreneurshipSchema,
    certifications: CertificationSchema,
    exams: ExamSchema,
    sports_cultural: SportsCulturalSchema,
    volunteering: VolunteeringSchema,
    scholarships: ScholarshipSchema,
    club_activities: ClubActivitySchema,
    dept_contributions: DeptContributionSchema,
    professional_memberships: ProfessionalMembershipSchema,
    references: ReferenceSchema,
};

/**
 * POST /api/user/[username]/sections
 * Body: { section: "experience" | "projects" | ..., data: { ...fields } }
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const authUser = await getAuthUsername(request);
        if (!authUser || authUser.toLowerCase() !== username.toLowerCase()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json({ error: "section and data are required" }, { status: 400 });
        }

        const sheetName = getSectionSheetName(section);
        if (!sheetName) {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        // Inject username into data for validation
        const fullData = { ...data, username };

        // Validate with Zod
        const schema = sectionSchemas[section];
        if (schema) {
            const result = schema.safeParse(fullData);
            if (!result.success) {
                const errors = result.error.issues.map((i: z.ZodIssue) => `${i.path.join(".")}: ${i.message}`);
                return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
            }
        }

        const success = await addSectionRow(sheetName, fullData);

        if (!success) {
            return NextResponse.json({ error: "Failed to add row" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error adding section row:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/user/[username]/sections
 * Body: { section: "experience" | "projects" | ..., index: number }
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const authUser = await getAuthUsername(request);
        if (!authUser || authUser.toLowerCase() !== username.toLowerCase()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { section, index } = body;

        if (!section || index === undefined) {
            return NextResponse.json({ error: "section and index are required" }, { status: 400 });
        }

        const sheetName = getSectionSheetName(section);
        if (!sheetName) {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        const success = await deleteSectionRow(sheetName, username, index);

        if (!success) {
            return NextResponse.json({ error: "Failed to delete row" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting section row:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
