'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, History } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isSameWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface WeekSelectorProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function WeekSelector({ selectedDate, onSelect }: WeekSelectorProps) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 0 });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goToThisWeek = () => {
    onSelect(new Date());
    setShowPopover(false);
  };

  return (
    <div className="relative flex justify-end items-center mb-4 gap-2 z-10">
      <button
        onClick={goToThisWeek}
        className="flex items-center justify-center p-2 border rounded bg-white shadow"
        title="이번 주로 이동"
      >
        <History className="w-4 h-4 text-blue-500" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="flex items-center px-4 py-2 border rounded bg-white shadow"
        >
          <Clock className="w-4 h-4 mr-2" />
          {format(start, 'MM/dd')} ~ {format(end, 'MM/dd')}
        </button>

        {showPopover && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-2 bg-white border rounded shadow-lg p-4"
          >
            <Calendar
              onClickDay={(value) => {
                onSelect(value);
                setShowPopover(false);
              }}
              value={selectedDate}
              locale="ko-KR"
              calendarType="gregory"
              tileClassName={({ date }) =>
                isSameWeek(date, selectedDate, { weekStartsOn: 0 })
                  ? 'bg-blue-100 text-blue-800 font-bold rounded'
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}