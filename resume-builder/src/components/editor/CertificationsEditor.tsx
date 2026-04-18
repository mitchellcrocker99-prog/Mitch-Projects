import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Input, Button, FormField, SectionCard, Divider } from '@/components/ui'
import type { Certification } from '@/types/resume'

const EMPTY_CERT: Omit<Certification, 'id'> = {
  name: '',
  issuer: '',
  date: '',
  expiry_date: null,
  credential_id: '',
  url: ''
}

export function CertificationsEditor() {
  const certifications = useProfileStore((s) => s.profile.certifications)
  const add_certification = useProfileStore((s) => s.add_certification)
  const update_certification = useProfileStore((s) => s.update_certification)
  const remove_certification = useProfileStore((s) => s.remove_certification)
  const [expanded, set_expanded] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {certifications.map((cert) => (
        <SectionCard key={cert.id}>
          <div
            className="flex justify-between items-start cursor-pointer"
            onClick={() => set_expanded(expanded === cert.id ? null : cert.id)}
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {cert.name || <span className="text-slate-500 italic">Certification Name</span>}
              </p>
              <p className="text-xs text-slate-400">{cert.issuer || 'Issuer'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => { e.stopPropagation(); remove_certification(cert.id) }}
                aria-label="Remove certification"
              >
                ×
              </Button>
              <span className="text-slate-500 text-xs">{expanded === cert.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === cert.id && (
            <>
              <Divider />
              <div className="space-y-3">
                <FormField label="Certification Name">
                  <Input
                    value={cert.name}
                    onChange={(e) => update_certification(cert.id, { name: e.target.value })}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Issuing Organization">
                    <Input
                      value={cert.issuer}
                      onChange={(e) => update_certification(cert.id, { issuer: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Issue Date (MM-YYYY)">
                    <Input
                      value={cert.date}
                      placeholder="06-2023"
                      onChange={(e) => update_certification(cert.id, { date: e.target.value })}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Expiry Date">
                    <Input
                      value={cert.expiry_date ?? ''}
                      placeholder="No expiry"
                      onChange={(e) =>
                        update_certification(cert.id, { expiry_date: e.target.value || null })
                      }
                    />
                  </FormField>
                  <FormField label="Credential ID">
                    <Input
                      value={cert.credential_id}
                      onChange={(e) => update_certification(cert.id, { credential_id: e.target.value })}
                    />
                  </FormField>
                </div>
                <FormField label="Verification URL">
                  <Input
                    value={cert.url}
                    placeholder="https://..."
                    onChange={(e) => update_certification(cert.id, { url: e.target.value })}
                  />
                </FormField>
              </div>
            </>
          )}
        </SectionCard>
      ))}

      <Button variant="outline" onClick={() => add_certification(EMPTY_CERT)} className="w-full">
        + Add Certification
      </Button>
    </div>
  )
}
