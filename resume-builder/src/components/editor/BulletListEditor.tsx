/**
 * Reusable bullet-point list editor.
 * - Enter on any row inserts a new bullet immediately below.
 * - Backspace on an empty row removes it (when more than one bullet exists).
 */
import { Input, Button } from '@/components/ui'

interface Props {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
}

export function BulletListEditor({ bullets, onChange, placeholder = 'Add bullet point...' }: Props) {
  const add_bullet = () => onChange([...bullets, ''])

  const update_bullet = (index: number, value: string) => {
    const next = [...bullets]
    next[index] = value
    onChange(next)
  }

  const remove_bullet = (index: number) => {
    onChange(bullets.filter((_, i) => i !== index))
  }

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const next = [...bullets]
      next.splice(index + 1, 0, '')
      onChange(next)
      // Focus will naturally move to new input on next render
    }
    if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      remove_bullet(index)
    }
  }

  return (
    <div className="space-y-1.5">
      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span className="text-slate-500 text-xs select-none w-3">•</span>
          <Input
            value={bullet}
            placeholder={placeholder}
            onChange={(e) => update_bullet(index, e.target.value)}
            onKeyDown={(e) => handle_key_down(e, index)}
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => remove_bullet(index)}
            aria-label="Remove bullet"
            className="shrink-0"
          >
            ×
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={add_bullet}>
        + Add bullet
      </Button>
    </div>
  )
}
