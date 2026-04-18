/**
 * PreviewPane — live resume preview with zoom controls, template picker, and PDF export.
 *
 * The template is rendered at full paper dimensions (816×1056 for Letter, 794×1123 for A4)
 * then scaled via CSS transform to fit the available space. A ref on the unscaled container
 * is used for PDF capture so the exported HTML reflects true paper dimensions.
 */
import { useState, useMemo, useRef } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useResumeStore } from '@/store/resumeStore'
import { TEMPLATES } from '@/templates/index'
import { resolve_resume } from '@/templates/useResumeData'
import { Button, Select } from '@/components/ui'
import { export_pdf } from '@/lib/exportPdf'
import type { TemplateId } from '@/types/resume'

// Letter = 8.5 × 11 in  → 816 × 1056px at 96dpi
// A4     = 210 × 297 mm → 794 × 1123px at 96dpi
const PAPER = {
  letter: { width: 816, height: 1056 },
  a4: { width: 794, height: 1123 }
}

const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.75, 1.0, 1.25]

export function PreviewPane() {
  const profile = useProfileStore((s) => s.profile)
  const active_resume = useResumeStore((s) => s.active_resume())
  const update_resume = useResumeStore((s) => s.update_resume)

  const [zoom_index, set_zoom_index] = useState(2)
  const [exporting, set_exporting] = useState(false)
  const [export_error, set_export_error] = useState<string | null>(null)
  const zoom = ZOOM_STEPS[zoom_index]

  // Ref on the unscaled template container — what we capture for PDF
  const template_ref = useRef<HTMLDivElement>(null)

  const data = useMemo(() => {
    if (!active_resume) return null
    return resolve_resume(active_resume, profile)
  }, [active_resume, profile])

  const handle_export_pdf = async () => {
    if (!active_resume || !template_ref.current) return
    set_exporting(true)
    set_export_error(null)
    try {
      const result = await export_pdf(
        template_ref.current,
        active_resume.name,
        active_resume.template_config.paper_size
      )
      if (!result.success && result.error) {
        set_export_error(result.error)
      }
    } catch (err) {
      set_export_error(String(err))
    } finally {
      set_exporting(false)
    }
  }

  if (!active_resume || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p className="text-sm">No resume selected</p>
        <p className="text-xs mt-1">Create a resume to see the preview</p>
      </div>
    )
  }

  const paper = PAPER[active_resume.template_config.paper_size]
  const TemplateComponent = TEMPLATES[active_resume.template_id].component

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-700 shrink-0">
        {/* Template picker */}
        <Select
          value={active_resume.template_id}
          className="w-36 text-xs"
          onChange={(e) => update_resume(active_resume.id, { template_id: e.target.value as TemplateId })}
          aria-label="Select template"
        >
          {Object.entries(TEMPLATES).map(([id, { label }]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </Select>

        <div className="flex-1" />

        {/* Zoom controls */}
        <span className="text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => set_zoom_index((i) => Math.max(0, i - 1))}
          disabled={zoom_index === 0}
          aria-label="Zoom out"
        >
          −
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => set_zoom_index((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
          disabled={zoom_index === ZOOM_STEPS.length - 1}
          aria-label="Zoom in"
        >
          +
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => set_zoom_index(2)}
          aria-label="Reset zoom"
        >
          Reset
        </Button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        {/* Export PDF */}
        <Button
          variant="primary"
          size="sm"
          onClick={handle_export_pdf}
          disabled={exporting}
          aria-label="Export as PDF"
        >
          {exporting ? 'Exporting…' : 'Export PDF'}
        </Button>
      </div>

      {/* Export error banner */}
      {export_error && (
        <div className="flex items-center justify-between px-4 py-2 bg-red-900/40 border-b border-red-700 text-xs text-red-300 shrink-0">
          <span>Export failed: {export_error}</span>
          <button
            onClick={() => set_export_error(null)}
            className="ml-4 text-red-400 hover:text-red-200"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Preview scroll area */}
      <div className="flex-1 overflow-auto bg-slate-950 flex justify-center pt-6 pb-10">
        <div
          style={{
            width: paper.width * zoom,
            height: paper.height * zoom,
            flexShrink: 0
          }}
        >
          {/* Unscaled container — ref target for PDF capture */}
          <div
            ref={template_ref}
            style={{
              width: paper.width,
              height: paper.height,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              boxShadow: '0 4px 32px rgba(0,0,0,0.5)'
            }}
          >
            <TemplateComponent data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
