/**
 * resumeStore — manages the list of ResumeDocuments and tracks which one is active.
 *
 * A ResumeDocument never duplicates profile data; it stores only inclusion lists
 * (arrays of profile item IDs) and per-item bullet overrides. The `active_resume()`
 * derived helper returns the currently selected document for use in the editor and preview.
 *
 * All mutations persist to disk via IPC through the `mutate_resume` helper.
 */
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { ResumeDocument, SectionKey, TemplateId, TemplateConfig } from '@/types/resume'
import { DEFAULT_TEMPLATE_CONFIG, DEFAULT_SECTION_ORDER } from '@/types/resume'

const STORE_KEY_RESUMES = 'resumes'
const STORE_KEY_ACTIVE = 'activeResumeId'

async function load_resumes(): Promise<ResumeDocument[]> {
  if (typeof window === 'undefined' || !window.api) return []
  const saved = await window.api.store.get(STORE_KEY_RESUMES)
  return (saved as ResumeDocument[]) ?? []
}

async function load_active_id(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.api) return null
  const saved = await window.api.store.get(STORE_KEY_ACTIVE)
  return (saved as string) ?? null
}

async function persist(resumes: ResumeDocument[], active_id: string | null): Promise<void> {
  if (typeof window === 'undefined' || !window.api) return
  await window.api.store.set(STORE_KEY_RESUMES, resumes)
  if (active_id) await window.api.store.set(STORE_KEY_ACTIVE, active_id)
}

function make_resume(name: string, template_id: TemplateId): ResumeDocument {
  return {
    id: crypto.randomUUID(),
    name,
    template_id,
    target_role: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    summary_override: null,
    included_experiences: [],
    included_education: [],
    included_skills: [],
    included_projects: [],
    included_certifications: [],
    included_languages: [],
    included_custom_sections: [],
    bullet_overrides: {},
    section_order: [...DEFAULT_SECTION_ORDER],
    hidden_sections: [],
    template_config: { ...DEFAULT_TEMPLATE_CONFIG }
  }
}

interface ResumeStore {
  resumes: ResumeDocument[]
  active_id: string | null
  loaded: boolean

  // Init
  load: () => Promise<void>

  // Resume CRUD
  create_resume: (name: string, template_id: TemplateId) => ResumeDocument
  duplicate_resume: (id: string) => ResumeDocument | null
  delete_resume: (id: string) => void
  set_active: (id: string) => void
  update_resume: (id: string, patch: Partial<ResumeDocument>) => void

  // Inclusion toggles
  toggle_included: (resume_id: string, section: SectionKey, item_id: string) => void
  set_all_included: (resume_id: string, section: SectionKey, item_ids: string[]) => void

  // Bullet overrides
  set_bullet_override: (resume_id: string, item_id: string, bullets: string[]) => void
  clear_bullet_override: (resume_id: string, item_id: string) => void

  // Section layout
  reorder_sections: (resume_id: string, new_order: SectionKey[]) => void
  toggle_hidden_section: (resume_id: string, section: SectionKey) => void

  // Template config
  update_template_config: (resume_id: string, patch: Partial<TemplateConfig>) => void

