import type { MasterProfile, ResumeDocument, SectionKey } from '@/types/resume'

/** The resolved, filtered view of a resume ready for template rendering. */
export interface ResolvedResume {
  resume: ResumeDocument
  profile: MasterProfile
  summary: string
  experiences: MasterProfile['experiences']
  education: MasterProfile['education']
  skills: MasterProfile['skills']
  projects: MasterProfile['projects']
  certifications: MasterProfile['certifications']
  languages: MasterProfile['languages']
  custom_sections: MasterProfile['custom_sections']
  /** Sections in display order with hidden sections removed. */
  visible_sections: SectionKey[]
  /** Returns the bullet override for an item if one exists, otherwise the master bullets. */
  get_bullets: (item_id: string, master_bullets: string[]) => string[]
}

/**
 * Merges a ResumeDocument's inclusion lists and overrides with the MasterProfile
 * to produce a ResolvedResume that templates can render directly.
 *
 * Nothing is mutated — the same inputs always produce the same output.
 */
export function resolve_resume(
  resume: ResumeDocument,
  profile: MasterProfile
): ResolvedResume {
  const get_bullets = (item_id: string, master_bullets: string[]): string[] =>
    resume.bullet_overrides[item_id] ?? master_bullets

  const visible_sections = resume.section_order.filter(
    (s) => !resume.hidden_sections.includes(s)
  )

  return {
    resume,
    profile,
    summary: resume.summary_override ?? profile.personal.summary,
    experiences: profile.experiences.filter((e) => resume.included_experiences.includes(e.id)),
    education:   profile.education.filter((e)   => resume.included_education.includes(e.id)),
    skills:      profile.skills.filter((s)      => resume.included_skills.includes(s.id)),
    projects:    profile.projects.filter((p)    => resume.included_projects.includes(p.id)),
    certifications: profile.certifications.filter((c) => resume.included_certifications.includes(c.id)),
    languages:   profile.languages.filter((l)   => resume.included_languages.includes(l.id)),
    custom_sections: profile.custom_sections.filter((s) => resume.included_custom_sections.includes(s.id)),
    visible_sections,
    get_bullets
  }
}
