/**
 * Sidebar — two-section navigation: Profile tabs (personal info, experience, etc.)
 * and the Resumes list with create / duplicate / delete actions.
 */
import { useResumeStore } from '@/store/resumeStore'
import { Button } from '@/components/ui'
import type { TemplateId } from '@/types/resume'

type ProfileTab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages'
export type ActiveView = 'profile' | 'resume'
export type ActiveProfileTab = ProfileTab

const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' }
]

interface SidebarProps {
  active_view: ActiveView
  active_profile_tab: ActiveProfileTab
  on_view_change: (view: ActiveView) => void
  on_profile_tab_change: (tab: ActiveProfileTab) => void
}

export function Sidebar({
  active_view,
  active_profile_tab,
  on_view_change,
  on_profile_tab_change
}: SidebarProps) {
  const resumes = useResumeStore((s) => s.resumes)
  const active_id = useResumeStore((s) => s.active_id)
  const set_active = useResumeStore((s) => s.set_active)
  const create_resume = useResumeStore((s) => s.create_resume)
  const delete_resume = useResumeStore((s) => s.delete_resume)
  const duplicate_resume = useResumeStore((s) => s.duplicate_resume)

  const handle_new_resume = () => {
    const name = `Resume ${resumes.length + 1}`
    create_resume(name, 'modern' as TemplateId)
    on_view_change('resume')
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-slate-700 bg-slate-900 select-none">
      {/* App title */}
      <div className="px-4 py-4 border-b border-slate-700">
        <h1 className="text-sm font-bold text-slate-100 tracking-wide">Resume Builder</h1>
      </div>

      {/* Profile section */}
      <div className="px-3 pt-4 pb-2">
        <button
          className={`w-full text-left px-2 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-colors
            ${active_view === 'profile'
              ? 'text-blue-400'
              : 'text-slate-500 hover:text-slate-300'}`}
          onClick={() => on_view_change('profile')}
        >
          Profile
        </button>

        {active_view === 'profile' && (
          <div className="mt-1 space-y-0.5">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors
                  ${active_profile_tab === tab.id
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                onClick={() => on_profile_tab_change(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700/60 mx-3 my-2" />

      {/* Resumes section */}
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <button
            className={`text-xs font-semibold uppercase tracking-widest transition-colors
              ${active_view === 'resume'
                ? 'text-blue-400'
                : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => active_id && on_view_change('resume')}
          >
            Resumes
          </button>
          <Button variant="ghost" size="sm" onClick={handle_new_resume} aria-label="New resume">
            +
          </Button>
        </div>

        <div className="space-y-0.5">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`group flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors
                ${active_id === resume.id && active_view === 'resume'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              onClick={() => {
                set_active(resume.id)
                on_view_change('resume')
              }}
            >
              <span className="flex-1 truncate text-xs">{resume.name}</span>
              <div className="hidden group-hover:flex items-center gap-0.5">
                <button
                  className="p-0.5 text-slate-500 hover:text-slate-300 text-xs"
                  onClick={(e) => { e.stopPropagation(); duplicate_resume(resume.id) }}
                  aria-label="Duplicate resume"
                  title="Duplicate"
                >
                  ⎘
                </button>
                <button
                  className="p-0.5 text-slate-500 hover:text-red-400 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (resumes.length > 1) delete_resume(resume.id)
                  }}
                  aria-label="Delete resume"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {resumes.length === 0 && (
          <p className="text-xs text-slate-600 px-2 py-1">
            No resumes yet. Click + to create one.
          </p>
        )}
      </div>
    </aside>
  )
}
