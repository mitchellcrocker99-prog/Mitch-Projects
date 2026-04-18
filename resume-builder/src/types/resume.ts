/**
 * Core TypeScript types for the resume builder.
 *
 * Data is split into two layers:
 *   MasterProfile  — permanent record of all career data; never destructively edited.
 *   ResumeDocument — a composition that references profile items by ID and stores
 *                    per-resume overrides (included items, bullet overrides, template config).
 */

// ── Primitives ────────────────────────────────────────────────────────────────

export type Proficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert' // kept for backwards compat
export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'native'
export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom'

// ── Master Profile sections ───────────────────────────────────────────────────

export interface PersonalInfo {
  full_name: string
  email: string
  phone: string
  location: string
  linked_in: string
  github: string
  website: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  title: string
  location: string
  start_date: string        // MM-YYYY
  end_date: string | null   // MM-YYYY or null = "Present"
  bullets: string[]
  tags: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  gpa: string
  highlights: string[]
}

export interface Skill {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  description: string
  bullets: string[]
  technologies: string[]
  url: string
  start_date: string
  end_date: string | null
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry_date: string | null
  credential_id: string
  url: string
}

export interface Language {
  id: string
  language: string
  proficiency: LanguageProficiency
}

export interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  date: string
  bullets: string[]
}

export interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
}

// ── Master Profile ────────────────────────────────────────────────────────────

export interface MasterProfile {
  personal: PersonalInfo
  experiences: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  volunteer_work: CustomSection[]
  custom_sections: CustomSection[]
}

// ── Resume Document ───────────────────────────────────────────────────────────

export interface ResumeDocument {
  id: string
  name: string
  template_id: TemplateId
  target_role: string
  created_at: string
  updated_at: string

  // Optional overrides
  summary_override: string | null

  // Inclusion sets — only these IDs appear in the rendered resume
  included_experiences: string[]
  included_education: string[]
  included_skills: string[]
  included_projects: string[]
  included_certifications: string[]
  included_languages: string[]
  included_custom_sections: string[]

  // Per-item bullet overrides keyed by item id
  bullet_overrides: Record<string, string[]>

  // Section layout
  section_order: SectionKey[]
  hidden_sections: SectionKey[]

  // Template-specific display config
  template_config: TemplateConfig
}

// ── Template types ────────────────────────────────────────────────────────────

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'technical'

export interface TemplateConfig {
  accent_color: string
  font_size: 'sm' | 'md' | 'lg'
  paper_size: 'letter' | 'a4'
  show_photo: boolean
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  accent_color: '#2563eb',
  font_size: 'md',
  paper_size: 'letter',
  show_photo: false
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linked_in: '',
  github: '',
  website: '',
  summary: ''
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'custom'
]

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  custom: 'Custom Sections'
}

/** Converts a stored MM-YYYY date string to a human-readable label (e.g. "Jan 2022"). Returns "Present" for null. */
export function format_date(date: string | null): string {
  if (!date) return 'Present'
  const [month, year] = date.split('-')
  const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month_index = parseInt(month, 10) - 1
  return `${month_names[month_index]} ${year}`
}
