/// <reference types="vite/client" />

interface Window {
  api: {
    store: {
      get: (key: string) => Promise<unknown>
      set: (key: string, value: unknown) => Promise<void>
      delete: (key: string) => Promise<void>
    }
    export: {
      pdf: (html: string, default_name: string, paper_size: 'letter' | 'a4') => Promise<{ success: boolean; filePath?: string; error?: string }>
      json: (json_string: string, default_name: string) => Promise<{ success: boolean; filePath?: string }>
    }
    import: {
      json: () => Promise<{ success: boolean; content?: string }>
    }
  }
}
