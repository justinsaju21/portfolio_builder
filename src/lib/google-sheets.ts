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
    // Legacy sheet names, kept for compatibility in function signatures
    EXPERIENCE: "Experience",
    PROJECTS: "Projects",
    SKILLS: "Skills",
    EDUCATION: "Education",
    LEADERSHIP: "Leadership",
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
            let sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];

            if (!sheet) {
                console.warn(`Users sheet not found, attempting to initialize for ${username}...`);
                await ensureSheetsExist(username);
                // Re-fetch spreadsheet to get updated internal state
                const updatedDoc = await getSpreadsheet();
                sheet = updatedDoc.sheetsByTitle[SHEET_NAMES.USERS];
                if (!sheet) {
                    console.error("Critical: Users sheet still missing after initialization.");
                    return null;
                }
            }

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
                portfolio_json: userRow.get("portfolio_json") || "{}",
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

// Obsolete fetchers - removed to favor Single-Sheet JSON storage
// get[Section]ByUsername functions are no longer needed as getPortfolioData handles everything.


/**
 * Get complete portfolio data for a user
 * In Single-Sheet mode, we fetch the User row and parse the portfolio_json column.
 */
export const getPortfolioData = cache(async (
    username: string
): Promise<PortfolioData | null> => {
    const profile = await getUserByUsername(username);
    if (!profile) return null;

    let data: Partial<PortfolioData> = {};
    try {
        const jsonStr = (profile as any).portfolio_json;
        if (jsonStr && jsonStr !== "{}") {
            data = JSON.parse(jsonStr);
        }
    } catch (e) {
        console.error(`Error parsing portfolio_json for ${username}:`, e);
    }

    // Merge profile values (some fields like theme are in both, profile row wins for auth fields)
    const portfolio: PortfolioData = {
        profile,
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
        education: data.education || [],
        leadership: data.leadership || [],
        customSections: data.customSections || [],
        sectionOrder: data.sectionOrder || (profile.section_order || "about,skills,experience,projects,leadership,education,contact").split(",").map(s => s.trim()).filter(Boolean),
        hiddenSections: data.hiddenSections || (profile.section_visibility || "").split(",").map(s => s.trim()).filter(Boolean),
        // Additional sections
        hackathons: data.hackathons || [],
        research: data.research || [],
        entrepreneurship: data.entrepreneurship || [],
        certifications: data.certifications || [],
        exams: data.exams || [],
        sports_cultural: data.sports_cultural || [],
        volunteering: data.volunteering || [],
        scholarships: data.scholarships || [],
        club_activities: data.club_activities || [],
        dept_contributions: data.dept_contributions || [],
        professional_memberships: data.professional_memberships || [],
        references: data.references || [],
    };

    return portfolio;
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

        // Ensure headers are loaded to prevent skipping new columns
        await sheet.loadHeaderRow();

        const rows = await sheet.getRows();
        const userRow = rows.find(
            (row) => row.get("username")?.toLowerCase() === username.toLowerCase()
        );

        if (!userRow) return false;

        // Update each field
        Object.entries(updates).forEach(([key, value]) => {
            if (key !== "username" && value !== undefined) {
                // Check if header exists
                if (sheet.headerValues.includes(key)) {
                    userRow.set(key, value);
                } else {
                    console.warn(`Skipping unknown column "${key}" for update.`);
                }
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
            portfolio_json: "{}",
        });

        return true;
    } catch (error) {
        console.error("Error creating user DETAILS:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return false;
    }
}

/**
 * Add an item to a specific section with JSON storage
 */
export async function addSectionRow(
    sectionKey: string,
    data: Record<string, unknown>,
    retries = 3
): Promise<boolean> {
    const username = data.username as string;
    if (!username) return false;

    return updatePortfolioJSON(username, (portfolio) => {
        const key = sectionKey.toLowerCase() as keyof PortfolioData;
        const currentItems = (portfolio[key] || []) as any[];

        // Remove username from item data before storing in JSON (redundant inside the blob)
        const { username: _, ...itemData } = data;

        return {
            ...portfolio,
            [key]: [...currentItems, itemData]
        };
    }, retries);
}

/**
 * Update a specific item in a section by index
 */
export async function updateSectionRow(
    sectionKey: string,
    username: string,
    index: number,
    data: Record<string, unknown>,
    retries = 3
): Promise<boolean> {
    return updatePortfolioJSON(username, (portfolio) => {
        const key = sectionKey.toLowerCase() as keyof PortfolioData;
        const currentItems = [...((portfolio[key] || []) as any[])];

        if (index < 0 || index >= currentItems.length) {
            console.error(`Index ${index} out of bounds for ${sectionKey}`);
            return portfolio;
        }

        const { username: _, ...itemData } = data;
        currentItems[index] = itemData;

        return {
            ...portfolio,
            [key]: currentItems
        };
    }, retries);
}

/**
 * Delete a specific item from a section by index
 */
export async function deleteSectionRow(
    sectionKey: string,
    username: string,
    index: number,
    retries = 3
): Promise<boolean> {
    return updatePortfolioJSON(username, (portfolio) => {
        const key = sectionKey.toLowerCase() as keyof PortfolioData;
        const currentItems = [...((portfolio[key] || []) as any[])];

        if (index < 0 || index >= currentItems.length) {
            console.error(`Index ${index} out of bounds for ${sectionKey}`);
            return portfolio;
        }

        currentItems.splice(index, 1);

        return {
            ...portfolio,
            [key]: currentItems
        };
    }, retries);
}

/**
 * Map section type string to sheet name
 */
export function getSectionSheetName(section: string): string | null {
    const map: Record<string, string> = {
        experience: "experience",
        projects: "projects",
        skills: "skills",
        education: "education",
        leadership: "leadership",
        hackathons: "hackathons",
        research: "research",
        entrepreneurship: "entrepreneurship",
        certifications: "certifications",
        exams: "exams",
        sports_cultural: "sports_cultural",
        volunteering: "volunteering",
        scholarships: "scholarships",
        club_activities: "club_activities",
        dept_contributions: "dept_contributions",
        professional_memberships: "professional_memberships",
        references: "references",
    };
    return map[section] || null;
}

/**
 * Helper to update the portfolio_json column for a user
 */
async function updatePortfolioJSON(
    username: string,
    updateFn: (data: PortfolioData) => PortfolioData,
    retries = 3
): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const doc = await getSpreadsheet();
            const sheet = doc.sheetsByTitle[SHEET_NAMES.USERS];
            if (!sheet) return false;

            await sheet.loadHeaderRow();
            const rows = await sheet.getRows();
            const userRow = rows.find(
                (row) => row.get("username")?.toLowerCase() === username.toLowerCase()
            );

            if (!userRow) return false;

            // Get current data
            let currentJSON = userRow.get("portfolio_json") || "{}";
            let parsedData: Partial<PortfolioData> = {};
            try {
                parsedData = JSON.parse(currentJSON);
            } catch (e) {
                console.error("Error parsing portfolio_json during update:", e);
                parsedData = {};
            }

            // Construct valid PortfolioData object for the updateFn
            const fullData: PortfolioData = {
                profile: {} as UserProfile, // Not used by updateFn usually
                experience: parsedData.experience || [],
                projects: parsedData.projects || [],
                skills: parsedData.skills || [],
                education: parsedData.education || [],
                leadership: parsedData.leadership || [],
                customSections: parsedData.customSections || [],
                sectionOrder: parsedData.sectionOrder || [],
                hiddenSections: parsedData.hiddenSections || [],
                hackathons: parsedData.hackathons || [],
                research: parsedData.research || [],
                entrepreneurship: parsedData.entrepreneurship || [],
                certifications: parsedData.certifications || [],
                exams: parsedData.exams || [],
                sports_cultural: parsedData.sports_cultural || [],
                volunteering: parsedData.volunteering || [],
                scholarships: parsedData.scholarships || [],
                club_activities: parsedData.club_activities || [],
                dept_contributions: parsedData.dept_contributions || [],
                professional_memberships: parsedData.professional_memberships || [],
                references: parsedData.references || [],
            };

            const updatedData = updateFn(fullData);

            // Remove the 'profile' field before stringifying to keep blob cleaner
            const { profile: _, ...blobData } = updatedData;

            userRow.set("portfolio_json", JSON.stringify(blobData));
            await userRow.save();
            return true;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed updating portfolio JSON:`, error);
            if (i === retries - 1) return false;
            await new Promise((res) => setTimeout(res, 500 * Math.pow(2, i)));
        }
    }
    return false;
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
                    "status_badge", "timeline_view", "github_fetching", "portfolio_json"
                ],
            };

            const checkSheet = async (title: string, headers: string[]) => {
                let sheet = doc.sheetsByTitle[title];
                if (!sheet) {
                    await doc.addSheet({ title, headerValues: headers });
                    return title;
                } else {
                    try {
                        await sheet.loadHeaderRow();
                        const existingHeaders = sheet.headerValues;
                        const missingHeaders = headers.filter(h => !existingHeaders.includes(h));
                        if (missingHeaders.length > 0) {
                            // Resize if needed
                            if (sheet.columnCount < existingHeaders.length + missingHeaders.length) {
                                await sheet.resize({ rowCount: sheet.rowCount, columnCount: existingHeaders.length + missingHeaders.length });
                            }
                            await sheet.setHeaderRow([...existingHeaders, ...missingHeaders]);
                            return `${title} (updated headers)`;
                        }
                    } catch (e) {
                        // Likely empty sheet (no headers)
                        console.warn(`Sheet ${title} found but empty or invalid headers. Re-initializing headers.`);
                        // Resize first
                        if (sheet.columnCount < headers.length) {
                            await sheet.resize({ rowCount: sheet.rowCount || 1000, columnCount: headers.length });
                        }
                        await sheet.setHeaderRow(headers);
                        return `${title} (re-initialized headers)`;
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
            console.error("Error during spreadsheet initialization DETAILS:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
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