  // Derived helpers
  active_resume: () => ResumeDocument | null
}

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector((set, get) => {
    const mutate_resume = (
      resume_id: string,
      updater: (r: ResumeDocument) => ResumeDocument
    ) => {
      set((state) => {
        const new_resumes = state.resumes.map((r) =>
          r.id === resume_id ? { ...updater(r), updated_at: new Date().toISOString() } : r
        )
        persist(new_resumes, state.active_id)
        return { resumes: new_resumes }
      })
    }

    const inclusion_key = (section: SectionKey): keyof ResumeDocument => {
      const map: Record<SectionKey, keyof ResumeDocument> = {
        summary: 'included_experiences',
        experience: 'included_experiences',
        education: 'included_education',
        skills: 'included_skills',
        projects: 'included_projects',
        certifications: 'included_certifications',
        languages: 'included_languages',
        custom: 'included_custom_sections'
      }
      return map[section]
    }

    return {
      resumes: [],
      active_id: null,
      loaded: false,

      load: async () => {
        const [resumes, active_id] = await Promise.all([load_resumes(), load_active_id()])
        const resolved_active = active_id && resumes.find((r) => r.id === active_id)
          ? active_id
          : resumes[0]?.id ?? null
        set({ resumes, active_id: resolved_active, loaded: true })
      },

      create_resume: (name, template_id) => {
        const resume = make_resume(name, template_id)
        set((state) => {
          const new_resumes = [...state.resumes, resume]
          persist(new_resumes, resume.id)
          return { resumes: new_resumes, active_id: resume.id }
        })
        return resume
      },

      duplicate_resume: (id) => {
        const source = get().resumes.find((r) => r.id === id)
        if (!source) return null
        const copy: ResumeDocument = {
          ...source,
          id: crypto.randomUUID(),
          name: `${source.name} (copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        set((state) => {
          const new_resumes = [...state.resumes, copy]
          persist(new_resumes, copy.id)
          return { resumes: new_resumes, active_id: copy.id }
        })
        return copy
      },

      delete_resume: (id) => {
        set((state) => {
          const new_resumes = state.resumes.filter((r) => r.id !== id)
          const new_active =
            state.active_id === id ? (new_resumes[0]?.id ?? null) : state.active_id
          persist(new_resumes, new_active)
          return { resumes: new_resumes, active_id: new_active }
        })
      },

      set_active: (id) => {
        set((state) => {
          persist(state.resumes, id)
          return { active_id: id }
        })
      },

      update_resume: (id, patch) => {
        mutate_resume(id, (r) => ({ ...r, ...patch }))
      },

      // Adds item_id to the inclusion list if absent, removes it if present
    toggle_included: (resume_id, section, item_id) => {
        mutate_resume(resume_id, (r) => {
          const key = inclusion_key(section) as keyof Pick<
            ResumeDocument,
            | 'included_experiences'
            | 'included_education'
            | 'included_skills'
            | 'included_projects'
            | 'included_certifications'
            | 'included_languages'
            | 'included_custom_sections'
          >
          const current = r[key] as string[]
          const next = current.includes(item_id)
            ? current.filter((x) => x !== item_id)
            : [...current, item_id]
          return { ...r, [key]: next }
        })
      },

      set_all_included: (resume_id, section, item_ids) => {
        mutate_resume(resume_id, (r) => ({
          ...r,
          [inclusion_key(section)]: item_ids
        }))
      },

      // Stores a per-resume replacement bullet list for an item; clear_bullet_override reverts to master
      set_bullet_override: (resume_id, item_id, bullets) => {
        mutate_resume(resume_id, (r) => ({
          ...r,
          bullet_overrides: { ...r.bullet_overrides, [item_id]: bullets }
        }))
      },

      clear_bullet_override: (resume_id, item_id) => {
        mutate_resume(resume_id, (r) => {
          const { [item_id]: _removed, ...rest } = r.bullet_overrides
          return { ...r, bullet_overrides: rest }
        })
      },

      reorder_sections: (resume_id, new_order) => {
        mutate_resume(resume_id, (r) => ({ ...r, section_order: new_order }))
      },

      toggle_hidden_section: (resume_id, section) => {
        mutate_resume(resume_id, (r) => {
          const hidden = r.hidden_sections.includes(section)
            ? r.hidden_sections.filter((s) => s !== section)
            : [...r.hidden_sections, section]
          return { ...r, hidden_sections: hidden }
        })
      },

      update_template_config: (resume_id, patch) => {
        mutate_resume(resume_id, (r) => ({
          ...r,
          template_config: { ...r.template_config, ...patch }
        }))
      },

      active_resume: () => {
        const { resumes, active_id } = get()
        return resumes.find((r) => r.id === active_id) ?? null
      }
    }
  })
)
