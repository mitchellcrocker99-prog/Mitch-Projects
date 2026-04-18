/**
 * profileStore — owns the MasterProfile: the permanent record of all career data.
 *
 * All mutations go through the `mutate` helper which updates Zustand state and
 * persists the new profile to disk via IPC in one step. The profile is loaded
 * once on app start via `load()`.
 */
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type {
  MasterProfile,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  CustomSection,
  CustomSectionItem
} from '@/types/resume'
// Proficiency / category fields removed from Skill — type is now just { id, name }
import { DEFAULT_PERSONAL_INFO } from '@/types/resume'

const STORE_KEY = 'profile'

const empty_profile: MasterProfile = {
  personal: { ...DEFAULT_PERSONAL_INFO },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  volunteer_work: [],
  custom_sections: []
}

async function load_profile(): Promise<MasterProfile> {
  if (typeof window === 'undefined' || !window.api) return empty_profile
  const saved = await window.api.store.get(STORE_KEY)
  if (!saved) return empty_profile
  return saved as MasterProfile
}

async function persist_profile(profile: MasterProfile): Promise<void> {
  if (typeof window === 'undefined' || !window.api) return
  await window.api.store.set(STORE_KEY, profile)
}

interface ProfileStore {
  profile: MasterProfile
  loaded: boolean

  // Init
  load: () => Promise<void>

  // Personal
  update_personal: (patch: Partial<PersonalInfo>) => void

  // Experiences
  add_experience: (exp: Omit<WorkExperience, 'id'>) => void
  update_experience: (id: string, patch: Partial<WorkExperience>) => void
  remove_experience: (id: string) => void

  // Education
  add_education: (edu: Omit<Education, 'id'>) => void
  update_education: (id: string, patch: Partial<Education>) => void
  remove_education: (id: string) => void

  // Skills
  add_skill: (skill: Omit<Skill, 'id'>) => void
  update_skill: (id: string, patch: Partial<Skill>) => void
  remove_skill: (id: string) => void

  // Projects
  add_project: (project: Omit<Project, 'id'>) => void
  update_project: (id: string, patch: Partial<Project>) => void
  remove_project: (id: string) => void

  // Certifications
  add_certification: (cert: Omit<Certification, 'id'>) => void
  update_certification: (id: string, patch: Partial<Certification>) => void
  remove_certification: (id: string) => void

  // Languages
  add_language: (lang: Omit<Language, 'id'>) => void
  update_language: (id: string, patch: Partial<Language>) => void
  remove_language: (id: string) => void

  // Custom sections
  add_custom_section: (title: string) => void
  update_custom_section: (id: string, patch: Partial<Omit<CustomSection, 'items'>>) => void
  remove_custom_section: (id: string) => void
  add_custom_item: (section_id: string, item: Omit<CustomSectionItem, 'id'>) => void
  update_custom_item: (section_id: string, item_id: string, patch: Partial<CustomSectionItem>) => void
  remove_custom_item: (section_id: string, item_id: string) => void
}

