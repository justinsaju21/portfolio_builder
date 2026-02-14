import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { cache } from "react";
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

/**
 * Get user profile by username
 */
export const getUserByUsername = cache(async (
    username: string
): Promise<UserProfile | null> => {
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
        };

        // Validate with Zod
        const result = UserProfileSchema.safeParse(rawData);
        if (!result.success) {
            console.error(`Validation error for user ${username}:`, result.error.format());
            return rawData as UserProfile; // Fallback to raw data if validation fails but mostly correct
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
});

/**
 * Get all experiences for a user
 */
export const getExperiencesByUsername = cache(async (
    username: string
): Promise<Experience[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.EXPERIENCE];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows
            .filter((row) => row.get("username")?.toLowerCase() === username.toLowerCase())
            .map((row) => {
                const rawData = {
                    username: row.get("username") || "",
                    title: row.get("title") || "",
                    company: row.get("company") || "",
                    location: row.get("location") || "",
                    start_date: row.get("start_date") || "",
                    end_date: row.get("end_date") || "",
                    is_current: row.get("is_current")?.toLowerCase() === "true",
                    description_points: parseList(row.get("description_points")),
                    type: row.get("type") || "job",
                };

                const result = ExperienceSchema.safeParse(rawData);
                return result.success ? result.data : (rawData as Experience);
            });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
});

/**
 * Get all projects for a user
 */
export const getProjectsByUsername = cache(async (
    username: string
): Promise<Project[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.PROJECTS];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows
            .filter((row) => row.get("username")?.toLowerCase() === username.toLowerCase())
            .map((row) => {
                const rawData = {
                    username: row.get("username") || "",
                    title: row.get("title") || "",
                    description: row.get("description") || "",
                    tech_stack: parseList(row.get("tech_stack")),
                    repo_url: row.get("repo_url") || "",
                    live_url: row.get("live_url") || "",
                    image_url: row.get("image_url") || "",
                    featured: row.get("featured")?.toLowerCase() === "true",
                };

                const result = ProjectSchema.safeParse(rawData);
                return result.success ? result.data : (rawData as Project);
            });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
});

/**
 * Get all skills for a user
 */
export const getSkillsByUsername = cache(async (username: string): Promise<Skill[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.SKILLS];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows
            .filter((row) => row.get("username")?.toLowerCase() === username.toLowerCase())
            .map((row) => {
                const rawData = {
                    username: row.get("username") || "",
                    category: row.get("category") || "",
                    skills_list: parseList(row.get("skills_list")),
                };

                const result = SkillSchema.safeParse(rawData);
                return result.success ? result.data : (rawData as Skill);
            });
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
});

/**
 * Get all education for a user
 */
export const getEducationByUsername = cache(async (
    username: string
): Promise<Education[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.EDUCATION];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows
            .filter((row) => row.get("username")?.toLowerCase() === username.toLowerCase())
            .map((row) => {
                const rawData = {
                    username: row.get("username") || "",
                    degree: row.get("degree") || "",
                    field: row.get("field") || "",
                    institution: row.get("institution") || "",
                    year: String(row.get("year") || ""),
                    is_current: row.get("is_current")?.toLowerCase() === "true",
                };

                const result = EducationSchema.safeParse(rawData);
                return result.success ? result.data : (rawData as Education);
            });
    } catch (error) {
        console.error("Error fetching education:", error);
        return [];
    }
});

/**
 * Get all leadership roles for a user
 */
export const getLeadershipByUsername = cache(async (
    username: string
): Promise<Leadership[]> => {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[SHEET_NAMES.LEADERSHIP];
        if (!sheet) return [];

        const rows = await sheet.getRows();
        return rows
            .filter((row) => row.get("username") === username)
            .map((row) => {
                const rawData = {
                    username: row.get("username"),
                    title: row.get("title"),
                    organization: row.get("organization"),
                    description: row.get("description") || "",
                    achievements: parseList(row.get("achievements")),
                    type: row.get("type") || "club",
                };
                const result = LeadershipSchema.safeParse(rawData);
                return result.success ? result.data : (rawData as Leadership);
            });
    } catch (error) {
        console.error("Error fetching leadership:", error);
        return [];
    }
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

    const [experiences, projects, skills, education, leadership] = await Promise.all([
        getExperiencesByUsername(username),
        getProjectsByUsername(username),
        getSkillsByUsername(username),
        getEducationByUsername(username),
        getLeadershipByUsername(username),
    ]);

    // Parse custom sections from JSON string
    let customSections: CustomSection[] = [];
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
        experiences,
        projects,
        skills,
        education,
        leadership,
        customSections,
        sectionOrder,
        hiddenSections,
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
        });

        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        return false;
    }
}

/**
 * Add a row to a specific section sheet
 */
export async function addSectionRow(
    sheetName: string,
    data: Record<string, unknown>
): Promise<boolean> {
    try {
        const doc = await getSpreadsheet();
        const sheet = doc.sheetsByTitle[sheetName];
        if (!sheet) return false;

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

        await sheet.addRow(rowData);
        return true;
    } catch (error) {
        console.error(`Error adding row to ${sheetName}:`, error);
        return false;
    }
}

/**
 * Delete a user's row from a section sheet by matching index
 * (index = nth row belonging to this username, 0-based)
 */
export async function deleteSectionRow(
    sheetName: string,
    username: string,
    rowIndex: number
): Promise<boolean> {
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
        console.error(`Error deleting row from ${sheetName}:`, error);
        return false;
    }
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
    };
    return map[section] || null;
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
