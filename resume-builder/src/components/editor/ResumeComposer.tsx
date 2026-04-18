/**
 * ResumeComposer — editor panel shown when a resume is active.
 *
 * Allows the user to configure per-resume settings (name, target role, summary override,
 * template config, section visibility) and to include/exclude individual profile items
 * and their individual bullet points from the active resume.
 *
 * Bullet toggles work by writing a filtered list into `bullet_overrides`. When all master
 * bullets are re-selected the override is cleared, reverting to the master profile data.
 */
import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useResumeStore } from '@/store/resumeStore'
import { Button, Input, Textarea, FormField, SectionCard, Select, Divider } from '@/components/ui'
import type { ResumeDocument, SectionKey } from '@/types/resume'
import { SECTION_LABELS } from '@/types/resume'

export function ResumeComposer() {
  const active_resume = useResumeStore((s) => s.active_resume())
  const update_resume = useResumeStore((s) => s.update_resume)
  const toggle_included = useResumeStore((s) => s.toggle_included)
  const toggle_hidden_section = useResumeStore((s) => s.toggle_hidden_section)
  const update_template_config = useResumeStore((s) => s.update_template_config)
  const set_bullet_override = useResumeStore((s) => s.set_bullet_override)
  const clear_bullet_override = useResumeStore((s) => s.clear_bullet_override)
  const profile = useProfileStore((s) => s.profile)

  if (!active_resume) {
    return (
      <div className="text-slate-500 text-sm p-4">
        No resume selected. Create one from the sidebar.
      </div>
    )
  }

  const r = active_resume

  const handle_bullet_toggle = (item_id: string, master_bullets: string[], bullet: string) => {
    const current_active = r.bullet_overrides[item_id] ?? master_bullets
    const is_active = current_active.includes(bullet)
    const next = is_active
      ? current_active.filter((b) => b !== bullet)
      : [...current_active, bullet]

    // Preserve master order when re-adding
    const ordered = master_bullets.filter((b) => next.includes(b))

    // If result matches master exactly, clear the override
    if (ordered.length === master_bullets.length) {
      clear_bullet_override(r.id, item_id)
    } else {
      set_bullet_override(r.id, item_id, ordered)
    }
  }

  return (
    <div className="space-y-5">
      {/* Resume meta */}
      <SectionCard>
        <div className="space-y-3">
          <FormField label="Resume Name">
            <Input
              value={r.name}
              placeholder="e.g. Senior Engineer @ Stripe"
              onChange={(e) => update_resume(r.id, { name: e.target.value })}
            />
          </FormField>
          <FormField label="Target Role">
            <Input
              value={r.target_role}
              placeholder="e.g. Senior Software Engineer"
              onChange={(e) => update_resume(r.id, { target_role: e.target.value })}
            />
          </FormField>
          <FormField label="Summary Override (leave blank to use profile default)">
            <Textarea
              rows={3}
              value={r.summary_override ?? ''}
              placeholder="Override the summary for this specific resume..."
              onChange={(e) =>
                update_resume(r.id, { summary_override: e.target.value || null })
              }
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Template config */}
      <SectionCard>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Template Settings
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Accent Color">
            <div className="flex gap-2">
              <input
                type="color"
                value={r.template_config.accent_color}
                className="w-10 h-8 rounded cursor-pointer bg-transparent border border-slate-600"
                onChange={(e) => update_template_config(r.id, { accent_color: e.target.value })}
              />
              <Input
                value={r.template_config.accent_color}
                onChange={(e) => update_template_config(r.id, { accent_color: e.target.value })}
              />
            </div>
          </FormField>
          <FormField label="Font Size">
            <Select
              value={r.template_config.font_size}
              onChange={(e) =>
                update_template_config(r.id, { font_size: e.target.value as 'sm' | 'md' | 'lg' })
              }
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </Select>
          </FormField>
          <FormField label="Paper Size">
            <Select
              value={r.template_config.paper_size}
              onChange={(e) =>
                update_template_config(r.id, { paper_size: e.target.value as 'letter' | 'a4' })
              }
            >
              <option value="letter">US Letter</option>
              <option value="a4">A4</option>
            </Select>
          </FormField>
        </div>
      </SectionCard>

      {/* Section visibility */}
      <SectionCard>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Section Visibility
        </p>
        <div className="grid grid-cols-2 gap-2">
          {r.section_order.map((section) => (
            <label
              key={section}
              className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!r.hidden_sections.includes(section)}
                onChange={() => toggle_hidden_section(r.id, section)}
                className="rounded accent-blue-500"
              />
              {SECTION_LABELS[section]}
            </label>
          ))}
        </div>
      </SectionCard>

      {/* Work Experience */}
      {profile.experiences.length > 0 && !r.hidden_sections.includes('experience') && (
        <InclusionBlock
          title="Work Experience"
          section="experience"
          resume={r}
          items={profile.experiences.map((e) => ({
            id: e.id,
            label: e.title || 'Untitled',
            sub: e.company,
            bullets: e.bullets
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}

      {/* Education */}
      {profile.education.length > 0 && !r.hidden_sections.includes('education') && (
        <InclusionBlock
          title="Education"
          section="education"
          resume={r}
          items={profile.education.map((e) => ({
            id: e.id,
            label: e.institution || 'Institution',
            sub: e.degree,
            bullets: e.highlights
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}

      {/* Skills */}
      {profile.skills.length > 0 && !r.hidden_sections.includes('skills') && (
        <InclusionBlock
          title="Skills"
          section="skills"
          resume={r}
          items={profile.skills.map((s) => ({
            id: s.id,
            label: s.name
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}

      {/* Projects */}
      {profile.projects.length > 0 && !r.hidden_sections.includes('projects') && (
        <InclusionBlock
          title="Projects"
          section="projects"
          resume={r}
          items={profile.projects.map((p) => ({
            id: p.id,
            label: p.name || 'Untitled Project',
            sub: p.technologies.slice(0, 3).join(', '),
            bullets: p.bullets
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && !r.hidden_sections.includes('certifications') && (
        <InclusionBlock
          title="Certifications"
          section="certifications"
          resume={r}
          items={profile.certifications.map((c) => ({
            id: c.id,
            label: c.name,
            sub: c.issuer
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}

      {/* Languages */}
      {profile.languages.length > 0 && !r.hidden_sections.includes('languages') && (
        <InclusionBlock
          title="Languages"
          section="languages"
          resume={r}
          items={profile.languages.map((l) => ({
            id: l.id,
            label: l.language,
            sub: l.proficiency
          }))}
          on_toggle={toggle_included}
          on_bullet_toggle={handle_bullet_toggle}
        />
      )}
    </div>
  )
}

// ── InclusionBlock ────────────────────────────────────────────────────────────

interface InclusionItem {
  id: string
  label: string
  sub?: string
  bullets?: string[]   // master bullet list; when present, per-bullet toggles appear
}

interface InclusionBlockProps {
  title: string
  section: SectionKey
  resume: ResumeDocument
  items: InclusionItem[]
  on_toggle: (resume_id: string, section: SectionKey, item_id: string) => void
  on_bullet_toggle: (item_id: string, master_bullets: string[], bullet: string) => void
}

function InclusionBlock({
  title, section, resume, items, on_toggle, on_bullet_toggle
}: InclusionBlockProps) {
  const [expanded, set_expanded] = useState<Set<string>>(new Set())

  const included_ids = ((): string[] => {
    const map: Record<SectionKey, keyof typeof resume> = {
      summary: 'included_experiences',
      experience: 'included_experiences',
      education: 'included_education',
      skills: 'included_skills',
      projects: 'included_projects',
      certifications: 'included_certifications',
      languages: 'included_languages',
      custom: 'included_custom_sections'
    }
    return resume[map[section]] as string[]
  })()

  const toggle_expand = (id: string) =>
    set_expanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <SectionCard>
      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              items.forEach((i) => {
                if (!included_ids.includes(i.id)) on_toggle(resume.id, section, i.id)
              })
            }
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              items.forEach((i) => {
                if (included_ids.includes(i.id)) on_toggle(resume.id, section, i.id)
              })
            }
          >
            None
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => {
          const is_included = included_ids.includes(item.id)
          const has_bullets = item.bullets && item.bullets.length > 0
          const is_expanded = expanded.has(item.id)
          const active_bullets = resume.bullet_overrides[item.id] ?? item.bullets ?? []
          const all_active = active_bullets.length === (item.bullets?.length ?? 0)

          return (
            <div key={item.id}>
              {/* Item row */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={is_included}
                  onChange={() => on_toggle(resume.id, section, item.id)}
                  className="rounded accent-blue-500 shrink-0"
                />
                <span
                  className={`flex-1 text-sm truncate ${
                    is_included ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
                {item.sub && (
                  <span className="text-xs text-slate-500 shrink-0">{item.sub}</span>
                )}
                {/* Expand chevron — only when item is included and has bullets */}
                {is_included && has_bullets && (
                  <button
                    onClick={() => toggle_expand(item.id)}
                    className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-1"
                    aria-label={is_expanded ? 'Collapse bullets' : 'Expand bullets'}
                    title={is_expanded ? 'Hide bullets' : 'Edit bullets'}
                  >
                    {is_expanded ? '▲' : '▼'}
                  </button>
                )}
              </div>

              {/* Bullet toggles */}
              {is_included && is_expanded && has_bullets && (
                <div className="ml-5 mt-1.5 mb-2 space-y-1 border-l-2 border-slate-700 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Bullets ({active_bullets.length}/{item.bullets!.length})
                    </span>
                    <button
                      onClick={() => {
                        if (all_active) {
                          useResumeStore.getState().set_bullet_override(resume.id, item.id, [])
                        } else {
                          useResumeStore.getState().clear_bullet_override(resume.id, item.id)
                        }
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      {all_active ? 'Deselect all' : 'Select all'}
                    </button>
                  </div>
                  {item.bullets!.map((bullet, idx) => {
                    const is_bullet_active = active_bullets.includes(bullet)
                    return (
                      <label
                        key={idx}
                        className="flex items-start gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={is_bullet_active}
                          onChange={() => on_bullet_toggle(item.id, item.bullets!, bullet)}
                          className="rounded accent-blue-500 mt-0.5 shrink-0"
                        />
                        <span
                          className={`text-xs leading-relaxed ${
                            is_bullet_active
                              ? 'text-slate-300 group-hover:text-slate-100'
                              : 'text-slate-600 line-through'
                          }`}
                        >
                          {bullet}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
