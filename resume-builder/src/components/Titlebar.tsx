import { useResumeStore } from '@/store/resumeStore'
import { Button } from '@/components/ui'

export function Titlebar() {
  const active_resume = useResumeStore((s) => s.active_resume())

  const handle_export_json = async () => {
    if (!active_resume || !window.api) return
    const json_string = JSON.stringify(active_resume, null, 2)
    const safe_name = active_resume.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    await window.api.export.json(json_string, safe_name)
  }

  return (
    <header
      className="h-10 flex items-center px-4 gap-3 border-b border-slate-700 bg-slate-900 shrink-0"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* macOS traffic lights occupy ~72px on left, spacer covers that */}
      <div className="w-16 shrink-0" />

      <span className="text-xs text-slate-500 font-medium">
        {active_resume ? active_resume.name : 'Resume Builder'}
      </span>

      <div className="flex-1" />

      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {active_resume && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handle_export_json}
            aria-label="Export resume as JSON"
          >
            Export JSON
          </Button>
        )}
      </div>
    </header>
  )
}
