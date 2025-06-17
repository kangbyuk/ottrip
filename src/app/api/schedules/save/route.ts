// /src/app/api/schedules/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });

  const data = await req.json();
  const { id, title, description, start_time, end_time, user_id } = data;

  let result;
  if (id) {
    result = await supabase
      .from('schedules')
      .update({ title, description, start_time, end_time })
      .eq('id', id);
  } else {
    result = await supabase
      .from('schedules')
      .insert({ title, description, start_time, end_time, user_id });
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}