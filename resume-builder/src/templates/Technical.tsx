import type { TemplateProps } from './index'
import { format_date } from '@/types/resume'

export function TechnicalTemplate({ data }: TemplateProps) {
  const { resume, profile, summary, experiences, education, skills, projects,
          certifications, languages, custom_sections, visible_sections, get_bullets } = data
  const { accent_color, font_size } = resume.template_config
  const font_class = font_size === 'sm' ? 'text-[10.5px]' : font_size === 'lg' ? 'text-[12.5px]' : 'text-[11.5px]'


  return (
    <div className={`w-full h-full bg-white ${font_class} font-mono`} style={{ color: '#0f172a' }}>
      {/* Left sidebar + main content in two-col layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[38%] min-h-full px-6 pt-8 pb-8 space-y-5" style={{ backgroundColor: `${accent_color}18` }}>
          {/* Name block */}
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: accent_color }}>
              {profile.personal.full_name || 'Your Name'}
            </h1>
            {resume.target_role && (
              <p className="text-xs text-gray-500 mt-0.5">{resume.target_role}</p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-1">
            <TechSideHeader label="Contact" accent={accent_color} />
            {[
              profile.personal.email,
              profile.personal.phone,
              profile.personal.location,
              profile.personal.linked_in,
              profile.personal.github,
              profile.personal.website
            ].filter(Boolean).map((val, i) => (
              <p key={i} className="text-xs text-gray-600 break-all">{val}</p>
            ))}
          </div>

          {/* Skills sidebar */}
          {skills.length > 0 && visible_sections.includes('skills') && (
            <div>
              <TechSideHeader label="Skills" accent={accent_color} />
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: `${accent_color}22`, color: accent_color }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages sidebar */}
          {languages.length > 0 && visible_sections.includes('languages') && (
            <div>
              <TechSideHeader label="Languages" accent={accent_color} />
              <div className="space-y-0.5">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-xs text-gray-600">
                    <span>{l.language}</span>
                    <span className="text-gray-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications sidebar */}
          {certifications.length > 0 && visible_sections.includes('certifications') && (
            <div>
              <TechSideHeader label="Certifications" accent={accent_color} />
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-xs font-medium text-gray-700">{cert.name}</p>
                    <p className="text-[10px] text-gray-400">{cert.issuer} · {format_date(cert.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 px-7 pt-8 pb-8 space-y-5">
          {visible_sections.map((section) => {
            if (section === 'summary' && summary) {
              return (
                <section key="summary">
                  <TechMainHeader label="Summary" accent={accent_color} />
                  <p className="text-gray-600 leading-relaxed text-xs">{summary}</p>
                </section>
              )
            }

            if (section === 'experience' && experiences.length > 0) {
              return (
                <section key="experience">
                  <TechMainHeader label="Experience" accent={accent_color} />
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{exp.title}</p>
                            <p className="text-xs" style={{ color: accent_color }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 mt-0.5 font-mono">
                            {format_date(exp.start_date)} – {format_date(exp.end_date)}
                          </span>
                        </div>
                        <ul className="mt-1 space-y-0.5 text-gray-600 text-xs">
                          {get_bullets(exp.id, exp.bullets).map((b, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span style={{ color: accent_color }} className="select-none mt-px">▸</span>
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

            if (section === 'projects' && projects.length > 0) {
              return (
                <section key="projects">
                  <TechMainHeader label="Projects" accent={accent_color} />
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id}>
                        <div className="flex justify-between items-baseline">
                          <p className="font-bold text-gray-900">{proj.name}</p>
                          {proj.url && <span className="text-[10px] text-gray-400">{proj.url}</span>}
                        </div>
                        {proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {proj.technologies.map((t, i) => (
                              <span
                                key={i}
                                className="px-1 py-px rounded text-[9px] font-mono"
                                style={{ backgroundColor: `${accent_color}15`, color: accent_color }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {proj.description && <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>}
                        {get_bullets(proj.id, proj.bullets).length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-xs text-gray-600">
                            {get_bullets(proj.id, proj.bullets).map((b, i) => (
                              <li key={i} className="flex gap-1.5">
                                <span style={{ color: accent_color }} className="select-none mt-px">▸</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            }

            if (section === 'education' && education.length > 0) {
              return (
                <section key="education">
                  <TechMainHeader label="Education" accent={accent_color} />
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{edu.institution}</p>
                          <p className="text-xs text-gray-500">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                          {edu.gpa && <p className="text-[10px] text-gray-400">GPA {edu.gpa}</p>}
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 font-mono mt-0.5">
                          {format_date(edu.start_date)} – {format_date(edu.end_date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )
            }

            if (section === 'custom' && custom_sections.length > 0) {
              return (
                <div key="custom" className="space-y-5">
                  {custom_sections.map((sec) => (
                    <section key={sec.id}>
                      <TechMainHeader label={sec.title} accent={accent_color} />
                      <div className="space-y-2">
                        {sec.items.map((item) => (
                          <div key={item.id}>
                            <div className="flex justify-between">
                              <p className="font-bold text-gray-900">{item.title}</p>
                              {item.date && <span className="text-[10px] text-gray-400">{item.date}</span>}
                            </div>
                            {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )
            }

            // skills/languages/certs are in sidebar — skip in main
            return null
          })}
        </div>
      </div>
    </div>
  )
}

function TechSideHeader({ label, accent }: { label: string; accent: string }) {
  return (
    <h3
      className="text-[10px] font-bold uppercase tracking-widest mb-1.5 pb-0.5 border-b"
      style={{ color: accent, borderColor: `${accent}44` }}
    >
      {label}
    </h3>
  )
}

function TechMainHeader({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1 h-4 rounded-sm" style={{ backgroundColor: accent }} />
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
        {label}
      </h2>
    </div>
  )
}
