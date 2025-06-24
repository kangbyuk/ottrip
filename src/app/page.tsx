'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ScheduleData } from '@/types/schedule';
import ScheduleModal from '@/components/ui/ScheduleModal';
import WeekSelector from '@/components/WeekSelector';
import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import ProfileSummary from '@/components/ProfileSummary';

export default function Page() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null);
  const [userId, setUserId] = useState('');
  const [defaultStart, setDefaultStart] = useState('');
  const [defaultEnd, setDefaultEnd] = useState('');
  const [dailyLocations, setDailyLocations] = useState<Record<string, { country: string; city: string | null }>>({});

  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeekDate, i));

  useEffect(() => {
    if (isSignedIn && user) {
      setUserId(user.id);
    }
  }, [isSignedIn, user]);

  const refreshSchedules = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/schedules/list?user_id=${userId}`);
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error('일정 불러오기 실패:', error);
    }
  };

  const refreshDailyLocations = async () => {
    const start = format(startOfWeekDate, 'yyyy-MM-dd');
    const end = format(addDays(startOfWeekDate, 6), 'yyyy-MM-dd');
    try {
      const res = await fetch(`/api/daily-locations/list?start=${start}&end=${end}`);
      const result: { date: string; country: string; city: string | null }[] = await res.json();
      const mapped = result.reduce<Record<string, { country: string; city: string | null }>>((acc, cur) => {
        acc[cur.date] = { country: cur.country, city: cur.city };
        return acc;
      }, {});
      setDailyLocations(mapped);
    } catch (err) {
      console.error('daily_locations 불러오기 실패', err);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshSchedules();
      refreshDailyLocations();
    }
  }, [userId, selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      const target = scrollTargetRef.current;
      if (container && target) {
        container.scrollTop = target.offsetTop - container.offsetTop;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCellClick = (day: Date, hour: number) => {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const formatDate = (d: Date) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:00`;
    };

    setSelectedSchedule(null);
    setDefaultStart(formatDate(start));
    setDefaultEnd(formatDate(end));
    setIsModalOpen(true);
  };

  const handleScheduleClick = (schedule: ScheduleData) => {
    const start = typeof schedule.start_time === 'string'
      ? schedule.start_time
      : new Date(schedule.start_time).toISOString();
    const end = typeof schedule.end_time === 'string'
      ? schedule.end_time
      : new Date(schedule.end_time).toISOString();

    setSelectedSchedule(schedule);
    setDefaultStart(start);
    setDefaultEnd(end);
    setIsModalOpen(true);
  };

  const findSchedulesForCell = (date: Date, hour: number): ScheduleData[] => {
    const toUtc = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return schedules.filter((sch) => {
      const start = new Date(sch.start_time);
      const end = new Date(sch.end_time);

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

  if (!isLoaded) return null;
  if (!isSignedIn || !user) return <div className="p-4">로그인이 필요합니다.</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 items-center mb-2">
        <div className="justify-self-start">
          <ProfileSummary />
        </div>
        <div className="justify-self-center">
          <Image src="/logo.png" alt="OTTRIP logo" width={160} height={80} className="h-10 w-auto" />
        </div>
        <div className="justify-self-end">
          <WeekSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[75vh] mt-2 border" ref={scrollContainerRef}>
        <div className="grid grid-cols-8 gap-px min-w-[700px]">
          <div className="bg-gray-100 p-2 sticky top-0 z-10">시간</div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="bg-gray-100 p-2 text-center font-semibold sticky top-0 z-10">
              <div>{format(day, 'MM/dd (E)', { locale: ko })}</div>
            </div>
          ))}

          {Array.from({ length: 24 }).map((_, hour) => (
            <React.Fragment key={`row-${hour}`}>
              <div className="bg-gray-50 p-2 text-sm text-center">{`${hour}:00`}</div>
              {weekDays.map((day) => {
                const cellSchedules = findSchedulesForCell(day, hour);
                const isScrollTarget = day.getDay() === 0 && hour === 6;

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-16 border cursor-pointer hover:bg-gray-100 p-1 relative"
                    onClick={() => handleCellClick(day, hour)}
                    ref={isScrollTarget ? scrollTargetRef : undefined}
                  >
                    {cellSchedules.map((sch, idx) => (
                      <div
                        key={sch.id}
                        className="bg-blue-200 rounded p-1 text-xs truncate absolute left-0 right-2"
                        style={{
                          height: `${100 / cellSchedules.length}%`,
                          top: `${(100 / cellSchedules.length) * idx}%`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleClick(sch);
                        }}
                      >
                        {sch.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <ScheduleModal
        key={isModalOpen ? `${defaultStart}-${defaultEnd}-${selectedSchedule?.id ?? 'new'}` : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refresh={refreshSchedules}
        setSelectedDate={setSelectedDate}
        schedule={selectedSchedule}
        userId={userId}
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
        dailyLocation={
          defaultStart
            ? dailyLocations[format(new Date(defaultStart), 'yyyy-MM-dd')]
            : undefined
        }
      />
    </div>
  );
}