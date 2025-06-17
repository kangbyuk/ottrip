// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ScheduleData } from '@/types/schedule';
import ScheduleModal from '@/components/ui/ScheduleModal';
import WeekSelector from '@/components/WeekSelector';
import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Page() {
  const { isSignedIn, user } = useUser();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [userId, setUserId] = useState('');
  const [defaultStart, setDefaultStart] = useState('');
  const [defaultEnd, setDefaultEnd] = useState('');

  useEffect(() => {
    if (isSignedIn && user) {
      setUserId(user.id);
    }
  }, [isSignedIn, user]);

  const refreshSchedules = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/schedules/list?user_id=${userId}`);

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('❌ JSON 아님! 응답 내용:', text.slice(0, 300));
        throw new Error('API 응답이 JSON이 아닙니다.');
      }

      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error('일정 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshSchedules();
    }
  }, [userId, selectedDate]);

  const handleCellClick = (day: Date, hour: number) => {
    const selectedCell = new Date(day);
    selectedCell.setHours(hour, 0, 0, 0);

    const endCell = new Date(selectedCell);
    endCell.setHours(selectedCell.getHours() + 1);

    const toISOStringLocal = (date: Date) => {
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    setDefaultStart(toISOStringLocal(selectedCell));
    setDefaultEnd(toISOStringLocal(endCell));
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleScheduleClick = (schedule: ScheduleData) => {
    const start = typeof schedule?.start_time === 'string'
      ? schedule.start_time
      : (new Date(schedule?.start_time)).toISOString() ?? '';
    const end = typeof schedule?.end_time === 'string'
      ? schedule.end_time
      : (new Date(schedule?.end_time)).toISOString() ?? '';
    setDefaultStart(start);
    setDefaultEnd(end);
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const findSchedulesForCell = (date: Date, hour: number) => {
    const toUtc = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return schedules.filter((sch) => {
      const start = sch.start_time ? new Date(sch.start_time) : new Date(0);
      const end = sch.end_time ? new Date(sch.end_time) : new Date(0);

      const cellStart = new Date(date);
      cellStart.setHours(hour, 0, 0, 0);
      const cellEnd = new Date(cellStart);
      cellEnd.setHours(cellStart.getHours() + 1);

      const utcCellStart = toUtc(cellStart);
      const utcCellEnd = toUtc(cellEnd);

      return (
        (start >= utcCellStart && start < utcCellEnd) ||
        (end > utcCellStart && end <= utcCellEnd) ||
        (start <= utcCellStart && end >= utcCellEnd)
      );
    });
  };

  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeekDate, i));

  if (!isSignedIn) {
    return <div className="p-4">로그인이 필요합니다.</div>;
  }

  return (
    <div className="p-4">
      <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

      <div className="grid grid-cols-8 gap-px border mt-4">
        <div className="bg-gray-100 p-2">시간</div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="bg-gray-100 p-2 text-center font-semibold">
            {format(day, 'MM/dd (E)', { locale: ko })}
          </div>
        ))}

        {Array.from({ length: 24 }).map((_, hour) => (
          <React.Fragment key={`row-${hour}`}>
            <div className="bg-gray-50 p-2 text-sm text-center">{`${hour}:00`}</div>
            {weekDays.map((day) => {
              const cellSchedules = findSchedulesForCell(day, hour);
              const isSingle = cellSchedules.length === 1;
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="h-16 border cursor-pointer hover:bg-gray-100 p-1"
                  onClick={() => handleCellClick(day, hour)}
                >
                  <div
                    className={`h-full flex flex-col ${isSingle ? 'justify-center' : 'justify-start gap-1'}`}
                  >
                    {cellSchedules.map((sch) => (
                      <div
                        key={sch.id}
                        className={`bg-blue-200 rounded text-xs truncate px-1 py-0.5 ${isSingle ? 'h-full' : 'h-1/2'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleClick(sch);
                        }}
                      >
                        {sch.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refresh={refreshSchedules}
        setSelectedDate={setSelectedDate}
        schedule={selectedSchedule!}
        userId={userId}
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
      />
    </div>
  );
}