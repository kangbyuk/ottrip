export type ScheduleData = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  content?: string;       // ✅ 추가
  country?: string;       // ✅ 추가
  city?: string | null;   // ✅ 추가
};