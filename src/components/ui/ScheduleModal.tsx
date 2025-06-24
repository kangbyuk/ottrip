'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { City } from 'country-state-city';
import { ScheduleData } from '@/types/schedule';
import CountryAutocomplete from '@/components/ui/CountryAutocomplete';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => Promise<void>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  schedule: ScheduleData | null;
  userId: string;
  defaultStart: string;
  defaultEnd: string;
  dailyLocation?: {
    country: string;
    city: string | null;
  };
};

const ScheduleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  refresh,
  setSelectedDate,
  schedule,
  userId,
  defaultStart,
  defaultEnd,
  dailyLocation,
}) => {
  const [startTime, setStartTime] = useState(defaultStart.slice(11, 16));
  const [endTime, setEndTime] = useState(defaultEnd.slice(11, 16));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (defaultStart) setStartTime(defaultStart.slice(11, 16));
    if (defaultEnd) setEndTime(defaultEnd.slice(11, 16));
  }, [defaultStart, defaultEnd]);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      setContent(schedule.content || '');
      setCountry(schedule.country || dailyLocation?.country || '');
      setCity(schedule.city || dailyLocation?.city || '');
    } else {
      setTitle('');
      setContent('');
      setCountry(dailyLocation?.country || '');
      setCity(dailyLocation?.city || '');
    }
  }, [schedule, dailyLocation]);

  const handleSave = async () => {
    const payload = {
      title,
      content,
      start_time: `${defaultStart.slice(0, 10)}T${startTime}`,
      end_time: `${defaultStart.slice(0, 10)}T${endTime}`,
      user_id: userId,
      date: defaultStart.slice(0, 10),
      country,
      city,
    };

    try {
      const res = await fetch('/api/schedules/save', {
        method: schedule ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule ? { ...payload, id: schedule.id } : payload),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      await refresh();
      onClose();
    } catch (error: any) {
      alert(`저장 실패: ${error.message || error}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="space-y-4">
        <DialogTitle>일정 입력</DialogTitle>

        <div>
          <div className="text-sm text-gray-500">일자</div>
          <div className="text-base font-medium">
            {defaultStart
              ? format(new Date(defaultStart), 'yyyy년 MM월 dd일')
              : '날짜 없음'}
          </div>
        </div>

        <div className="flex gap-2">
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />

        <div className="space-y-2">
          <label className="text-sm text-gray-600">국가</label>
          <CountryAutocomplete
            value={country}
            onChange={(val) => {
              setCountry(val);
              setCity('');
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">도시</label>
          <CityAutocomplete
            countryCode={country}
            value={city}
            onChange={(val) => setCity(val)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>{schedule ? '수정' : '저장'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;