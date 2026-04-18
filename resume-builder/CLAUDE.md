# Resume Builder — Desktop Application

## Project Overview

A desktop application for building professional resumes. Users maintain a persistent profile of all career data (experience, skills, education, etc.) and dynamically compose new resumes from that data with a live preview and multiple template options.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Desktop shell | **Electron** | Cross-platform, broad ecosystem |
| Frontend framework | **React + TypeScript** | Component model maps well to resume sections |
| Styling | **Tailwind CSS** | Utility-first, easy to theme multiple templates |
| State management | **Zustand** | Lightweight, no boilerplate |
| Local persistence | **electron-store** (JSON) | Zero-config, wraps the OS data directory |
| PDF export | **@react-pdf/renderer** | Render the same React components to PDF |
| Build | **Vite + electron-vite** | Fast HMR, first-class Electron support |
| Package manager | **pnpm** |  |

---

## Application Architecture

```
resume-builder/
├── electron/
│   ├── main.ts          # Main process: window creation, IPC handlers, file I/O
│   └── preload.ts       # Context bridge — exposes safe IPC to renderer
├── src/
│   ├── main.tsx         # React entry point
│   ├── App.tsx          # Root layout: sidebar | editor | preview
│   ├── store/
│   │   ├── profileStore.ts    # All saved career data (the "master profile")
│   │   └── resumeStore.ts     # Active resume composition state
│   ├── components/
│   │   ├── editor/            # Section editors (experience, skills, etc.)
│   │   ├── preview/           # Live preview pane (renders chosen template)
│   │   ├── templates/         # One component per resume template
│   │   └── ui/                # Shared primitives (Button, Input, Modal, etc.)
│   ├── templates/
│   │   ├── index.ts           # Template registry
│   │   ├── Modern.tsx
│   │   ├── Classic.tsx
│   │   ├── Minimal.tsx
│   │   └── Technical.tsx
│   └── types/
│       └── resume.ts          # All shared TypeScript interfaces
├── CLAUDE.md
├── package.json
└── electron-vite.config.ts
```

---

## Data Model

All types live in `src/types/resume.ts`.

### Master Profile (persisted, additive)

The master profile is the source of truth for all career data. Nothing is ever deleted from it — items are only hidden/excluded from a specific resume.

```ts
interface MasterProfile {
  personal: PersonalInfo;
  experiences: WorkExperience[];   // All jobs ever entered
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  volunteerWork: VolunteerWork[];
  customSections: CustomSection[]; // User-defined freeform sections
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  website: string;
  summary: string;   // Default summary/objective (overridable per resume)
}

interface WorkExperience {
  id: string;          // uuid
  company: string;
  title: string;
  location: string;
  startDate: string;   // ISO date string (YYYY-MM)
  endDate: string | null;  // null = "Present"
  bullets: string[];   // Each bullet point as a separate string
  tags: string[];      // e.g. ["frontend", "leadership"] — used for smart filtering
}

interface Skill {
  id: string;
  name: string;
  category: string;    // e.g. "Languages", "Frameworks", "Tools"
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa: string;
  highlights: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string | null;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string | null;
  credentialId: string;
  url: string;
}

interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  bullets: string[];
}
```

### Resume Composition (per resume)

A resume does not duplicate profile data — it only references IDs and overrides.

```ts
interface ResumeDocument {
  id: string;
  name: string;             // e.g. "Senior Frontend Engineer @ Stripe"
  templateId: string;       // References template registry key
  targetRole: string;       // For context/filtering hints
  createdAt: string;
  updatedAt: string;

  // Overrides (optional — falls back to master profile values)
  summaryOverride: string | null;

  // Inclusion lists — only these IDs appear in the resume
  includedExperiences: string[];
  includedEducation: string[];
  includedSkills: string[];
  includedProjects: string[];
  includedCertifications: string[];
  includedLanguages: string[];
  includedCustomSections: string[];

  // Per-item bullet overrides (resume-specific edits without touching master data)
  bulletOverrides: Record<string, string[]>;  // key: experienceId or projectId

  // Section order and visibility
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];

  // Template-specific config (fonts, colors, spacing)
  templateConfig: Record<string, unknown>;
}

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom';
```

---

## Features

### Profile Management
- Add, edit, and delete entries for every resume section
- Tags on work experience enable smart filtering (e.g. "show only backend-tagged jobs")
- Master profile is never destructively edited when creating a resume-specific override

### Resume Composer
- Create multiple named resumes (e.g. one per job application)
- Checkboxes to include/exclude any item from the master profile
- Drag-and-drop reordering of sections and items within a section
- Per-resume bullet overrides (edit a bullet for this resume without changing master data)
- Summary/objective override per resume

