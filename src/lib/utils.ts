import { createClient } from '@supabase/supabase-js'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ✅ 추가: Tailwind 클래스 유틸 함수
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}