export const useProfileStore = create<ProfileStore>()(
  subscribeWithSelector((set, get) => {
    const mutate = (updater: (profile: MasterProfile) => MasterProfile) => {
      set((state) => {
        const new_profile = updater(state.profile)
        persist_profile(new_profile)
        return { profile: new_profile }
      })
    }

    return {
      profile: empty_profile,
      loaded: false,

      load: async () => {
        const profile = await load_profile()
        set({ profile, loaded: true })
      },

      update_personal: (patch) =>
        mutate((p) => ({ ...p, personal: { ...p.personal, ...patch } })),

      add_experience: (exp) =>
        mutate((p) => ({
          ...p,
          experiences: [...p.experiences, { ...exp, id: crypto.randomUUID() }]
        })),
      update_experience: (id, patch) =>
        mutate((p) => ({
          ...p,
          experiences: p.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e))
        })),
      remove_experience: (id) =>
        mutate((p) => ({ ...p, experiences: p.experiences.filter((e) => e.id !== id) })),

      add_education: (edu) =>
        mutate((p) => ({
          ...p,
          education: [...p.education, { ...edu, id: crypto.randomUUID() }]
        })),
      update_education: (id, patch) =>
        mutate((p) => ({
          ...p,
          education: p.education.map((e) => (e.id === id ? { ...e, ...patch } : e))
        })),
      remove_education: (id) =>
        mutate((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) })),

      add_skill: (skill) =>
        mutate((p) => ({
          ...p,
          skills: [...p.skills, { ...skill, id: crypto.randomUUID() }]
        })),
      update_skill: (id, patch) =>
        mutate((p) => ({
          ...p,
          skills: p.skills.map((s) => (s.id === id ? { ...s, ...patch } : s))
        })),
      remove_skill: (id) =>
        mutate((p) => ({ ...p, skills: p.skills.filter((s) => s.id !== id) })),

      add_project: (project) =>
        mutate((p) => ({
          ...p,
          projects: [...p.projects, { ...project, id: crypto.randomUUID() }]
        })),
      update_project: (id, patch) =>
        mutate((p) => ({
          ...p,
          projects: p.projects.map((pr) => (pr.id === id ? { ...pr, ...patch } : pr))
        })),
      remove_project: (id) =>
        mutate((p) => ({ ...p, projects: p.projects.filter((pr) => pr.id !== id) })),

      add_certification: (cert) =>
        mutate((p) => ({
          ...p,
          certifications: [...p.certifications, { ...cert, id: crypto.randomUUID() }]
        })),
      update_certification: (id, patch) =>
        mutate((p) => ({
          ...p,
          certifications: p.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c))
        })),
      remove_certification: (id) =>
        mutate((p) => ({ ...p, certifications: p.certifications.filter((c) => c.id !== id) })),

      add_language: (lang) =>
        mutate((p) => ({
          ...p,
          languages: [...p.languages, { ...lang, id: crypto.randomUUID() }]
        })),
      update_language: (id, patch) =>
        mutate((p) => ({
          ...p,
          languages: p.languages.map((l) => (l.id === id ? { ...l, ...patch } : l))
        })),
      remove_language: (id) =>
        mutate((p) => ({ ...p, languages: p.languages.filter((l) => l.id !== id) })),

      add_custom_section: (title) =>
        mutate((p) => ({
          ...p,
          custom_sections: [
            ...p.custom_sections,
            { id: crypto.randomUUID(), title, items: [] }
          ]
        })),
      update_custom_section: (id, patch) =>
        mutate((p) => ({
          ...p,
          custom_sections: p.custom_sections.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          )
        })),
      remove_custom_section: (id) =>
        mutate((p) => ({
          ...p,
          custom_sections: p.custom_sections.filter((s) => s.id !== id)
        })),
      add_custom_item: (section_id, item) =>
        mutate((p) => ({
          ...p,
          custom_sections: p.custom_sections.map((s) =>
            s.id === section_id
              ? { ...s, items: [...s.items, { ...item, id: crypto.randomUUID() }] }
              : s
          )
        })),
      update_custom_item: (section_id, item_id, patch) =>
        mutate((p) => ({
          ...p,
          custom_sections: p.custom_sections.map((s) =>
            s.id === section_id
              ? {
                  ...s,
                  items: s.items.map((i) => (i.id === item_id ? { ...i, ...patch } : i))
                }
              : s
          )
        })),
      remove_custom_item: (section_id, item_id) =>
        mutate((p) => ({
          ...p,
          custom_sections: p.custom_sections.map((s) =>
            s.id === section_id
              ? { ...s, items: s.items.filter((i) => i.id !== item_id) }
              : s
          )
        })),

      // Suppress unused warning — consumed by subscribeWithSelector subscribers
      _get: get
    } as ProfileStore & { _get: typeof get }
  })
)
