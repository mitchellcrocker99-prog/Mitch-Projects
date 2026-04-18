import { useProfileStore } from '@/store/profileStore'
import { Input, Textarea, FormField } from '@/components/ui'

export function PersonalEditor() {
  const personal = useProfileStore((s) => s.profile.personal)
  const update_personal = useProfileStore((s) => s.update_personal)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Full Name">
          <Input
            value={personal.full_name}
            placeholder="Jane Smith"
            onChange={(e) => update_personal({ full_name: e.target.value })}
          />
        </FormField>
        <FormField label="Email">
          <Input
            value={personal.email}
            placeholder="jane@example.com"
            onChange={(e) => update_personal({ email: e.target.value })}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phone">
          <Input
            value={personal.phone}
            placeholder="+1 (555) 000-0000"
            onChange={(e) => update_personal({ phone: e.target.value })}
          />
        </FormField>
        <FormField label="Location">
          <Input
            value={personal.location}
            placeholder="San Francisco, CA"
            onChange={(e) => update_personal({ location: e.target.value })}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <FormField label="LinkedIn">
          <Input
            value={personal.linked_in}
            placeholder="linkedin.com/in/jane"
            onChange={(e) => update_personal({ linked_in: e.target.value })}
          />
        </FormField>
        <FormField label="GitHub">
          <Input
            value={personal.github}
            placeholder="github.com/jane"
            onChange={(e) => update_personal({ github: e.target.value })}
          />
        </FormField>
        <FormField label="Website">
          <Input
            value={personal.website}
            placeholder="janesmith.dev"
            onChange={(e) => update_personal({ website: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Summary / Objective">
        <Textarea
          rows={4}
          value={personal.summary}
          placeholder="Brief summary of your professional background and goals..."
          onChange={(e) => update_personal({ summary: e.target.value })}
        />
      </FormField>
    </div>
  )
}
