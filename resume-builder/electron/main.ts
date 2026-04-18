import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'

/**
 * Lightweight key-value store backed by a single JSON file in the OS user-data directory.
 * Replaces electron-store to avoid ESM/CJS compatibility issues with that package.
 * Reads the file once on construction; every write flushes the full payload synchronously.
 */
class JsonStore {
  private data: Record<string, unknown> = {}
  private file_path: string

  constructor() {
    const user_data = app.getPath('userData')
    if (!existsSync(user_data)) mkdirSync(user_data, { recursive: true })
    this.file_path = join(user_data, 'resume-builder-store.json')
    try {
      this.data = JSON.parse(readFileSync(this.file_path, 'utf-8'))
    } catch {
      this.data = {}
    }
  }

  get(key: string): unknown {
    return this.data[key] ?? null
  }

  set(key: string, value: unknown): void {
    this.data[key] = value
    writeFileSync(this.file_path, JSON.stringify(this.data), 'utf-8')
  }

  delete(key: string): void {
    delete this.data[key]
    writeFileSync(this.file_path, JSON.stringify(this.data), 'utf-8')
  }
}

const store = new JsonStore()

// ── Window ─────────────────────────────────────────────────────────────────────

/** Creates the main application window and loads the renderer (dev server or built file). */
function createWindow(): void {
  const preload_path = join(__dirname, '../preload/index.js')
  console.log('[main] preload path:', preload_path)
  console.log('[main] preload exists:', existsSync(preload_path))

  const main_window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: preload_path,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  })

  main_window.once('ready-to-show', () => main_window.show())

  if (process.env['ELECTRON_RENDERER_URL']) {
    main_window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    main_window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ── Store IPC ──────────────────────────────────────────────────────────────────

ipcMain.handle('store:get', (_event, key: string) => store.get(key))

ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
  store.set(key, value)
})

ipcMain.handle('store:delete', (_event, key: string) => {
  store.delete(key)
})

// ── Export IPC ─────────────────────────────────────────────────────────────────

/**
 * Renders an HTML string to PDF via a hidden BrowserWindow.
 * Writes HTML to a temp file, loads it, waits for layout to settle,
 * then calls printToPDF and saves to a user-chosen path.
 */
ipcMain.handle(
  'export:pdf',
  async (_event, html: string, default_name: string, paper_size: 'letter' | 'a4') => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: `${default_name}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })
    if (canceled || !filePath) return { success: false }

    const tmp_path = join(tmpdir(), `resume-print-${Date.now()}.html`)
    writeFileSync(tmp_path, html, 'utf-8')

    const print_window = new BrowserWindow({
      width: paper_size === 'a4' ? 794 : 816,
      height: paper_size === 'a4' ? 1123 : 1056,
      show: false,
      webPreferences: { sandbox: true }
    })

    try {
      await print_window.loadFile(tmp_path)
      await new Promise<void>((resolve) => {
        print_window.webContents.once('did-finish-load', () => setTimeout(resolve, 500))
        setTimeout(resolve, 1500)
      })

      const pdf_data = await print_window.webContents.printToPDF({
        pageSize: paper_size === 'a4' ? 'A4' : 'Letter',
        printBackground: true,
        margins: { marginType: 'noMargins' }
      })

      writeFileSync(filePath, pdf_data)
      shell.showItemInFolder(filePath)
      return { success: true, filePath }
    } catch (err) {
      console.error('[export:pdf] error:', err)
      return { success: false, error: String(err) }
    } finally {
      print_window.destroy()
      try { unlinkSync(tmp_path) } catch { /* ignore */ }
    }
  }
)

ipcMain.handle('export:json', async (_event, json_string: string, default_name: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: `${default_name}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (canceled || !filePath) return { success: false }
  writeFileSync(filePath, json_string, 'utf-8')
  shell.showItemInFolder(filePath)
  return { success: true, filePath }
})

ipcMain.handle('import:json', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  })
  if (canceled || filePaths.length === 0) return { success: false }
  const content = readFileSync(filePaths[0], 'utf-8')
  return { success: true, content }
})

// ── App lifecycle ──────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
