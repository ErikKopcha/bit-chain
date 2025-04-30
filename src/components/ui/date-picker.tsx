'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, endOfMonth, format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface DatePickerProps {
  date?: Date;
  dateRange?: DateRange;
  onDateChange?: (date: Date | undefined) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  align?: 'start' | 'center' | 'end';
  className?: string;
  showPresets?: boolean;
  placeholder?: string;
  mode?: 'default' | 'range';
}

export function DatePicker({
  date,
  dateRange,
  onDateChange,
  onDateRangeChange,
  align = 'start',
  className,
  showPresets = false,
  placeholder = 'Select date',
  mode = 'default',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format date display text
  const formatDateDisplay = () => {
    if (mode === 'range') {
      if (dateRange?.from && dateRange?.to) {
        return `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`;
      }
      if (dateRange?.from) {
        return `From ${format(dateRange.from, 'dd.MM.yyyy')}`;
      }
      if (dateRange?.to) {
        return `Until ${format(dateRange.to, 'dd.MM.yyyy')}`;
      }
    } else {
      if (date) {
        return format(date, 'dd.MM.yyyy');
      }
    }
    return placeholder;
  };

  // Quick date range selection handlers
  const handleCurrentMonth = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange({
        from: startOfMonth(today),
        to: endOfMonth(today),
      });
    } else if (mode === 'default' && onDateChange) {
      onDateChange(today);
    }
  };

  const handlePreviousMonth = () => {
    const today = new Date();
    const prevMonth = subMonths(today, 1);
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange({
        from: startOfMonth(prevMonth),
        to: endOfMonth(prevMonth),
      });
    } else if (mode === 'default' && onDateChange) {
      onDateChange(prevMonth);
    }
  };

  const handleCurrentYear = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange({
        from: startOfYear(today),
        to: today,
      });
    } else if (mode === 'default' && onDateChange) {
      onDateChange(today);
    }
  };

  const handleAllTime = () => {
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange(undefined);
    } else if (mode === 'default' && onDateChange) {
      onDateChange(undefined);
    }
  };

  const handleLastWeek = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange({
        from: addDays(today, -7),
        to: today,
      });
    } else if (mode === 'default' && onDateChange) {
      onDateChange(addDays(today, -7));
    }
  };

  // Close popover when date is selected
  useEffect(() => {
    if (mode === 'range' && dateRange?.from && dateRange?.to) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    } else if (mode === 'default' && date) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [date, dateRange, mode]);

  const handleSelect = (selected: Date | DateRange | undefined) => {
    if (mode === 'range' && onDateRangeChange) {
      onDateRangeChange(selected as DateRange);
    } else if (mode === 'default' && onDateChange) {
      onDateChange(selected as Date);
    }
  };

  const calendarProps =
    mode === 'range'
      ? {
          mode: 'range' as const,
          selected: dateRange,
          onSelect: handleSelect,
          initialFocus: true,
          numberOfMonths: 2,
          className: 'rounded border',
        }
      : {
          mode: 'default' as const,
          selected: date,
          onSelect: handleSelect,
          initialFocus: true,
          numberOfMonths: 2,
          className: 'rounded border',
        };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left text-xs', className)}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {formatDateDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        {showPresets && (
          <div className="p-3 border-b">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleCurrentMonth}
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handlePreviousMonth}
              >
                Last Month
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleLastWeek}>
                Last 7 Days
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleCurrentYear}
              >
                This Year
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleAllTime}>
                All Time
              </Button>
            </div>
          </div>
        )}
        <div className="p-3">
          <Calendar {...calendarProps} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
