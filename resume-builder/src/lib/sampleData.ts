/**
 * Sample profile and resume used to pre-populate the app on first launch.
 * IDs are fixed strings (not random UUIDs) so seeding is always idempotent —
 * running it twice does not create duplicate entries.
 */
import type { MasterProfile, ResumeDocument } from '@/types/resume'
import { DEFAULT_TEMPLATE_CONFIG, DEFAULT_SECTION_ORDER } from '@/types/resume'

const IDS = {
  exp1: 'sample-exp-001', exp2: 'sample-exp-002', exp3: 'sample-exp-003',
  edu1: 'sample-edu-001', edu2: 'sample-edu-002',
  sk1: 'sample-sk-001', sk2: 'sample-sk-002', sk3: 'sample-sk-003',
  sk4: 'sample-sk-004', sk5: 'sample-sk-005', sk6: 'sample-sk-006',
  sk7: 'sample-sk-007', sk8: 'sample-sk-008', sk9: 'sample-sk-009',
  sk10: 'sample-sk-010', sk11: 'sample-sk-011', sk12: 'sample-sk-012',
  proj1: 'sample-proj-001', proj2: 'sample-proj-002',
  cert1: 'sample-cert-001', cert2: 'sample-cert-002',
  lang1: 'sample-lang-001', lang2: 'sample-lang-002',
  resume1: 'sample-resume-001'
}

export const SAMPLE_PROFILE: MasterProfile = {
  personal: {
    full_name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    phone: '(555) 234-5678',
    location: 'San Francisco, CA',
    linked_in: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    website: 'alexrivera.dev',
    summary:
      'Full-stack software engineer with 6+ years of experience building scalable web applications and developer tooling. Passionate about clean architecture, performance, and shipping products that users love.'
  },
  experiences: [
    {
      id: IDS.exp1,
      company: 'Stripe',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start_date: '03-2022',
      end_date: null,
      bullets: [
        'Led redesign of the payments dashboard, reducing page load time by 40% and increasing merchant engagement by 18%',
        'Architected a real-time webhook delivery system handling 50M+ events/day with 99.99% delivery reliability',
        'Mentored 4 junior engineers through weekly 1:1s, code reviews, and a structured onboarding program',
        'Drove adoption of TypeScript across 3 frontend services, eliminating an entire class of runtime errors'
      ],
      tags: ['frontend', 'backend', 'typescript', 'leadership']
    },
    {
      id: IDS.exp2,
      company: 'Figma',
      title: 'Software Engineer II',
      location: 'San Francisco, CA',
      start_date: '06-2020',
      end_date: '02-2022',
      bullets: [
        'Built the multiplayer cursor presence system used by 4M+ daily active users using CRDTs and WebSockets',
        'Reduced plugin API bundle size by 62% through tree-shaking improvements and lazy loading',
        'Implemented accessibility improvements that brought the editor to WCAG 2.1 AA compliance',
        'Collaborated with design to ship 12 canvas performance improvements over 6 sprints'
      ],
      tags: ['frontend', 'performance', 'accessibility']
    },
    {
      id: IDS.exp3,
      company: 'Brex',
      title: 'Software Engineer',
      location: 'San Francisco, CA',
      start_date: '07-2018',
      end_date: '05-2020',
      bullets: [
        'Developed internal expense categorization ML pipeline reducing manual review by 70%',
        'Built card transaction notification system delivering 500K+ push notifications daily with sub-second latency',
        'Migrated legacy Ruby monolith services to Elixir microservices, improving throughput 3x'
      ],
      tags: ['backend', 'ml', 'elixir']
    }
  ],
  education: [
    {
      id: IDS.edu1,
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '08-2014',
      end_date: '05-2018',
      gpa: '3.82 / 4.0',
      highlights: ['Dean\'s List (4 semesters)', 'Teaching Assistant — Data Structures (CS 61B)']
    },
    {
      id: IDS.edu2,
      institution: 'Coursera / Stanford Online',
      degree: 'Certificate',
      field: 'Machine Learning Specialization',
      start_date: '01-2021',
      end_date: '04-2021',
      gpa: '',
      highlights: []
    }
  ],
  skills: [
    { id: IDS.sk1,  name: 'TypeScript' },
    { id: IDS.sk2,  name: 'Python' },
    { id: IDS.sk3,  name: 'Elixir' },
    { id: IDS.sk4,  name: 'Go' },
    { id: IDS.sk5,  name: 'React' },
    { id: IDS.sk6,  name: 'Node.js' },
    { id: IDS.sk7,  name: 'Next.js' },
    { id: IDS.sk8,  name: 'GraphQL' },
    { id: IDS.sk9,  name: 'PostgreSQL' },
    { id: IDS.sk10, name: 'Redis' },
    { id: IDS.sk11, name: 'AWS' },
    { id: IDS.sk12, name: 'Docker / K8s' }
  ],
  projects: [
    {
      id: IDS.proj1,
      name: 'OpenGraph Studio',
      description: 'Browser-based editor for generating dynamic Open Graph images with a visual canvas.',
      bullets: [
        'Built canvas rendering engine in React with real-time preview at 60fps',
        'Integrated Cloudflare Workers edge deployment — images generated in <50ms globally',
        '2,400+ GitHub stars, used by 300+ production sites'
      ],
      technologies: ['React', 'TypeScript', 'Cloudflare Workers', 'Canvas API'],
      url: 'github.com/alexrivera/og-studio',
      start_date: '11-2022',
      end_date: '03-2023'
    },
    {
      id: IDS.proj2,
      name: 'pgmigrate',
      description: 'Zero-dependency CLI for safe, reversible PostgreSQL schema migrations.',
      bullets: [
        'Automatic rollback on constraint violation with transaction isolation',
        'Dry-run mode with diff preview before any schema change',
        '500+ weekly npm downloads'
      ],
      technologies: ['Go', 'PostgreSQL'],
      url: 'github.com/alexrivera/pgmigrate',
      start_date: '06-2021',
      end_date: '09-2021'
    }
  ],
  certifications: [
    {
      id: IDS.cert1,
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '09-2023',
      expiry_date: '09-2026',
      credential_id: 'AWS-SAA-123456',
      url: 'aws.amazon.com/verification'
    },
    {
      id: IDS.cert2,
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: '02-2021',
      expiry_date: null,
      credential_id: 'PSM-789012',
      url: ''
    }
  ],
  languages: [
    { id: IDS.lang1, language: 'English',  proficiency: 'native' },
    { id: IDS.lang2, language: 'Spanish', proficiency: 'conversational' }
  ],
  volunteer_work: [],
  custom_sections: []
}

/** Pre-built resume that includes all sample profile items. */
export const SAMPLE_RESUME: ResumeDocument = {
  id: IDS.resume1,
  name: 'Senior Engineer — General',
  template_id: 'modern',
  target_role: 'Senior Software Engineer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  summary_override: null,
  included_experiences: [IDS.exp1, IDS.exp2, IDS.exp3],
  included_education: [IDS.edu1],
  included_skills: [
    IDS.sk1, IDS.sk2, IDS.sk4, IDS.sk5, IDS.sk6, IDS.sk7,
    IDS.sk8, IDS.sk9, IDS.sk10, IDS.sk11, IDS.sk12
  ],
  included_projects: [IDS.proj1, IDS.proj2],
  included_certifications: [IDS.cert1],
  included_languages: [IDS.lang1, IDS.lang2],
  included_custom_sections: [],
  bullet_overrides: {},
  section_order: [...DEFAULT_SECTION_ORDER],
  hidden_sections: [],
  template_config: { ...DEFAULT_TEMPLATE_CONFIG }
}