### Live Preview
- Side-by-side editor and preview pane
- Preview re-renders in real time as edits are made (debounced ~150 ms)
- Zoom controls on the preview pane
- Preview shows exact output at A4 / Letter paper dimensions

### Templates
Each template is a React component that accepts a `ResumeDocument` + `MasterProfile` and renders the resume. Templates are registered in `src/templates/index.ts`.

| ID | Name | Style |
|---|---|---|
| `modern` | Modern | Two-column, accent color header |
| `classic` | Classic | Traditional single-column, serif |
| `minimal` | Minimal | Clean whitespace, sans-serif |
| `technical` | Technical | Skills-first, dense layout for engineering roles |

Template config (colors, fonts) is stored in `ResumeDocument.templateConfig` and exposed via a settings panel in the UI.

### Export
- **PDF** — via `@react-pdf/renderer`; same template components render to PDF
- **DOCX** — via `docx` npm package (basic formatting)
- **JSON** — raw resume document for backup/import

---

## State Management

### `profileStore` (Zustand + electron-store persistence)
Holds the `MasterProfile`. All mutations go through this store. The store persists to the OS app-data directory via `electron-store` using Electron IPC.

```ts
// Actions
addExperience(exp: Omit<WorkExperience, 'id'>): void
updateExperience(id: string, patch: Partial<WorkExperience>): void
removeExperience(id: string): void
// ... same pattern for all section types
```

### `resumeStore` (Zustand + electron-store persistence)
Holds the list of `ResumeDocument` objects and tracks which one is active.

```ts
// Actions
createResume(name: string, templateId: string): ResumeDocument
duplicateResume(id: string): ResumeDocument
deleteResume(id: string): void
setActiveResume(id: string): void
updateResume(id: string, patch: Partial<ResumeDocument>): void
toggleIncluded(resumeId: string, section: SectionKey, itemId: string): void
setBulletOverride(resumeId: string, itemId: string, bullets: string[]): void
reorderSections(resumeId: string, newOrder: SectionKey[]): void
```

---

## IPC Channels (Electron)

| Channel | Direction | Purpose |
|---|---|---|
| `store:get` | renderer → main | Read from electron-store |
| `store:set` | renderer → main | Write to electron-store |
| `export:pdf` | renderer → main | Trigger PDF save dialog |
| `export:docx` | renderer → main | Trigger DOCX save dialog |
| `export:json` | renderer → main | Trigger JSON save dialog |
| `import:json` | renderer → main | Open file picker, import resume JSON |

All IPC is bridged through the preload script. The renderer never calls `ipcRenderer` directly.

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Resume Builder]   [resume name ▾]   [New] [Duplicate] [Export]│  ← Titlebar
├─────────────┬───────────────────────────┬───────────────────────┤
│             │                           │                       │
│  SIDEBAR    │   EDITOR                  │   LIVE PREVIEW        │
│             │                           │                       │
│ • Profile   │  [Section tabs]           │  [Template picker]    │
│ • Resumes   │                           │  [Zoom ±]             │
│             │  Form fields for active   │                       │
│             │  section, with checkboxes │  ┌─────────────────┐  │
│             │  to include/exclude items │  │                 │  │
│             │  from the master profile  │  │  Resume render  │  │
│             │                           │  │  (A4 / Letter)  │  │
│             │                           │  │                 │  │
│             │                           │  └─────────────────┘  │
└─────────────┴───────────────────────────┴───────────────────────┘
```

---

## Development Notes

- **No external API calls.** All data is local. No accounts, no cloud sync.
- **IDs** are generated with `crypto.randomUUID()` — no uuid library needed.
- **Dates** are stored as `MM-YYYY` strings for simple display formatting.
- **Accessibility:** all interactive elements need `aria-label`s; keyboard navigation must work through the editor.
- **Template components** must be pure/deterministic — same inputs always produce the same output. No side effects inside template render functions.
- **PDF export** uses a separate render pass with `@react-pdf/renderer`; the preview pane uses the HTML/CSS version of the same template.
- Keep template logic in `src/templates/`. Never put template-specific layout in shared editor components.
- `electron-store` keys: `profile` (MasterProfile), `resumes` (ResumeDocument[]), `activeResumeId` (string).
- variables to have snake case naming convention

---

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start app with HMR
pnpm build            # Build for production
pnpm build:mac        # Package .dmg
pnpm build:win        # Package .exe
pnpm build:linux      # Package .AppImage
pnpm typecheck        # Run tsc --noEmit
pnpm lint             # ESLint
```
