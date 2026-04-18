import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Input, Button, FormField, SectionCard, Divider } from '@/components/ui'
import { BulletListEditor } from './BulletListEditor'
import type { WorkExperience } from '@/types/resume'

const EMPTY_EXP: Omit<WorkExperience, 'id'> = {
  company: '',
  title: '',
  location: '',
  start_date: '',
  end_date: null,
  bullets: [],
  tags: []
}

export function ExperienceEditor() {
  const experiences = useProfileStore((s) => s.profile.experiences)
  const add_experience = useProfileStore((s) => s.add_experience)
  const update_experience = useProfileStore((s) => s.update_experience)
  const remove_experience = useProfileStore((s) => s.remove_experience)
  const [expanded, set_expanded] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <SectionCard key={exp.id}>
          <div
            className="flex justify-between items-start cursor-pointer"
            onClick={() => set_expanded(expanded === exp.id ? null : exp.id)}
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {exp.title || <span className="text-slate-500 italic">Untitled Role</span>}
              </p>
              <p className="text-xs text-slate-400">
                {exp.company || 'Company'} {exp.start_date ? `· ${exp.start_date}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => { e.stopPropagation(); remove_experience(exp.id) }}
                aria-label="Remove experience"
              >
                ×
              </Button>
              <span className="text-slate-500 text-xs">{expanded === exp.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === exp.id && (
            <>
              <Divider />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Job Title">
                    <Input
                      value={exp.title}
                      onChange={(e) => update_experience(exp.id, { title: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Company">
                    <Input
                      value={exp.company}
                      onChange={(e) => update_experience(exp.id, { company: e.target.value })}
                    />
                  </FormField>
                </div>
                <FormField label="Location">
                  <Input
                    value={exp.location}
                    placeholder="City, State or Remote"
                    onChange={(e) => update_experience(exp.id, { location: e.target.value })}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Start Date (MM-YYYY)">
                    <Input
                      value={exp.start_date}
                      placeholder="01-2022"
                      onChange={(e) => update_experience(exp.id, { start_date: e.target.value })}
                    />
                  </FormField>
                  <FormField label="End Date (MM-YYYY or blank for Present)">
                    <Input
                      value={exp.end_date ?? ''}
                      placeholder="Present"
                      onChange={(e) =>
                        update_experience(exp.id, { end_date: e.target.value || null })
                      }
                    />
                  </FormField>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1.5">Bullet Points</p>
                  <BulletListEditor
                    bullets={exp.bullets}
                    onChange={(bullets) => update_experience(exp.id, { bullets })}
                    placeholder="Describe an achievement or responsibility..."
                  />
                </div>
                <FormField label="Tags (comma-separated, e.g. frontend, leadership)">
                  <Input
                    value={exp.tags.join(', ')}
                    placeholder="frontend, react, leadership"
                    onChange={(e) =>
                      update_experience(exp.id, {
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      })
                    }
                  />
                </FormField>
              </div>
            </>
          )}
        </SectionCard>
      ))}

      <Button
        variant="outline"
        onClick={() => {
          add_experience(EMPTY_EXP)
        }}
        className="w-full"
      >
        + Add Work Experience
      </Button>
    </div>
  )
}
