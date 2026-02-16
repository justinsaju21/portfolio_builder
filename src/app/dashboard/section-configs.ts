import {
    Briefcase, FolderOpen, Code, GraduationCap, Trophy,
    Zap, BookOpen, Globe, Award, Calendar, MapPin, Building2, Users, FileText, CheckCircle
} from "lucide-react";
import { SectionConfig } from "./components/GenericSection";

export const SECTION_CONFIGS: SectionConfig[] = [
    // ─── EXPERIENCE ───
    {
        id: "experience", label: "Experience", icon: Briefcase, category: "Professional",
        renderSubtitle: (item) => `${item.company} · ${item.title}`,
        renderBadges: (item) => [item.type],
        fields: [
            { name: "title", label: "Title", type: "text", required: true, placeholder: "Software Engineer" },
            { name: "company", label: "Company", type: "text", required: true, placeholder: "Google" },
            { name: "location", label: "Location", type: "text", placeholder: "Mountain View, CA" },
            { name: "start_date", label: "Start Date", type: "text", required: true, placeholder: "Jan 2023" },
            { name: "end_date", label: "End Date", type: "text", placeholder: "Present" },
            { name: "is_current", label: "I currently work here", type: "checkbox" },
            {
                name: "type", label: "Type", type: "select", options: [
                    { value: "job", label: "Full-time" }, { value: "internship", label: "Internship" },
                    { value: "freelance", label: "Freelance" }, { value: "contract", label: "Contract" }
                ]
            },
            { name: "description_points", label: "Description Points", type: "list", placeholder: "Add a highlight..." },
        ]
    },
    // ─── PROJECTS ───
    {
        id: "projects", label: "Projects", icon: FolderOpen, category: "Professional",
        renderSubtitle: (item) => item.description?.substring(0, 50) + (item.description?.length > 50 ? "..." : ""),
        renderBadges: (item) => item.tech_stack,
        fields: [
            { name: "title", label: "Project Title", type: "text", required: true, placeholder: "Portfolio Website" },
            { name: "description", label: "Description", type: "textarea", required: true, placeholder: "A brief description..." },
            { name: "tech_stack", label: "Tech Stack", type: "list", placeholder: "React, Next.js, etc." },
            { name: "repo_url", label: "Repository URL", type: "text", placeholder: "https://github.com/..." },
            { name: "live_url", label: "Live Demo URL", type: "text", placeholder: "https://..." },
            { name: "image_url", label: "Image URL", type: "text", placeholder: "https://..." },
            { name: "featured", label: "Feature on Home", type: "checkbox" },
        ]
    }, // SKILLS is confusing because it's category-based list. Stick to custom UI for Skills for now? 
    // Or map it: category as title, skills_list as list.
    {
        id: "skills", label: "Skills", icon: Code, category: "Professional",
        renderSubtitle: (item) => item.skills_list?.join(", "),
        fields: [
            { name: "category", label: "Category", type: "text", required: true, placeholder: "Frontend, Backend, etc." },
            { name: "skills_list", label: "Skills", type: "list", placeholder: "Add a skill..." },
        ]
    },

    // ─── ACADEMIC ───
    {
        id: "education", label: "Education", icon: GraduationCap, category: "Academic",
        renderSubtitle: (item) => `${item.institution} · ${item.degree}`,
        fields: [
            { name: "institution", label: "Institution", type: "text", required: true },
            { name: "degree", label: "Degree", type: "text", required: true },
            { name: "field", label: "Field of Study", type: "text" },
            { name: "year", label: "Year/Period", type: "text", required: true },
        ]
    },
    {
        id: "research", label: "Research", icon: BookOpen, category: "Academic",
        renderSubtitle: (item) => item.journal_conference,
        renderBadges: (item) => [item.publication_status],
        fields: [
            { name: "title", label: "Paper Title", type: "text", required: true },
            { name: "journal_conference", label: "Journal / Conference", type: "text", required: true },
            {
                name: "publication_status", label: "Status", type: "select", options: [
                    { value: "published", label: "Published" }, { value: "under_review", label: "Under Review" },
                    { value: "accepted", label: "Accepted" }
                ]
            },
            { name: "link", label: "Paper Link", type: "text" },
        ]
    },
    {
        id: "certifications", label: "Certifications", icon: Award, category: "Academic",
        renderSubtitle: (item) => item.provider,
        fields: [
            { name: "certificate_name", label: "Certificate Name", type: "text", required: true },
            { name: "provider", label: "Provider", type: "text", required: true, placeholder: "Coursera, AWS, etc." },
            { name: "validation_id", label: "Validation ID", type: "text" },
            { name: "proof_link", label: "Certificate URL", type: "text" },
        ]
    },
    {
        id: "exams", label: "Competitive Exams", icon: FileText, category: "Academic",
        renderSubtitle: (item) => `Score/Rank: ${item.score_rank}`,
        fields: [
            { name: "exam_name", label: "Exam Name", type: "text", required: true, placeholder: "GATE, GRE, CAT" },
            { name: "score_rank", label: "Score / Rank", type: "text", required: true },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "scholarships", label: "Scholarships", icon: Banknote, category: "Academic",
        renderSubtitle: (item) => item.awarding_body,
        fields: [
            { name: "name", label: "Scholarship Name", type: "text", required: true },
            { name: "awarding_body", label: "Awarding Body", type: "text", required: true },
            { name: "amount_prestige", label: "Amount / Prestige", type: "text" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },

    // ─── ACHIEVEMENTS ───
    {
        id: "hackathons", label: "Hackathons", icon: Zap, category: "Achievements",
        renderSubtitle: (item) => `Built ${item.project_built} · ${item.position}`,
        fields: [
            { name: "name", label: "Hackathon Name", type: "text", required: true },
            { name: "project_built", label: "Project Built", type: "text", required: true },
            { name: "position", label: "Position / Award", type: "text", required: true, placeholder: "Winner, Finalist, Participant" },
            { name: "team_size", label: "Team Size", type: "text" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "entrepreneurship", label: "Entrepreneurship", icon: Building2, category: "Achievements",
        renderSubtitle: (item) => item.revenue_funding ? `${item.revenue_funding}` : "Startup",
        fields: [
            { name: "startup_name", label: "Startup Name", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "registration_details", label: "Registration Details", type: "text" },
            { name: "revenue_funding", label: "Revenue / Funding", type: "text" },
            { name: "proof_link", label: "Website / Proof", type: "text" },
        ]
    },
    {
        id: "sports_cultural", label: "Sports & Cultural", icon: Activity, category: "Achievements",
        renderSubtitle: (item) => `${item.level} Level · ${item.position_won}`,
        fields: [
            { name: "event_name", label: "Event Name", type: "text", required: true },
            { name: "position_won", label: "Position Won", type: "text", required: true },
            {
                name: "level", label: "Level", type: "select", options: [
                    { value: "zone", label: "Zone" }, { value: "district", label: "District" },
                    { value: "state", label: "State" }, { value: "national", label: "National" },
                    { value: "international", label: "International" }
                ]
            },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },

    // ─── LEADERSHIP & SERVICE ───
    {
        id: "leadership", label: "Leadership", icon: Trophy, category: "Leadership",
        renderSubtitle: (item) => `${item.role || item.title} @ ${item.organization}`,
        renderBadges: (item) => [item.type],
        fields: [
            { name: "title", label: "Role Title", type: "text", required: true },
            { name: "organization", label: "Organization", type: "text", required: true },
            {
                name: "type", label: "Type", type: "select", options: [
                    { value: "club", label: "Club" }, { value: "academic", label: "Academic" },
                    { value: "volunteer", label: "Volunteer" }, { value: "competition", label: "Competition" }
                ]
            },
            { name: "description", label: "Description", type: "textarea" },
            { name: "achievements", label: "Key Achievements", type: "list" },
        ]
    },
    {
        id: "club_activities", label: "Club Activities", icon: Users, category: "Leadership",
        renderSubtitle: (item) => item.position,
        fields: [
            { name: "club_name", label: "Club Name", type: "text", required: true },
            { name: "position", label: "Position", type: "text", required: true },
            { name: "key_events", label: "Key Events Organized", type: "text" },
            { name: "impact_description", label: "Impact", type: "textarea" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "volunteering", label: "Volunteering", icon: Heart, category: "Leadership",
        renderSubtitle: (item) => item.role,
        fields: [
            { name: "organization", label: "Organization", type: "text", required: true },
            { name: "role", label: "Role", type: "text", required: true },
            { name: "hours_served", label: "Hours Served", type: "text" },
            { name: "impact", label: "Impact", type: "textarea" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "dept_contributions", label: "Dept Contributions", icon: Building2, category: "Leadership",
        renderSubtitle: (item) => item.role,
        fields: [
            { name: "event_name", label: "Event / Initiative", type: "text", required: true },
            { name: "role", label: "Role", type: "text", required: true },
            { name: "contribution_description", label: "Description", type: "textarea" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "professional_memberships", label: "Memberships", icon: Globe, category: "Leadership",
        renderSubtitle: (item) => item.membership_id ? `ID: ${item.membership_id}` : item.role,
        fields: [
            { name: "organization", label: "Organization", type: "text", required: true, placeholder: "IEEE, ACM, etc." },
            { name: "membership_id", label: "Membership ID", type: "text" },
            { name: "role", label: "Role", type: "text" },
            { name: "proof_link", label: "Proof URL", type: "text" },
        ]
    },
    {
        id: "references", label: "References", icon: UserCheck, category: "Leadership",
        renderSubtitle: (item) => item.contact,
        fields: [
            { name: "faculty_name", label: "Faculty Name", type: "text", required: true },
            { name: "contact", label: "Contact Info", type: "text", required: true },
            { name: "lor_link", label: "LOR Link", type: "text" },
        ]
    },
];

// Helper to get Lucide icons that were missing in the imports above
function IconPlaceholder() { return null; }
import { Banknote, Activity, Heart, UserCheck } from "lucide-react";
