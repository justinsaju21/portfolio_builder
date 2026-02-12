import { NextRequest, NextResponse } from "next/server";
import { addSectionRow, deleteSectionRow, getSectionSheetName } from "@/lib/google-sheets";
import {
    ExperienceSchema,
    ProjectSchema,
    SkillSchema,
    EducationSchema,
    LeadershipSchema,
} from "@/lib/types";
import { z } from "zod";

// Map section names to their Zod schemas (without username — we inject it)
const sectionSchemas: Record<string, z.ZodTypeAny> = {
    experience: ExperienceSchema,
    projects: ProjectSchema,
    skills: SkillSchema,
    education: EducationSchema,
    leadership: LeadershipSchema,
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
