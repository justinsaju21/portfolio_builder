import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { cache } from "react";
import { z } from "zod";
import {
    UserProfile,
    Experience,
    Project,
    Skill,
    Education,
    Leadership,
    CustomSection,
    PortfolioData,
    UserProfileSchema,
    ExperienceSchema,
    ProjectSchema,
    SkillSchema,
    EducationSchema,
    LeadershipSchema,
    CustomSectionSchema,
    // New Schemas
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
} from "./types";

// Environment variables
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Tab/Sheet names in your Google Sheet
const SHEET_NAMES = {
    USERS: "Users",
    EXPERIENCE: "Experience",
    PROJECTS: "Projects",
    SKILLS: "Skills",
    EDUCATION: "Education",
    LEADERSHIP: "Leadership",
    // New Sections
    HACKATHONS: "Hackathons",
    RESEARCH: "Research",
    ENTREPRENEURSHIP: "Entrepreneurship",
    CERTIFICATIONS: "Certifications",
    EXAMS: "CompetitiveExams",
    SPORTS_CULTURAL: "SportsCultural",
    VOLUNTEERING: "Volunteering",
    SCHOLARSHIPS: "Scholarships",
    CLUB_ACTIVITIES: "ClubActivities",
    DEPT_CONTRIBUTIONS: "DeptContributions",
    PROFESSIONAL_MEMBERSHIPS: "ProfessionalMemberships",
    REFERENCES: "References",
};

/**
 * Get authenticated Google Spreadsheet instance
 * Memoized per request to avoid multiple loadInfo calls
 */
const getSpreadsheet = cache(async (): Promise<GoogleSpreadsheet> => {
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
        throw new Error(
            "Missing Google Sheets configuration. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local"
        );
    }

    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        return doc;
    } catch (error) {
        console.error("Failed to initialize Google Spreadsheet:", error);
        throw error;
    }
});

// ... (Existing fetchers for User, Experience, Projects, Skills, Education, Leadership remain unchanged)
// I will keep them but need to skip them in replacement to avoid huge diff.
// Actually, I can just append the new fetchers before getPortfolioData and then update getPortfolioData.

/**
 * Get user profile by username with retry logic
 */
