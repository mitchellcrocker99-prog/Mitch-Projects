import type { TemplateProps } from './index'
import { format_date } from '@/types/resume'

export function ModernTemplate({ data }: TemplateProps) {
  const { resume, profile, summary, experiences, education, skills, projects,
          certifications, languages, custom_sections, visible_sections, get_bullets } = data
  const { accent_color, font_size } = resume.template_config

  const font_class = font_size === 'sm' ? 'text-[11px]' : font_size === 'lg' ? 'text-[13px]' : 'text-[12px]'

  return (
    <div className={`w-full h-full bg-white ${font_class} font-sans`} style={{ color: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-10 pt-8 pb-6" style={{ backgroundColor: accent_color }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {profile.personal.full_name || 'Your Name'}
        </h1>
        {resume.target_role && (
          <p className="text-white/80 mt-1 text-sm font-medium">{resume.target_role}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-white/90 text-xs">
          {profile.personal.email && <span>{profile.personal.email}</span>}
          {profile.personal.phone && <span>{profile.personal.phone}</span>}
          {profile.personal.location && <span>{profile.personal.location}</span>}
          {profile.personal.linked_in && <span>{profile.personal.linked_in}</span>}
          {profile.personal.github && <span>{profile.personal.github}</span>}
          {profile.personal.website && <span>{profile.personal.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-6 space-y-5">
        {visible_sections.map((section) => {
          if (section === 'summary' && summary) {
            return (
              <section key="summary">
                <SectionHeader label="Summary" accent={accent_color} />
                <p className="text-gray-700 leading-relaxed mt-1">{summary}</p>
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="experience">
                <SectionHeader label="Experience" accent={accent_color} />
                <div className="space-y-4 mt-1">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-semibold">{exp.title}</span>
                          <span className="text-gray-500"> · {exp.company}</span>
                          {exp.location && <span className="text-gray-400"> · {exp.location}</span>}
                        </div>
                        <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                          {format_date(exp.start_date)} – {format_date(exp.end_date)}
                        </span>
                      </div>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside text-gray-600">
                        {get_bullets(exp.id, exp.bullets).map((b, i) => (
                          <li key={i}>{b}</li>
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
                <SectionHeader label="Education" accent={accent_color} />
                <div className="space-y-3 mt-1">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-semibold">{edu.institution}</span>
                          <span className="text-gray-500"> · {edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
                        </div>
                        <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                          {format_date(edu.start_date)} – {format_date(edu.end_date)}
                        </span>
                      </div>
                      {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                      {edu.highlights.length > 0 && (
                        <ul className="mt-1 list-disc list-inside text-gray-600 space-y-0.5">
                          {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <SectionHeader label="Skills" accent={accent_color} />
                <p className="text-gray-600 mt-1 leading-relaxed">
                  {skills.map((s) => s.name).join(' · ')}
                </p>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects">
                <SectionHeader label="Projects" accent={accent_color} />
                <div className="space-y-3 mt-1">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold">{proj.name}</span>
                        {proj.url && (
                          <span className="text-xs text-gray-400">{proj.url}</span>
                        )}
                      </div>
                      {proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-400">{proj.technologies.join(', ')}</p>
                      )}
                      {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
                      {get_bullets(proj.id, proj.bullets).length > 0 && (
                        <ul className="mt-1 list-disc list-inside text-gray-600 space-y-0.5">
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
                <SectionHeader label="Certifications" accent={accent_color} />
                <div className="space-y-1 mt-1">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span>
                        <span className="font-semibold">{cert.name}</span>
                        <span className="text-gray-500"> · {cert.issuer}</span>
                      </span>
                      <span className="text-gray-400 text-xs">{format_date(cert.date)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'languages' && languages.length > 0) {
            return (
              <section key="languages">
                <SectionHeader label="Languages" accent={accent_color} />
                <div className="flex flex-wrap gap-x-4 mt-1">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-gray-600">
                      <span className="font-semibold">{lang.language}</span>
                      <span className="text-gray-400"> ({lang.proficiency})</span>
                    </span>
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
                    <SectionHeader label={sec.title} accent={accent_color} />
                    <div className="space-y-2 mt-1">
                      {sec.items.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold">{item.title}</span>
                            {item.date && <span className="text-gray-400 text-xs">{item.date}</span>}
                          </div>
                          {item.subtitle && <p className="text-gray-500">{item.subtitle}</p>}
                          {item.bullets.length > 0 && (
                            <ul className="mt-0.5 list-disc list-inside text-gray-600 space-y-0.5">
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

function SectionHeader({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: accent }}>
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: accent, opacity: 0.3 }} />
    </div>
  )
}
