// /src/app/api/daily-locations/list/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/api';

export async function GET(req: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  if (!start) return NextResponse.json([]);

  const startDate = new Date(start);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const { data, error } = await supabase
    .from('daily_locations')
    .select('*')
    .gte('date', startDate.toISOString().slice(0, 10))
    .lte('date', endDate.toISOString().slice(0, 10));

  if (error) {
    console.error('위치 불러오기 실패:', error.message);
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}