# Resume Builder

A desktop application for building and managing professional resumes. Maintains a single master profile of all career data to allow customization for the specific job of choice. You can choose which jobs, skills, projects, and bullet points to include. It has a live preview and multiple template options.

## Features

- **Master profile** — store all work experience, education, skills, projects, certifications, and languages in one place
- **Multiple resumes** — create separate resumes for different roles or applications, each with its own included items and overrides
- **Per-bullet control** — include or exclude individual bullet points per resume without touching the master data
- **Live preview** — see changes reflected instantly as you edit
- **4 templates** — Modern, Classic, Minimal, and Technical, each with configurable accent color and font size
- **PDF export** — exports the rendered resume at exact paper dimensions (US Letter or A4)
- **Local only** — all data is stored on your machine; no accounts or cloud sync

## Tech Stack

- **Electron** — desktop shell
- **React + TypeScript** — UI
- **Tailwind CSS** — styling
- **Zustand** — state management
- **Vite / electron-vite** — build tooling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)

### Install

```bash
git clone <repo-url>
cd resume-builder
pnpm install
```

> **Note:** Electron's binary sometimes does not download automatically. If you see an `Electron uninstall` error on first run, execute:
> ```bash
> node node_modules/electron/install.js
> ```

### Run in development

```bash
pnpm dev
```

### Build for production

```bash
pnpm build        # compile only
pnpm build:mac    # package .dmg
pnpm build:win    # package .exe
pnpm build:linux  # package .AppImage
```

## Project Structure

```
resume-builder/
├── electron/
│   ├── main.ts       # Main process: window, IPC handlers, JSON store, PDF export
│   └── preload.ts    # Context bridge — exposes window.api to the renderer
├── src/
│   ├── types/
│   │   └── resume.ts         # All shared TypeScript interfaces
│   ├── store/
│   │   ├── profileStore.ts   # Master profile state (Zustand + disk persistence)
│   │   └── resumeStore.ts    # Resume composition state
│   ├── templates/
│   │   ├── Modern.tsx        # Two-column accent header layout
│   │   ├── Classic.tsx       # Traditional single-column serif layout
│   │   ├── Minimal.tsx       # Clean whitespace layout
│   │   ├── Technical.tsx     # Sidebar skills layout for engineering roles
│   │   ├── useResumeData.ts  # Merges profile + resume into a renderable object
│   │   └── index.ts          # Template registry
│   ├── components/
│   │   ├── editor/           # Section editors and resume composer
│   │   ├── preview/          # Live preview pane with zoom and export
│   │   └── ui/               # Shared primitives (Input, Button, Select, etc.)
│   ├── lib/
│   │   ├── exportPdf.ts      # Captures rendered HTML and sends to main for PDF generation
│   │   └── sampleData.ts     # Pre-populated sample profile loaded on first launch
│   └── App.tsx               # Root layout and initialization
└── electron.vite.config.ts
```

## Data Model

All career data lives in the **Master Profile** and is never deleted — only referenced or excluded by individual resumes. A **Resume Document** stores only:

- Which profile items are included (arrays of IDs)
- Per-item bullet overrides (a filtered bullet list stored alongside the master)
- Section order and visibility
- Template selection and config (accent color, font size, paper size)

This means editing a bullet for one resume never affects other resumes or the master profile.
