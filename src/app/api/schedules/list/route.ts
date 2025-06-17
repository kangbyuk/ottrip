// src/app/api/schedules/list/route.ts
import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function GET(req: Request) {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json([], { status: 400 });
  }

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}