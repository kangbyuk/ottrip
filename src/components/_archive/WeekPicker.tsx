'use client'

import { useState } from 'react'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type Props = {
  onWeekSelect: (rangeText: string) => void
}

export default function WeekPicker({ onWeekSelect }: Props) {
  const [selectedDay, setSelectedDay] = useState<Date>()

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const start = startOfWeek(day, { locale: ko, weekStartsOn: 1 })
    const end = endOfWeek(day, { locale: ko, weekStartsOn: 1 })
    const rangeText = `${format(start, 'yyyy-MM-dd')} ~ ${format(end, 'yyyy-MM-dd')}`
    onWeekSelect(rangeText)
  }

  return (
    <div className="bg-white border rounded shadow p-2">
      <DayPicker
        mode="single"
        selected={selectedDay}
        onDayClick={handleDayClick}
        locale={ko}
        weekStartsOn={1}
      />
    </div>
  )
}