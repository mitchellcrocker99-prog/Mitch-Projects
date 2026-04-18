import type { ComponentType } from 'react'
import type { TemplateId } from '@/types/resume'
import type { ResolvedResume } from './useResumeData'

export interface TemplateProps {
  data: ResolvedResume
}

import { ModernTemplate } from './Modern'
import { ClassicTemplate } from './Classic'
import { MinimalTemplate } from './Minimal'
import { TechnicalTemplate } from './Technical'

export const TEMPLATES: Record<TemplateId, { label: string; component: ComponentType<TemplateProps> }> = {
  modern: { label: 'Modern', component: ModernTemplate },
  classic: { label: 'Classic', component: ClassicTemplate },
  minimal: { label: 'Minimal', component: MinimalTemplate },
  technical: { label: 'Technical', component: TechnicalTemplate }
}

export { ModernTemplate, ClassicTemplate, MinimalTemplate, TechnicalTemplate }
