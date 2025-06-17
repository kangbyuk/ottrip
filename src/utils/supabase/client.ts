import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 이 부분이 새로 추가된 getUser 함수입니다
export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};