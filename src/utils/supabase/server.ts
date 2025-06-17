import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase'; // ✅ 경로 수정됨

export const supabase = createServerComponentClient<Database>({
  cookies,
});