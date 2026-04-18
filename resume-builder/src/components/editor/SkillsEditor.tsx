import { useProfileStore } from '@/store/profileStore'
import { Input, Button } from '@/components/ui'

export function SkillsEditor() {
  const skills = useProfileStore((s) => s.profile.skills)
  const add_skill = useProfileStore((s) => s.add_skill)
  const update_skill = useProfileStore((s) => s.update_skill)
  const remove_skill = useProfileStore((s) => s.remove_skill)

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add_skill({ name: '' })
    }
    if (e.key === 'Backspace' && skills[index].name === '' && skills.length > 1) {
      e.preventDefault()
      remove_skill(skills[index].id)
    }
  }

  return (
    <div className="space-y-1.5">
      {skills.map((skill, index) => (
        <div key={skill.id} className="flex items-center gap-1.5">
          <span className="text-slate-500 text-xs select-none w-3">•</span>
          <Input
            value={skill.name}
            placeholder="Skill name"
            onChange={(e) => update_skill(skill.id, { name: e.target.value })}
            onKeyDown={(e) => handle_key_down(e, index)}
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => remove_skill(skill.id)}
            aria-label="Remove skill"
            className="shrink-0"
          >
            ×
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={() => add_skill({ name: '' })}>
        + Add skill
      </Button>
    </div>
  )
}
