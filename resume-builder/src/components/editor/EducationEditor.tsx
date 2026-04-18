import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Input, Button, FormField, SectionCard, Divider } from '@/components/ui'
import { BulletListEditor } from './BulletListEditor'
import type { Education } from '@/types/resume'

const EMPTY_EDU: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  start_date: '',
  end_date: null,
  gpa: '',
  highlights: []
}

export function EducationEditor() {
  const education = useProfileStore((s) => s.profile.education)
  const add_education = useProfileStore((s) => s.add_education)
  const update_education = useProfileStore((s) => s.update_education)
  const remove_education = useProfileStore((s) => s.remove_education)
  const [expanded, set_expanded] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {education.map((edu) => (
        <SectionCard key={edu.id}>
          <div
            className="flex justify-between items-start cursor-pointer"
            onClick={() => set_expanded(expanded === edu.id ? null : edu.id)}
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {edu.institution || <span className="text-slate-500 italic">Institution</span>}
              </p>
              <p className="text-xs text-slate-400">
                {[edu.degree, edu.field].filter(Boolean).join(', ') || 'Degree'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => { e.stopPropagation(); remove_education(edu.id) }}
                aria-label="Remove education"
              >
                ×
              </Button>
              <span className="text-slate-500 text-xs">{expanded === edu.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === edu.id && (
            <>
              <Divider />
              <div className="space-y-3">
                <FormField label="Institution">
                  <Input
                    value={edu.institution}
                    onChange={(e) => update_education(edu.id, { institution: e.target.value })}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Degree">
                    <Input
                      value={edu.degree}
                      placeholder="Bachelor of Science"
                      onChange={(e) => update_education(edu.id, { degree: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Field of Study">
                    <Input
                      value={edu.field}
                      placeholder="Computer Science"
                      onChange={(e) => update_education(edu.id, { field: e.target.value })}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField label="Start Date">
                    <Input
                      value={edu.start_date}
                      placeholder="09-2018"
                      onChange={(e) => update_education(edu.id, { start_date: e.target.value })}
                    />
                  </FormField>
                  <FormField label="End Date">
                    <Input
                      value={edu.end_date ?? ''}
                      placeholder="Present"
                      onChange={(e) =>
                        update_education(edu.id, { end_date: e.target.value || null })
                      }
                    />
                  </FormField>
                  <FormField label="GPA">
                    <Input
                      value={edu.gpa}
                      placeholder="3.8 / 4.0"
                      onChange={(e) => update_education(edu.id, { gpa: e.target.value })}
                    />
                  </FormField>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1.5">Highlights</p>
                  <BulletListEditor
                    bullets={edu.highlights}
                    onChange={(highlights) => update_education(edu.id, { highlights })}
                    placeholder="Dean's List, relevant coursework, honors..."
                  />
                </div>
              </div>
            </>
          )}
        </SectionCard>
      ))}

      <Button variant="outline" onClick={() => add_education(EMPTY_EDU)} className="w-full">
        + Add Education
      </Button>
    </div>
  )
}
