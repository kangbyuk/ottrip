import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase-client';

export async function POST(req: Request) {
  const cookieStore = await cookies(); // ✅ await 붙임
  const access_token = cookieStore.get('supabase-auth-token')?.value;

  if (!access_token) {
    return NextResponse.json({ success: false, error: 'No access token' });
  }

  const { date, country, city } = await req.json();

  if (!date || !country) {
    return NextResponse.json({ success: false, error: 'Missing required fields' });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);

  if (userError || !user) {
    return NextResponse.json({ success: false, error: 'User authentication failed' });
  }

  const user_id = user.id;

  const { error } = await supabase
    .from('daily_locations')
    .upsert(
      [{ user_id, date, country, city }],
      { onConflict: 'user_id,date' }
    );

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message || '데이터 저장 중 오류가 발생했습니다.',
    });
  }

  return NextResponse.json({ success: true });
}