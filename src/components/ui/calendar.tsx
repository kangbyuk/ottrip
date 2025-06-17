'use client';

import * as React from 'react';
import { format, Locale } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type CalendarProps = {
  mode?: 'single';
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  onDayMouseEnter?: (date: Date) => void;
  modifiers?: any;
  modifiersClassNames?: any;
  locale?: Locale;
};

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  onDayMouseEnter,
  modifiers,
  modifiersClassNames,
  locale = ko,
}: CalendarProps) {
  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      onDayMouseEnter={onDayMouseEnter}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      locale={locale}
      weekStartsOn={0}
      formatters={{
        formatCaption: (month: Date) =>
          format(month, 'yyyy년 M월', { locale }),
      }}
    />
  );
}