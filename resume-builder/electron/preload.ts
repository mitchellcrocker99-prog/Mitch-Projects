/**
 * Preload script — runs in a privileged context before the renderer loads.
 * Exposes a typed `window.api` bridge via contextBridge so the renderer can
 * invoke IPC channels without direct access to Node or Electron internals.
 */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key)
  },
  export: {
    pdf: (html: string, default_name: string, paper_size: 'letter' | 'a4') =>
      ipcRenderer.invoke('export:pdf', html, default_name, paper_size),
    json: (json_string: string, default_name: string) =>
      ipcRenderer.invoke('export:json', json_string, default_name)
  },
  import: {
    json: () => ipcRenderer.invoke('import:json')
  }
})
