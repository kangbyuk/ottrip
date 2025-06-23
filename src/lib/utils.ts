import { createClient } from '@supabase/supabase-js'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ 여기만 추가된 부분
export function getTimeString(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}