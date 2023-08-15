import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

dayjs.extend(customParseFormat);

type DateTimeSelect = {
  value: Date | null;
  onChange: (value: Date) => void;
};

export function DateTimeSelect({ value, onChange }: DateTimeSelect) {
  const dateValue = value ?? new Date();
  const [timeValue, setTimeValue] = useState(dayjs(dateValue).format(timeFormat));

  return (
    <div>
      <div className="flex flex-row space-x-4">
        <div>
          <DateSelect
            value={dateValue}
            onChange={(date) => {
              onChange(getCombinedDateTime(date, timeValue).toDate());
            }}
          />
        </div>
        <div className="w-32">
          <div>
            <TimeSelect
              value={timeValue}
              onChange={(time) => {
                setTimeValue(time);
                onChange(getCombinedDateTime(dateValue, time).toDate());
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type DateSelect = {
  value: Date | null;
  onChange: (value: Date) => void;
};

export function DateSelect({ value, onChange }: DateSelect) {
  const dateValue = value ?? new Date();
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
  return (
    <Popover open={isDatepickerOpen} onOpenChange={setIsDatepickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[200px] px-3 justify-start text-left font-normal')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dayjs(dateValue).format('MMMM DD, YYYY')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setIsDatepickerOpen(false);
            }
          }}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}

type TimeSelect = {
  value: string;
  onChange: (value: string) => void;
};

export function TimeSelect({ value, onChange }: TimeSelect) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a question type" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {generateTimesArray().map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'h:mm A';

// https://chat.openai.com/share/dd8364ad-35b3-427c-84ab-21f7458674e5
function generateTimesArray() {
  const timesArray: string[] = [];

  const startTime = dayjs().startOf('day');
  const endTime = dayjs().startOf('day').add(1, 'day').subtract(15, 'minutes');

  let currentTime = startTime;

  while (currentTime.isBefore(endTime)) {
    timesArray.push(currentTime.format(timeFormat));
    currentTime = currentTime.add(1, 'hour');
  }

  return timesArray;
}

function getCombinedDateTime(date: Date, time: string) {
  const formattedDate = dayjs(date).format(dateFormat);
  const combinedDateTimeString = `${formattedDate} ${time}`;
  const combinedDateTime = dayjs(combinedDateTimeString, `${dateFormat} ${timeFormat}`);

  return combinedDateTime;
}
