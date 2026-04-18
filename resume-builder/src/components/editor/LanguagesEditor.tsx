import { useProfileStore } from '@/store/profileStore'
import { Input, Select, Button, SectionCard } from '@/components/ui'
import type { Language, LanguageProficiency } from '@/types/resume'

const PROFICIENCIES: LanguageProficiency[] = ['basic', 'conversational', 'professional', 'native']

export function LanguagesEditor() {
  const languages = useProfileStore((s) => s.profile.languages)
  const add_language = useProfileStore((s) => s.add_language)
  const update_language = useProfileStore((s) => s.update_language)
  const remove_language = useProfileStore((s) => s.remove_language)

  const EMPTY_LANG: Omit<Language, 'id'> = { language: '', proficiency: 'professional' }

  return (
    <div className="space-y-2">
      {languages.map((lang) => (
        <SectionCard key={lang.id} className="py-2">
          <div className="flex gap-2 items-center">
            <Input
              value={lang.language}
              placeholder="Language name"
              className="flex-1"
              onChange={(e) => update_language(lang.id, { language: e.target.value })}
            />
            <Select
              value={lang.proficiency}
              className="w-40"
              onChange={(e) =>
                update_language(lang.id, { proficiency: e.target.value as LanguageProficiency })
              }
            >
              {PROFICIENCIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Button
              variant="danger"
              size="sm"
              onClick={() => remove_language(lang.id)}
              aria-label="Remove language"
            >
              ×
            </Button>
          </div>
        </SectionCard>
      ))}

      <Button variant="outline" onClick={() => add_language(EMPTY_LANG)} className="w-full">
        + Add Language
      </Button>
    </div>
  )
}
