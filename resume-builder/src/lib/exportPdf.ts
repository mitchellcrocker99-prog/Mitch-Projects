/**
 * Captures the rendered resume from the DOM and sends it to the main process
 * for PDF generation via Electron's printToPDF.
 *
 * Strategy: collect all <style> tags injected by Vite/Tailwind at runtime and
 * bundle them into a standalone HTML document. The main process loads this document
 * in a hidden BrowserWindow at exact paper dimensions, then calls printToPDF.
 */
export async function export_pdf(
  element: HTMLElement,
  resume_name: string,
  paper_size: 'letter' | 'a4'
): Promise<{ success: boolean; error?: string }> {
  if (!window.api) {
    console.error('[export_pdf] window.api is not defined — preload may not have loaded')
    return { success: false, error: 'API bridge unavailable. Please restart the app.' }
  }

  const style_blocks = Array.from(document.querySelectorAll('style'))
    .map((s) => s.outerHTML)
    .join('\n')

  // Prod builds load CSS via <link> tags rather than injected <style> blocks
  const link_tags = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  )
    .map((l) => `<link rel="stylesheet" href="${l.href}">`)
    .join('\n')

  const paper_css =
    paper_size === 'a4'
      ? 'width:794px;height:1123px;'
      : 'width:816px;height:1056px;'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${link_tags}
  ${style_blocks}
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; ${paper_css} overflow: hidden; }
    @page { size: ${paper_size === 'a4' ? 'A4' : 'letter'}; margin: 0; }
  </style>
</head>
<body>
  <div style="${paper_css} overflow:hidden;">
    ${element.innerHTML}
  </div>
</body>
</html>`

  const safe_name = resume_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  console.log('[export_pdf] sending to main process, html length:', html.length)

  try {
    const result = await window.api.export.pdf(html, safe_name, paper_size)
    console.log('[export_pdf] result:', result)
    return result
  } catch (err) {
    console.error('[export_pdf] IPC error:', err)
    return { success: false, error: String(err) }
  }
}
