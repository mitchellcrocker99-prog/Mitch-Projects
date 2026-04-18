import type { TemplateProps } from './index'
import { format_date } from '@/types/resume'

export function ClassicTemplate({ data }: TemplateProps) {
  const { resume, profile, summary, experiences, education, skills, projects,
          certifications, languages, custom_sections, visible_sections, get_bullets } = data
  const { font_size } = resume.template_config
  const font_class = font_size === 'sm' ? 'text-[11px]' : font_size === 'lg' ? 'text-[13px]' : 'text-[12px]'

  return (
    <div className={`w-full h-full bg-white ${font_class} font-serif px-12 pt-10 pb-8`} style={{ color: '#111' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-5">
        <h1 className="text-4xl font-bold tracking-wide uppercase">
          {profile.personal.full_name || 'Your Name'}
        </h1>
        {resume.target_role && (
          <p className="mt-1 text-sm italic text-gray-600">{resume.target_role}</p>
        )}
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-gray-700">
          {profile.personal.email && <span>{profile.personal.email}</span>}
          {profile.personal.phone && <><span>·</span><span>{profile.personal.phone}</span></>}
          {profile.personal.location && <><span>·</span><span>{profile.personal.location}</span></>}
          {profile.personal.linked_in && <><span>·</span><span>{profile.personal.linked_in}</span></>}
          {profile.personal.github && <><span>·</span><span>{profile.personal.github}</span></>}
        </div>
      </div>

      <div className="space-y-4">
        {visible_sections.map((section) => {
          if (section === 'summary' && summary) {
            return (
              <section key="summary">
                <ClassicHeader label="Objective" />
                <p className="text-gray-800 leading-relaxed">{summary}</p>
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="experience">
                <ClassicHeader label="Experience" />
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold italic">{exp.title}</span>
                          {', '}
                          <span className="font-bold">{exp.company}</span>
                          {exp.location && <span className="text-gray-600"> — {exp.location}</span>}
                        </div>
                        <span className="text-gray-600 text-xs whitespace-nowrap ml-2">
                          {format_date(exp.start_date)} – {format_date(exp.end_date)}
                        </span>
                      </div>
                      <ul className="mt-1 space-y-0.5 list-disc ml-4 text-gray-700">
                        {get_bullets(exp.id, exp.bullets).map((b, i) => <li key={i}>{b}</li>)}
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
                <ClassicHeader label="Education" />
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold">{edu.institution}</span>
                          {edu.degree && (
                            <span className="text-gray-700"> — {edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
                          )}
                        </div>
                        <span className="text-gray-600 text-xs whitespace-nowrap ml-2">
                          {format_date(edu.start_date)} – {format_date(edu.end_date)}
                        </span>
                      </div>
                      {edu.gpa && <p className="text-gray-600 text-xs ml-0">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <ClassicHeader label="Skills" />
                <p className="text-gray-700">
                  {skills.map((s) => s.name).join(' · ')}
                </p>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects">
                <ClassicHeader label="Projects" />
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <span className="font-bold italic">{proj.name}</span>
                      {proj.technologies.length > 0 && (
                        <span className="text-gray-600"> ({proj.technologies.join(', ')})</span>
                      )}
                      {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
                      {get_bullets(proj.id, proj.bullets).length > 0 && (
                        <ul className="list-disc ml-4 text-gray-700 space-y-0.5 mt-0.5">
                          {get_bullets(proj.id, proj.bullets).map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'certifications' && certifications.length > 0) {
            return (
              <section key="certifications">
                <ClassicHeader label="Certifications" />
                <div className="space-y-1">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span><span className="font-bold">{cert.name}</span> — {cert.issuer}</span>
                      <span className="text-gray-600 text-xs">{format_date(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'languages' && languages.length > 0) {
            return (
              <section key="languages">
                <ClassicHeader label="Languages" />
                <p className="text-gray-700">
                  {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                </p>
              </section>
            )
          }

          if (section === 'custom' && custom_sections.length > 0) {
            return (
              <div key="custom" className="space-y-4">
                {custom_sections.map((sec) => (
                  <section key={sec.id}>
                    <ClassicHeader label={sec.title} />
                    <div className="space-y-2">
                      {sec.items.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between">
                            <span className="font-bold">{item.title}</span>
                            {item.date && <span className="text-gray-600 text-xs">{item.date}</span>}
                          </div>
                          {item.subtitle && <p className="italic text-gray-600">{item.subtitle}</p>}
                          {item.bullets.length > 0 && (
                            <ul className="list-disc ml-4 text-gray-700 space-y-0.5 mt-0.5">
                              {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          )}
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

function ClassicHeader({ label }: { label: string }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">
      {label}
    </h2>
  )
}
