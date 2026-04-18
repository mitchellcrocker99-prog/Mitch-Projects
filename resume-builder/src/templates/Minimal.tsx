import type { TemplateProps } from './index'
import { format_date } from '@/types/resume'

export function MinimalTemplate({ data }: TemplateProps) {
  const { resume, profile, summary, experiences, education, skills, projects,
          certifications, languages, custom_sections, visible_sections, get_bullets } = data
  const { font_size } = resume.template_config
  const font_class = font_size === 'sm' ? 'text-[11px]' : font_size === 'lg' ? 'text-[13px]' : 'text-[12px]'

  return (
    <div
      className={`w-full h-full bg-white ${font_class} font-sans px-14 pt-12 pb-10`}
      style={{ color: '#222' }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-gray-900">
          {profile.personal.full_name || 'Your Name'}
        </h1>
        {resume.target_role && (
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">{resume.target_role}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-3 text-xs text-gray-400">
          {profile.personal.email && <span>{profile.personal.email}</span>}
          {profile.personal.phone && <span>{profile.personal.phone}</span>}
          {profile.personal.location && <span>{profile.personal.location}</span>}
          {profile.personal.linked_in && <span>{profile.personal.linked_in}</span>}
          {profile.personal.github && <span>{profile.personal.github}</span>}
        </div>
      </div>

      <div className="space-y-6">
        {visible_sections.map((section) => {
          if (section === 'summary' && summary) {
            return (
              <section key="summary">
                <MinimalHeader label="About" />
                <p className="text-gray-500 leading-relaxed text-xs">{summary}</p>
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="experience">
                <MinimalHeader label="Experience" />
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{exp.title}</p>
                          <p className="text-xs text-gray-400">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                        </div>
                        <span className="text-[10px] text-gray-300 whitespace-nowrap ml-3 mt-0.5">
                          {format_date(exp.start_date)} — {format_date(exp.end_date)}
                        </span>
                      </div>
                      <ul className="mt-1.5 space-y-0.5 text-gray-500 text-xs list-none">
                        {get_bullets(exp.id, exp.bullets).map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-gray-300 select-none">–</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'education' && education.length > 0) {
            return (
              <section key="education">
                <MinimalHeader label="Education" />
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{edu.institution}</p>
                        <p className="text-xs text-gray-400">
                          {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                          {edu.gpa ? ` · ${edu.gpa}` : ''}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-300 whitespace-nowrap ml-3 mt-0.5">
                        {format_date(edu.start_date)} — {format_date(edu.end_date)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <MinimalHeader label="Skills" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  {skills.map((s) => s.name).join('  ·  ')}
                </p>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects">
                <MinimalHeader label="Projects" />
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{proj.name}</p>
                        {proj.url && <span className="text-[10px] text-gray-300">{proj.url}</span>}
                      </div>
                      {proj.technologies.length > 0 && (
                        <p className="text-[10px] text-gray-300">{proj.technologies.join(', ')}</p>
                      )}
                      {proj.description && <p className="text-xs text-gray-500 mt-0.5">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'certifications' && certifications.length > 0) {
            return (
              <section key="certifications">
                <MinimalHeader label="Certifications" />
                <div className="space-y-1">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between text-xs">
                      <span className="text-gray-600">{cert.name} <span className="text-gray-400">· {cert.issuer}</span></span>
                      <span className="text-gray-300">{format_date(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'languages' && languages.length > 0) {
            return (
              <section key="languages">
                <MinimalHeader label="Languages" />
                <p className="text-xs text-gray-500">
                  {languages.map((l) => `${l.language} — ${l.proficiency}`).join('  ·  ')}
                </p>
              </section>
            )
          }

          if (section === 'custom' && custom_sections.length > 0) {
            return (
              <div key="custom" className="space-y-6">
                {custom_sections.map((sec) => (
                  <section key={sec.id}>
                    <MinimalHeader label={sec.title} />
                    <div className="space-y-3">
                      {sec.items.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-800">{item.title}</p>
                            {item.date && <span className="text-[10px] text-gray-300">{item.date}</span>}
                          </div>
                          {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

function MinimalHeader({ label }: { label: string }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300 mb-2">
      {label}
    </h2>
  )
}
