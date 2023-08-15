'use client';

import { WeekdayPicker } from '@/components/ui-extras/weekday-picker';
import { useState } from 'react';

export function DemoWeekdayPicker() {
  const [days, setDays] = useState([1, 2]);

  return <WeekdayPicker values={days} onChange={setDays} />;
}
