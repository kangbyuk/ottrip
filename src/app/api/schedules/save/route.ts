import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();
    console.log('🧪 저장 시도 중인 데이터:', body);

    const {
      id,
      user_id,
      title,
      content, // ✅ 클라이언트에서는 'content'로 보냄
      start_time,
      end_time,
      country,
      city,
    } = body;

    const { data, error } = await supabase
      .from('schedules')
      .upsert(
        {
          id,
          user_id,
          title,
          description: content || '', // ✅ 실제 DB 필드는 'description'
          start_time,
          end_time,
          country: country || null,
          city: city || null,
        },
        {
          onConflict: 'id',
        }
      );

    if (error) {
      console.error('❌ Supabase 저장 실패:', error.message);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('❌ API 처리 중 예외 발생:', (err as Error).message);
    return NextResponse.json({ success: false, error: '서버 오류 발생' });
  }
}