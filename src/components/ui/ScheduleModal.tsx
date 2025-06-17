'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
  setSelectedDate: (date: Date) => void;
  schedule: any;
  userId: string;
  defaultStart: string;
  defaultEnd: string;
};

const ScheduleModal = ({
  isOpen,
  onClose,
  refresh,
  setSelectedDate,
  schedule,
  userId,
  defaultStart,
  defaultEnd,
}: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start_time, setStartTime] = useState(defaultStart);
  const [end_time, setEndTime] = useState(defaultEnd);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      setDescription(schedule.description || '');
      setStartTime(schedule.start_time?.slice(0, 16) || defaultStart);
      setEndTime(schedule.end_time?.slice(0, 16) || defaultEnd);
    } else {
      setTitle('');
      setDescription('');
      setStartTime(defaultStart);
      setEndTime(defaultEnd);
    }
  }, [schedule, defaultStart, defaultEnd]);

  const handleSave = async () => {
    try {
      const payload = {
        id: schedule?.id,
        title,
        description,
        start_time,
        end_time,
        user_id: userId,
      };

      console.log('저장 요청 내용', payload);

      const res = await fetch('/api/schedules/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('서버 응답:', result);

      if (result.success) {
        refresh();
        onClose();
        const date = new Date(start_time);
        setSelectedDate(date);
      } else {
        console.error('저장 실패:', result.error || result);
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-4">일정 저장</h2>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">상세 내용</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">시작 시간</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">종료 시간</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            취소
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;