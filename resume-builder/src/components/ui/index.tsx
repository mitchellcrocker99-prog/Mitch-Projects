import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'

// ── Input ─────────────────────────────────────────────────────────────────────

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100
        placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        transition-colors ${className}`}
      {...props}
    />
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100
        placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        transition-colors resize-none ${className}`}
      {...props}
    />
  )
}

// ── Select ────────────────────────────────────────────────────────────────────

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100
        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-4 py-1.5 text-sm' }
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-700 focus:ring-slate-500',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-900/30 focus:ring-red-500',
    outline: 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-slate-100 focus:ring-slate-500'
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ── Label ─────────────────────────────────────────────────────────────────────

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-medium text-slate-400 mb-1 ${className}`}>
      {children}
    </label>
  )
}

// ── FormField ─────────────────────────────────────────────────────────────────

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// ── SectionCard ───────────────────────────────────────────────────────────────

export function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="border-t border-slate-700/60 my-3" />
}
