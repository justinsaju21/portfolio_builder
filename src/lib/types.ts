import { z } from "zod";

// Zod Schemas for validation
export const UserProfileSchema = z.object({
    username: z.string().min(3),
    password_pin: z.string().min(4),
    full_name: z.string().min(1),
    tagline: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    bio: z.string().optional(),
    degree: z.string().optional(),
    university: z.string().optional(),
    graduation_year: z.string().optional(),
    theme_preference: z.enum(["modern", "minimal"]).default("modern"),
    profile_image: z.string().optional(),
    resume_url: z.string().optional(),
    // UI Customization
    primary_color: z.string().default("#6366f1"),
    secondary_color: z.string().default("#14b8a6"),
    font_choice: z.enum(["inter", "playfair", "space_grotesk", "jetbrains"]).default("inter"),
    card_style: z.enum(["glass", "solid", "outline"]).default("glass"),
    animation_enabled: z.boolean().default(true),
    // Layout Customization
    section_order: z.string().default("about,skills,experience,projects,leadership,education,contact"),
    section_visibility: z.string().default(""), // comma-separated list of hidden section IDs
    custom_sections: z.string().default("[]"), // JSON string of CustomSection[]
    // Granular Styling
    bg_color: z.string().default("#030310"),
    surface_color: z.string().default("rgba(255,255,255,0.03)"),
    text_primary: z.string().default("#e2e8f0"),
    text_muted: z.string().default("#94a3b8"),
    text_dim: z.string().default("#64748b"),
    heading_font: z.string().default("Inter"),
    body_font: z.string().default("Inter"),
    button_style: z.enum(["solid", "outline", "ghost"]).default("solid"),
    container_width: z.enum(["narrow", "normal", "wide"]).default("normal"),
    custom_css: z.string().default(""),
    color_theme: z.enum(["light", "dark", "midnight", "glass", "sunset"]).default("dark"),
});

export const ExperienceSchema = z.object({
    username: z.string(),
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().optional(),
    start_date: z.string(),
    end_date: z.string().optional(),
    is_current: z.boolean().default(false),
    description_points: z.array(z.string()).default([]),
    type: z.enum(["internship", "job", "volunteer", "club"]).default("job"),
});

export const ProjectSchema = z.object({
    username: z.string(),
    title: z.string().min(1),
    description: z.string(),
    tech_stack: z.array(z.string()).default([]),
    repo_url: z.string().optional(),
    live_url: z.string().optional(),
    image_url: z.string().optional(),
    featured: z.boolean().default(false),
});

export const SkillSchema = z.object({
    username: z.string(),
    category: z.string(),
    skills_list: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
    username: z.string(),
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    year: z.string(),
    is_current: z.boolean().default(false),
});

export const LeadershipSchema = z.object({
    username: z.string(),
    title: z.string().min(1),
    organization: z.string().min(1),
    description: z.string().optional(),
    achievements: z.array(z.string()).default([]),
    type: z.enum(["club", "academic", "volunteer", "competition"]).default("club"),
});

// Custom Section Schema
const CustomItemSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    url: z.string().optional(),
});

// Custom Section Schema
export const CustomSectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    icon: z.string().default("Star"),
    type: z.enum(["text", "list", "grid"]).default("text"),
    content: z.string().default(""), // Markdown supported
    items: z.array(z.union([z.string(), CustomItemSchema])).default([]),
    visible: z.boolean().default(true),
});

// Portfolio Data Types
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Leadership = z.infer<typeof LeadershipSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;

export interface PortfolioData {
    profile: UserProfile;
    experiences: Experience[];
    projects: Project[];
    skills: Skill[];
    education: Education[];
    leadership: Leadership[];
    customSections: CustomSection[];
    sectionOrder: string[];
    hiddenSections: string[];
}
