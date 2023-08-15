'use client';

import { DateTimeSelect } from '@/components/ui-extras/date-time-select';
import { useState } from 'react';

export function DemoDatePicker() {
  const [date, setDate] = useState(new Date('2022-11-17T09:00:00'));

  return <DateTimeSelect value={date} onChange={setDate} />;
}