export const getUserByUsername = cache(async (
    username: string,
    retries = 3
): Promise<UserProfile | null> => {
    for (let i = 0; i < retries; i++) {
        try {
            const doc = await getSpreadsheet();
            const sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];
            if (!sheet) return null;

            const rows = await sheet.getRows();
            const userRow = rows.find(
                (row) => row.get("username")?.toLowerCase() === username.toLowerCase()
            );

            if (!userRow) return null;

            const rawData = {
                username: userRow.get("username") || "",
                password_pin: String(userRow.get("password_pin") || ""),
                full_name: userRow.get("full_name") || "",
                tagline: userRow.get("tagline") || "",
                email: userRow.get("email") || "",
                github: userRow.get("github") || "",
                linkedin: userRow.get("linkedin") || "",
                bio: userRow.get("bio") || "",
                degree: userRow.get("degree") || "",
                university: userRow.get("university") || "",
                graduation_year: String(userRow.get("graduation_year") || ""),
                theme_preference: userRow.get("theme_preference") || "modern",
                profile_image: userRow.get("profile_image") || "",
                resume_url: userRow.get("resume_url") || "",
                primary_color: userRow.get("primary_color") || "#6366f1",
                secondary_color: userRow.get("secondary_color") || "#14b8a6",
                font_choice: userRow.get("font_choice") || "inter",
                card_style: userRow.get("card_style") || "glass",
                animation_enabled: userRow.get("animation_enabled")?.toLowerCase() !== "false",
                section_order: userRow.get("section_order") || "about,skills,experience,projects,leadership,education,contact",
                section_visibility: userRow.get("section_visibility") || "",
                custom_sections: userRow.get("custom_sections") || "[]",
                // New Customization Fields
                bg_color: userRow.get("bg_color") || "#ffffff",
                surface_color: userRow.get("surface_color") || "#f8fafc",
                text_primary: userRow.get("text_primary") || "#0f172a",
                text_muted: userRow.get("text_muted") || "#475569",
                text_dim: userRow.get("text_dim") || "#94a3b8",
                heading_font: userRow.get("heading_font") || "Inter",
                body_font: userRow.get("body_font") || "Inter",
                button_style: userRow.get("button_style") || "solid",
                container_width: userRow.get("container_width") || "normal",
                custom_css: userRow.get("custom_css") || "",
                color_theme: userRow.get("color_theme") || "dark",
                // Premium Features
                rss_url: userRow.get("rss_url") || "",
                google_analytics_id: userRow.get("google_analytics_id") || "",
                status_badge: userRow.get("status_badge") || "none",
                timeline_view: userRow.get("timeline_view")?.toLowerCase() === "true",
                github_fetching: userRow.get("github_fetching")?.toLowerCase() === "true",
            };

            // Validate with Zod
            const result = UserProfileSchema.safeParse(rawData);
            if (!result.success) {
                console.error(`Validation error for user ${username}:`, result.error.format());
                return rawData as UserProfile; // Fallback to raw data if validation fails but mostly correct
            }
            return result.data;
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed fetching user ${username}:`, error);
            if (i === retries - 1) {
                console.error(`Final failure fetching user ${username}:`, error);
                return null;
            }
            await new Promise((res) => setTimeout(res, 500 * Math.pow(2, i)));
        }
    }
    return null;
});

/**
 * Generic helper to fetch section data with retry logic
 */
async function fetchSectionData<T>(
    sheetTitle: string,
    username: string,
    schema: z.ZodType<T>,
    mapFn: (row: any) => any,
    retries = 3
): Promise<T[]> {
    for (let i = 0; i < retries; i++) {
        try {
            const doc = await getSpreadsheet();
            const sheet = doc.sheetsByTitle[sheetTitle];
            if (!sheet) return [];

            const rows = await sheet.getRows();
            return rows
                .filter((row) => row.get("username")?.toLowerCase() === username.toLowerCase())
                .map((row) => {
                    const rawData = mapFn(row);
                    const result = schema.safeParse(rawData);
                    return result.success ? result.data : (rawData as T);
                });
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed for ${sheetTitle}:`, error);
            if (i === retries - 1) {
                console.error(`Final failure for ${sheetTitle}:`, error);
                return [];
            }
            // Exponential backoff: 500ms, 1000ms, 2000ms
            await new Promise((res) => setTimeout(res, 500 * Math.pow(2, i)));
        }
    }
    return [];
}

/**
 * Get all experiences for a user
 */
export const getExperiencesByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.EXPERIENCE, username, ExperienceSchema, (row) => ({
        username: row.get("username") || "",
        title: row.get("title") || "",
        company: row.get("company") || "",
        location: row.get("location") || "",
        start_date: row.get("start_date") || "",
        end_date: row.get("end_date") || "",
        is_current: row.get("is_current")?.toLowerCase() === "true",
        description_points: parseList(row.get("description_points")),
        type: row.get("type") || "job",
    }));
});

/**
 * Get all projects for a user
 */
export const getProjectsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.PROJECTS, username, ProjectSchema, (row) => ({
        username: row.get("username") || "",
        title: row.get("title") || "",
        description: row.get("description") || "",
        tech_stack: parseList(row.get("tech_stack")),
        repo_url: row.get("repo_url") || "",
        live_url: row.get("live_url") || "",
        image_url: row.get("image_url") || "",
        featured: row.get("featured")?.toLowerCase() === "true",
    }));
});

/**
 * Get all skills for a user
 */
export const getSkillsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.SKILLS, username, SkillSchema, (row) => ({
        username: row.get("username") || "",
        category: row.get("category") || "",
        skills_list: parseList(row.get("skills_list")),
    }));
});

/**
 * Get all education for a user
 */
export const getEducationByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.EDUCATION, username, EducationSchema, (row) => ({
        username: row.get("username") || "",
        degree: row.get("degree") || "",
        field: row.get("field") || "",
        institution: row.get("institution") || "",
        year: String(row.get("year") || ""),
        is_current: row.get("is_current")?.toLowerCase() === "true",
    }));
});

/**
 * Get all leadership roles for a user
 */
export const getLeadershipByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.LEADERSHIP, username, LeadershipSchema, (row) => ({
        username: row.get("username") || "",
        title: row.get("title") || "",
        organization: row.get("organization") || "",
        description: row.get("description") || "",
        achievements: parseList(row.get("achievements")),
        type: row.get("type") || "club",
    }));
});

// ===== NEW FETCHERS =====

