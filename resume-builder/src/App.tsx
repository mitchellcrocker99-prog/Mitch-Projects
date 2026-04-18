import { useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useResumeStore } from '@/store/resumeStore'
import { SAMPLE_PROFILE, SAMPLE_RESUME } from '@/lib/sampleData'
import { Sidebar, type ActiveView, type ActiveProfileTab } from '@/components/Sidebar'
import { Titlebar } from '@/components/Titlebar'
import { PreviewPane } from '@/components/preview/PreviewPane'
import { PersonalEditor } from '@/components/editor/PersonalEditor'
import { ExperienceEditor } from '@/components/editor/ExperienceEditor'
import { EducationEditor } from '@/components/editor/EducationEditor'
import { SkillsEditor } from '@/components/editor/SkillsEditor'
import { ProjectsEditor } from '@/components/editor/ProjectsEditor'
import { CertificationsEditor } from '@/components/editor/CertificationsEditor'
import { LanguagesEditor } from '@/components/editor/LanguagesEditor'
import { ResumeComposer } from '@/components/editor/ResumeComposer'

const PROFILE_TAB_LABELS: Record<ActiveProfileTab, string> = {
  personal: 'Personal Info',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages'
}

export default function App() {
  const load_profile = useProfileStore((s) => s.load)
  const load_resumes = useResumeStore((s) => s.load)
  const profile_loaded = useProfileStore((s) => s.loaded)
  const resumes_loaded = useResumeStore((s) => s.loaded)

  const [active_view, set_active_view] = useState<ActiveView>('profile')
  const [active_profile_tab, set_active_profile_tab] = useState<ActiveProfileTab>('personal')

  useEffect(() => {
    const init = async () => {
      await Promise.all([load_profile(), load_resumes()])
      const profile = useProfileStore.getState().profile
      const resumes = useResumeStore.getState().resumes
      // Seed sample data when the store is empty or skills are missing (e.g. after a store migration)
      if (profile.skills.length === 0 || (!profile.personal.full_name && resumes.length === 0)) {
        useProfileStore.setState({ profile: SAMPLE_PROFILE })
        await window.api?.store.set('profile', SAMPLE_PROFILE)
        useResumeStore.setState({
          resumes: [SAMPLE_RESUME],
          active_id: SAMPLE_RESUME.id
        })
        await window.api?.store.set('resumes', [SAMPLE_RESUME])
        await window.api?.store.set('activeResumeId', SAMPLE_RESUME.id)
      }
    }
    init()
  }, [load_profile, load_resumes])

  if (!profile_loaded || !resumes_loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-500 text-sm">
        Loading...
      </div>
    )
  }

  const editor_label =
    active_view === 'resume'
      ? 'Resume Composer'
      : PROFILE_TAB_LABELS[active_profile_tab]

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Titlebar />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          active_view={active_view}
          active_profile_tab={active_profile_tab}
          on_view_change={set_active_view}
          on_profile_tab_change={set_active_profile_tab}
        />

        {/* Editor panel */}
        <main className="w-[420px] shrink-0 flex flex-col border-r border-slate-700 bg-slate-900">
          <div className="px-4 py-3 border-b border-slate-700 shrink-0">
            <h2 className="text-sm font-semibold text-slate-200">{editor_label}</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {active_view === 'profile' && active_profile_tab === 'personal' && <PersonalEditor />}
            {active_view === 'profile' && active_profile_tab === 'experience' && <ExperienceEditor />}
            {active_view === 'profile' && active_profile_tab === 'education' && <EducationEditor />}
            {active_view === 'profile' && active_profile_tab === 'skills' && <SkillsEditor />}
            {active_view === 'profile' && active_profile_tab === 'projects' && <ProjectsEditor />}
            {active_view === 'profile' && active_profile_tab === 'certifications' && <CertificationsEditor />}
            {active_view === 'profile' && active_profile_tab === 'languages' && <LanguagesEditor />}
            {active_view === 'resume' && <ResumeComposer />}
          </div>
        </main>

        {/* Preview pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <PreviewPane />
        </div>
      </div>
    </div>
  )
}
