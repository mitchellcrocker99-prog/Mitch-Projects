import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Input, Button, FormField, SectionCard, Divider } from '@/components/ui'
import { BulletListEditor } from './BulletListEditor'
import type { Project } from '@/types/resume'

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  name: '',
  description: '',
  bullets: [],
  technologies: [],
  url: '',
  start_date: '',
  end_date: null
}

export function ProjectsEditor() {
  const projects = useProfileStore((s) => s.profile.projects)
  const add_project = useProfileStore((s) => s.add_project)
  const update_project = useProfileStore((s) => s.update_project)
  const remove_project = useProfileStore((s) => s.remove_project)
  const [expanded, set_expanded] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {projects.map((proj) => (
        <SectionCard key={proj.id}>
          <div
            className="flex justify-between items-start cursor-pointer"
            onClick={() => set_expanded(expanded === proj.id ? null : proj.id)}
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {proj.name || <span className="text-slate-500 italic">Untitled Project</span>}
              </p>
              {proj.technologies.length > 0 && (
                <p className="text-xs text-slate-400">{proj.technologies.join(', ')}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => { e.stopPropagation(); remove_project(proj.id) }}
                aria-label="Remove project"
              >
                ×
              </Button>
              <span className="text-slate-500 text-xs">{expanded === proj.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === proj.id && (
            <>
              <Divider />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Project Name">
                    <Input
                      value={proj.name}
                      onChange={(e) => update_project(proj.id, { name: e.target.value })}
                    />
                  </FormField>
                  <FormField label="URL">
                    <Input
                      value={proj.url}
                      placeholder="github.com/user/project"
                      onChange={(e) => update_project(proj.id, { url: e.target.value })}
                    />
                  </FormField>
                </div>
                <FormField label="Technologies (comma-separated)">
                  <Input
                    value={proj.technologies.join(', ')}
                    placeholder="React, TypeScript, Node.js"
                    onChange={(e) =>
                      update_project(proj.id, {
                        technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      })
                    }
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Start Date">
                    <Input
                      value={proj.start_date}
                      placeholder="03-2023"
                      onChange={(e) => update_project(proj.id, { start_date: e.target.value })}
                    />
                  </FormField>
                  <FormField label="End Date">
                    <Input
                      value={proj.end_date ?? ''}
                      placeholder="Present"
                      onChange={(e) =>
                        update_project(proj.id, { end_date: e.target.value || null })
                      }
                    />
                  </FormField>
                </div>
                <FormField label="Description">
                  <Input
                    value={proj.description}
                    placeholder="Brief project description"
                    onChange={(e) => update_project(proj.id, { description: e.target.value })}
                  />
                </FormField>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1.5">Bullet Points</p>
                  <BulletListEditor
                    bullets={proj.bullets}
                    onChange={(bullets) => update_project(proj.id, { bullets })}
                    placeholder="Key achievement or feature..."
                  />
                </div>
              </div>
            </>
          )}
        </SectionCard>
      ))}

      <Button variant="outline" onClick={() => add_project(EMPTY_PROJECT)} className="w-full">
        + Add Project
      </Button>
    </div>
  )
}
