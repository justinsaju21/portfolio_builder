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
    color_theme: z.enum([
        "light", "dark", "midnight", "sunset", "ocean", "forest", "cyberpunk",
        "coffee", "rose", "slate", "terminal", "royal", "lavender", "nordic", "blackout",
        "glass", "snow", "solar", "corporate", "matcha", "synthwave", "pop", "liquid"
    ]).default("dark"),
    // Premium Features
    rss_url: z.string().default(""),
    google_analytics_id: z.string().default(""),
    status_badge: z.enum(["none", "open_to_work", "freelance", "hiring"]).default("none"),
    timeline_view: z.boolean().default(false),
    github_fetching: z.boolean().default(false),
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

// BO Student Prebuilt Sections

export const HackathonSchema = z.object({
    username: z.string(),
    name: z.string().min(1),
    project_built: z.string().min(1),
    team_size: z.string().optional(), // store as string in sheets
    position: z.string().min(1),
    proof_link: z.string().optional(),
});

export const ResearchSchema = z.object({
    username: z.string(),
    title: z.string().min(1),
    journal_conference: z.string().min(1),
    index_status: z.enum(["scopus", "sci", "ugc", "other", "none"]).default("none"),
    publication_status: z.enum(["filed", "published", "granted", "under_review"]).default("under_review"),
    link: z.string().optional(),
});

export const EntrepreneurshipSchema = z.object({
    username: z.string(),
    startup_name: z.string().min(1),
    registration_details: z.string().optional(),
    revenue_funding: z.string().optional(),
    description: z.string().optional(),
    proof_link: z.string().optional(),
});

export const CertificationSchema = z.object({
    username: z.string(),
    provider: z.string().min(1),
    certificate_name: z.string().min(1),
    validation_id: z.string().optional(),
    proof_link: z.string().optional(),
});

export const ExamSchema = z.object({
    username: z.string(),
    exam_name: z.string().min(1),
    score_rank: z.string().min(1),
    proof_link: z.string().optional(),
});

export const SportsCulturalSchema = z.object({
    username: z.string(),
    event_name: z.string().min(1),
    level: z.enum(["zone", "district", "state", "national", "international"]).default("zone"),
    position_won: z.string().min(1),
    proof_link: z.string().optional(),
});

export const VolunteeringSchema = z.object({
    username: z.string(),
    organization: z.string().min(1),
    role: z.string().min(1),
    hours_served: z.string().optional(),
    impact: z.string().optional(),
    proof_link: z.string().optional(),
});

export const ScholarshipSchema = z.object({
    username: z.string(),
    name: z.string().min(1),
    awarding_body: z.string().min(1),
    amount_prestige: z.string().optional(),
    proof_link: z.string().optional(),
});

export const ClubActivitySchema = z.object({
    username: z.string(),
    club_name: z.string().min(1),
    position: z.string().min(1),
    key_events: z.string().optional(),
    impact_description: z.string().optional(),
    proof_link: z.string().optional(),
});

export const DeptContributionSchema = z.object({
    username: z.string(),
    event_name: z.string().min(1),
    role: z.string().min(1),
    contribution_description: z.string().optional(),
    proof_link: z.string().optional(),
});

export const ProfessionalMembershipSchema = z.object({
    username: z.string(),
    organization: z.string().min(1),
    membership_id: z.string().optional(),
    role: z.string().optional(),
    proof_link: z.string().optional(),
});

export const ReferenceSchema = z.object({
    username: z.string(),
    faculty_name: z.string().min(1),
    contact: z.string().min(1),
    lor_link: z.string().optional(),
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

// New Types
export type Hackathon = z.infer<typeof HackathonSchema>;
export type Research = z.infer<typeof ResearchSchema>;
export type Entrepreneurship = z.infer<typeof EntrepreneurshipSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Exam = z.infer<typeof ExamSchema>;
export type SportsCultural = z.infer<typeof SportsCulturalSchema>;
export type Volunteering = z.infer<typeof VolunteeringSchema>;
export type Scholarship = z.infer<typeof ScholarshipSchema>;
export type ClubActivity = z.infer<typeof ClubActivitySchema>;
export type DeptContribution = z.infer<typeof DeptContributionSchema>;
export type ProfessionalMembership = z.infer<typeof ProfessionalMembershipSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;

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
    // New Sections
    hackathons: Hackathon[];
    research: Research[];
    entrepreneurship: Entrepreneurship[];
    certifications: Certification[];
    exams: Exam[];
    sports_cultural: SportsCultural[];
    volunteering: Volunteering[];
    scholarships: Scholarship[];
    club_activities: ClubActivity[];
    dept_contributions: DeptContribution[];
    professional_memberships: ProfessionalMembership[];
    references: Reference[];
}
