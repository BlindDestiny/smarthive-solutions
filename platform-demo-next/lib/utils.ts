import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
}

export function addDays(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + n)
  return result
}

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

export const TODAY = toDateStr(new Date())

export function getDaysArray(days = 30): string[] {
  return Array.from({ length: days }, (_, i) =>
    toDateStr(addDays(new Date(), i - days + 1))
  )
}

export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}