export const getHackathonsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.HACKATHONS, username, HackathonSchema, (row) => ({
        username: row.get("username") || "",
        name: row.get("name") || "",
        project_built: row.get("project_built") || "",
        team_size: String(row.get("team_size") || "1"),
        position: row.get("position") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getResearchByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.RESEARCH, username, ResearchSchema, (row) => ({
        username: row.get("username") || "",
        title: row.get("title") || "",
        journal_conference: row.get("journal_conference") || "",
        index_status: row.get("index_status") || "none",
        publication_status: row.get("publication_status") || "under_review",
        link: row.get("link") || "",
    }));
});

export const getEntrepreneurshipByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.ENTREPRENEURSHIP, username, EntrepreneurshipSchema, (row) => ({
        username: row.get("username") || "",
        startup_name: row.get("startup_name") || "",
        registration_details: row.get("registration_details") || "",
        revenue_funding: row.get("revenue_funding") || "",
        description: row.get("description") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getCertificationsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.CERTIFICATIONS, username, CertificationSchema, (row) => ({
        username: row.get("username") || "",
        provider: row.get("provider") || "",
        certificate_name: row.get("certificate_name") || "",
        validation_id: row.get("validation_id") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getExamsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.EXAMS, username, ExamSchema, (row) => ({
        username: row.get("username") || "",
        exam_name: row.get("exam_name") || "",
        score_rank: row.get("score_rank") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getSportsCulturalByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.SPORTS_CULTURAL, username, SportsCulturalSchema, (row) => ({
        username: row.get("username") || "",
        event_name: row.get("event_name") || "",
        level: row.get("level") || "zone",
        position_won: row.get("position_won") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getVolunteeringByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.VOLUNTEERING, username, VolunteeringSchema, (row) => ({
        username: row.get("username") || "",
        organization: row.get("organization") || "",
        role: row.get("role") || "",
        hours_served: String(row.get("hours_served") || ""),
        impact: row.get("impact") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getScholarshipsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.SCHOLARSHIPS, username, ScholarshipSchema, (row) => ({
        username: row.get("username") || "",
        name: row.get("name") || "",
        awarding_body: row.get("awarding_body") || "",
        amount_prestige: row.get("amount_prestige") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getClubActivitiesByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.CLUB_ACTIVITIES, username, ClubActivitySchema, (row) => ({
        username: row.get("username") || "",
        club_name: row.get("club_name") || "",
        position: row.get("position") || "",
        key_events: row.get("key_events") || "",
        impact_description: row.get("impact_description") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getDeptContributionsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.DEPT_CONTRIBUTIONS, username, DeptContributionSchema, (row) => ({
        username: row.get("username") || "",
        event_name: row.get("event_name") || "",
        role: row.get("role") || "",
        contribution_description: row.get("contribution_description") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getProfessionalMembershipsByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.PROFESSIONAL_MEMBERSHIPS, username, ProfessionalMembershipSchema, (row) => ({
        username: row.get("username") || "",
        organization: row.get("organization") || "",
        membership_id: row.get("membership_id") || "",
        role: row.get("role") || "",
        proof_link: row.get("proof_link") || "",
    }));
});

export const getReferencesByUsername = cache(async (username: string) => {
    return fetchSectionData(SHEET_NAMES.REFERENCES, username, ReferenceSchema, (row) => ({
        username: row.get("username") || "",
        faculty_name: row.get("faculty_name") || "",
        contact: row.get("contact") || "",
        lor_link: row.get("lor_link") || "",
    }));
});


/**
 * Get complete portfolio data for a user
 * Fully memoized to ensure multiple calls in the same request (metadata + page) are free
 */
export const getPortfolioData = cache(async (
    username: string
): Promise<PortfolioData | null> => {
    const profile = await getUserByUsername(username);
    if (!profile) return null;

    const [
        experiences, projects, skills, education, leadership,
        hackathons, research, entrepreneurship, certifications, exams,
        sports_cultural, volunteering, scholarships, club_activities,
        dept_contributions, professional_memberships, references
    ] = await Promise.all([
        getExperiencesByUsername(username),
        getProjectsByUsername(username),
        getSkillsByUsername(username),
        getEducationByUsername(username),
        getLeadershipByUsername(username),
        // New sections
        getHackathonsByUsername(username),
        getResearchByUsername(username),
        getEntrepreneurshipByUsername(username),
        getCertificationsByUsername(username),
        getExamsByUsername(username),
        getSportsCulturalByUsername(username),
        getVolunteeringByUsername(username),
        getScholarshipsByUsername(username),
        getClubActivitiesByUsername(username),
        getDeptContributionsByUsername(username),
        getProfessionalMembershipsByUsername(username),
        getReferencesByUsername(username),
    ]);

    // Parse custom sections from JSON string
    const customSections: CustomSection[] = [];
    try {
        const parsed = JSON.parse(profile.custom_sections || "[]");
        if (Array.isArray(parsed)) {
            for (const s of parsed) {
                const result = CustomSectionSchema.safeParse(s);
                if (result.success) {
                    customSections.push(result.data);
                }
            }
        }
    } catch { /* ignore parse errors */ }

    // Parse section order
    const sectionOrder = (profile.section_order || "about,skills,experience,projects,leadership,education,contact")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

    // Parse hidden sections
    const hiddenSections = (profile.section_visibility || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

    return {
        profile,
        experience: experiences,
        projects,
        skills,
        education,
        leadership,
        customSections,
        sectionOrder,
        hiddenSections,
        // New sections
        hackathons,
        research,
        entrepreneurship,
        certifications,
        exams,
        sports_cultural,
        volunteering,
        scholarships,
        club_activities,
        dept_contributions,
        professional_memberships,
        references,
    };
});

/**
 * Get all usernames (for static generation)
 */
export const getAllUsernames = cache(async (): Promise<string[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows.map((row) => row.get("username")).filter(Boolean);
    } catch (error) {
        console.error("Error fetching usernames:", error);
        return [];
    }
});

/**
 * Verify user login
 */
export async function verifyLogin(
    username: string,
    pin: string
): Promise<boolean> {
    const user = await getUserByUsername(username);
    if (!user) return false;
    return user.password_pin === pin;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    username: string,
    updates: Partial<UserProfile>
): Promise<boolean> {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];
        if (!sheet) return false;

        const rows = await sheet.getRows();
        const userRow = rows.find(
            (row) => row.get("username")?.toLowerCase() === username.toLowerCase()
        );

        if (!userRow) return false;

        // Update each field
        Object.entries(updates).forEach(([key, value]) => {
            if (key !== "username" && value !== undefined) {
                userRow.set(key, value);
            }
        });

        await userRow.save();
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
}

/**
 * Create a new user
 */
export async function createUser(profile: UserProfile): Promise<boolean> {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];
        if (!sheet) return false;

        // Check if username exists
        const existing = await getUserByUsername(profile.username);
        if (existing) return false;

        // Validate data before adding
        const result = UserProfileSchema.safeParse(profile);
        if (!result.success) {
            throw new Error(`Invalid user data: ${JSON.stringify(result.error.format())}`);
        }

        await sheet.addRow({
            username: profile.username,
            password_pin: profile.password_pin,
            full_name: profile.full_name,
            tagline: profile.tagline || "",
            email: profile.email || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            bio: profile.bio || "",
            degree: profile.degree || "",
            university: profile.university || "",
            graduation_year: profile.graduation_year || "",
            theme_preference: profile.theme_preference,
            profile_image: profile.profile_image || "",
            resume_url: profile.resume_url || "",
            primary_color: profile.primary_color || "#6366f1",
            secondary_color: profile.secondary_color || "#14b8a6",
            font_choice: profile.font_choice || "inter",
            card_style: profile.card_style || "glass",
            animation_enabled: profile.animation_enabled !== false ? "true" : "false",
            section_order: profile.section_order || "about,skills,experience,projects,leadership,education,contact",
            section_visibility: profile.section_visibility || "",
            custom_sections: profile.custom_sections || "[]",
            bg_color: profile.bg_color || "#ffffff",
            surface_color: profile.surface_color || "#f8fafc",
            text_primary: profile.text_primary || "#0f172a",
            text_muted: profile.text_muted || "#475569",
            text_dim: profile.text_dim || "#94a3b8",
            heading_font: profile.heading_font || "Inter",
            body_font: profile.body_font || "Inter",
            button_style: profile.button_style || "solid",
            container_width: profile.container_width || "normal",
            custom_css: profile.custom_css || "",
            color_theme: profile.color_theme || "dark",
            // Premium Features
            rss_url: profile.rss_url || "",
            google_analytics_id: profile.google_analytics_id || "",
            status_badge: profile.status_badge || "none",
            timeline_view: profile.timeline_view ? "true" : "false",
            github_fetching: profile.github_fetching ? "true" : "false",
        });

        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        return false;
    }
}

/**
 * Add a row to a specific section sheet with retry logic
 */
export async function addSectionRow(
    sheetName: string,
    data: Record<string, unknown>,
    retries = 3
): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const doc = await getSpreadsheet();
            const sheet = doc.sheetsByTitle[sheetName];

            if (!sheet) {
                console.error(`Sheet "${sheetName}" not found in spreadsheet.`);
                // If it's missing, maybe we should try ensuring sheets exist again?
                // But only if we haven't already.
                await ensureSheetsExist("retry"); // Pass something to indicate it's a retry check
                const sheetRetry = doc.sheetsByTitle[sheetName];
                if (!sheetRetry) return false;
            }

            const sheetToUse = doc.sheetsByTitle[sheetName];

            // Convert arrays to pipe-separated strings for Google Sheets
            const rowData: Record<string, string> = {};
            for (const [key, value] of Object.entries(data)) {
                if (Array.isArray(value)) {
                    rowData[key] = value.join(" | ");
                } else if (typeof value === "boolean") {
                    rowData[key] = value ? "true" : "false";
                } else {
                    rowData[key] = String(value ?? "");
                }
            }

            await sheetToUse.addRow(rowData);
            return true;
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed adding row to ${sheetName}. Error:`, error);
            if (i === retries - 1) {
                console.error(`Final failure adding row to ${sheetName} after ${retries} attempts:`, error);
                return false;
            }
            // Increase initial delay to 1s and use steeper backoff
            await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)));
        }
    }
    return false;
}

/**
 * Delete a user's row from a section sheet by matching index with retry logic
 * (index = nth row belonging to this username, 0-based)
 */
export async function deleteSectionRow(
    sheetName: string,
    username: string,
    rowIndex: number,
    retries = 3
): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const doc = await getSpreadsheet();
            const sheet = doc.sheetsByTitle[sheetName];
            if (!sheet) return false;

            const rows = await sheet.getRows();
            const userRows = rows.filter(
                (row) => row.get("username")?.toLowerCase() === username.toLowerCase()
            );

            if (rowIndex < 0 || rowIndex >= userRows.length) return false;

            await userRows[rowIndex].delete();
            return true;
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed deleting row from ${sheetName}:`, error);
            if (i === retries - 1) {
                console.error(`Final failure deleting row from ${sheetName}:`, error);
                return false;
            }
            await new Promise((res) => setTimeout(res, 500 * Math.pow(2, i)));
        }
    }
    return false;
}

/**
 * Map section type string to sheet name
 */
export function getSectionSheetName(section: string): string | null {
    const map: Record<string, string> = {
        experience: SHEET_NAMES.EXPERIENCE,
        projects: SHEET_NAMES.PROJECTS,
        skills: SHEET_NAMES.SKILLS,
        education: SHEET_NAMES.EDUCATION,
        leadership: SHEET_NAMES.LEADERSHIP,
        hackathons: SHEET_NAMES.HACKATHONS,
        research: SHEET_NAMES.RESEARCH,
        entrepreneurship: SHEET_NAMES.ENTREPRENEURSHIP,
        certifications: SHEET_NAMES.CERTIFICATIONS,
        exams: SHEET_NAMES.EXAMS,
        sports_cultural: SHEET_NAMES.SPORTS_CULTURAL,
        volunteering: SHEET_NAMES.VOLUNTEERING,
        scholarships: SHEET_NAMES.SCHOLARSHIPS,
        club_activities: SHEET_NAMES.CLUB_ACTIVITIES,
        dept_contributions: SHEET_NAMES.DEPT_CONTRIBUTIONS,
        professional_memberships: SHEET_NAMES.PROFESSIONAL_MEMBERSHIPS,
        references: SHEET_NAMES.REFERENCES,
    };
    return map[section] || null;
}

// Promise to track the ongoing initialization to handle concurrent requests
let initializationPromise: Promise<string[]> | null = null;

/**
 * Ensure all required sheets exist with proper headers
 * Optimized with a promise to handle concurrent requests and run only once
 */
export async function ensureSheetsExist(username: string): Promise<string[]> {
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        try {
            const doc = await getSpreadsheet();
            if (!doc) return [];

            console.log(`Verifying spreadsheet schema (requested by ${username})...`);
            const schemas: Record<string, string[]> = {
                [SHEET_NAMES.USERS]: [
                    "username", "password_pin", "full_name", "tagline", "email", "github", "linkedin", "bio",
                    "degree", "university", "graduation_year", "theme_preference", "profile_image", "resume_url",
                    "primary_color", "secondary_color", "font_choice", "card_style", "animation_enabled",
                    "section_order", "section_visibility", "custom_sections", "bg_color", "surface_color",
                    "text_primary", "text_muted", "text_dim", "heading_font", "body_font", "button_style",
                    "container_width", "custom_css", "color_theme", "rss_url", "google_analytics_id",
                    "status_badge", "timeline_view", "github_fetching"
                ],
                [SHEET_NAMES.EXPERIENCE]: ["username", "title", "company", "location", "start_date", "end_date", "is_current", "description_points", "type"],
                [SHEET_NAMES.PROJECTS]: ["username", "title", "description", "tech_stack", "repo_url", "live_url", "image_url", "featured"],
                [SHEET_NAMES.SKILLS]: ["username", "category", "skills_list"],
                [SHEET_NAMES.EDUCATION]: ["username", "degree", "field", "institution", "year", "is_current"],
                [SHEET_NAMES.LEADERSHIP]: ["username", "title", "organization", "description", "achievements", "type"],
                [SHEET_NAMES.HACKATHONS]: ["username", "name", "project_built", "team_size", "position", "proof_link"],
                [SHEET_NAMES.RESEARCH]: ["username", "title", "journal_conference", "index_status", "publication_status", "link"],
                [SHEET_NAMES.ENTREPRENEURSHIP]: ["username", "startup_name", "registration_details", "revenue_funding", "description", "proof_link"],
                [SHEET_NAMES.CERTIFICATIONS]: ["username", "provider", "certificate_name", "validation_id", "proof_link"],
                [SHEET_NAMES.EXAMS]: ["username", "exam_name", "score_rank", "proof_link"],
                [SHEET_NAMES.SPORTS_CULTURAL]: ["username", "event_name", "level", "position_won", "proof_link"],
                [SHEET_NAMES.VOLUNTEERING]: ["username", "organization", "role", "hours_served", "impact", "proof_link"],
                [SHEET_NAMES.SCHOLARSHIPS]: ["username", "name", "awarding_body", "amount_prestige", "proof_link"],
                [SHEET_NAMES.CLUB_ACTIVITIES]: ["username", "club_name", "position", "key_events", "impact_description", "proof_link"],
                [SHEET_NAMES.DEPT_CONTRIBUTIONS]: ["username", "event_name", "role", "contribution_description", "proof_link"],
                [SHEET_NAMES.PROFESSIONAL_MEMBERSHIPS]: ["username", "organization", "membership_id", "role", "proof_link"],
                [SHEET_NAMES.REFERENCES]: ["username", "faculty_name", "contact", "lor_link"],
            };

            const checkSheet = async (title: string, headers: string[]) => {
                let sheet = doc.sheetsByTitle[title];
                if (!sheet) {
                    await doc.addSheet({ title, headerValues: headers });
                    return title;
                } else {
                    await sheet.loadHeaderRow();
                    const existingHeaders = sheet.headerValues;
                    const missingHeaders = headers.filter(h => !existingHeaders.includes(h));
                    if (missingHeaders.length > 0) {
                        await sheet.setHeaderRow([...existingHeaders, ...missingHeaders]);
                        return `${title} (updated headers)`;
                    }
                }
                return null;
            };

            const results = await Promise.all(
                Object.entries(schemas).map(([title, headers]) => checkSheet(title, headers))
            );

            console.log("Spreadsheet schema verification successful.");
            return results.filter((r): r is string => r !== null);
        } catch (error) {
            console.error("Error during spreadsheet initialization:", error);
            initializationPromise = null; // Allow retry on next request
            return [];
        }
    })();

    return initializationPromise;
}

// Helper to parse comma-separated or pipe-separated lists
function parseList(value: string | undefined): string[] {
    if (!value) return [];
    // Try pipe first, then comma
    if (value.includes("|")) {
        return value.split("|").map((s) => s.trim()).filter(Boolean);
    }
    return value.split(",").map((s) => s.trim()).filter(Boolean);
}
