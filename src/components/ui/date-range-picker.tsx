'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, endOfMonth, format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  align?: 'start' | 'center' | 'end';
  className?: string;
  showPresets?: boolean;
  placeholder?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  align = 'start',
  className,
  showPresets = true,
  placeholder = 'Select date range',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format date range display text
  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`;
    }
    if (dateRange?.from) {
      return `From ${format(dateRange.from, 'dd.MM.yyyy')}`;
    }
    if (dateRange?.to) {
      return `Until ${format(dateRange.to, 'dd.MM.yyyy')}`;
    }
    return placeholder;
  };

  // Quick date range selection handlers
  const handleCurrentMonth = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfMonth(today),
      to: endOfMonth(today),
    });
  };

  const handlePreviousMonth = () => {
    const today = new Date();
    const prevMonth = subMonths(today, 1);
    onDateRangeChange({
      from: startOfMonth(prevMonth),
      to: endOfMonth(prevMonth),
    });
  };

  const handleCurrentYear = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfYear(today),
      to: today,
    });
  };

  const handleAllTime = () => {
    onDateRangeChange(undefined);
  };

  // Last 7 days option
  const handleLastWeek = () => {
    const today = new Date();
    onDateRangeChange({
      from: addDays(today, -7),
      to: today,
    });
  };

  // Close popover when date range is selected
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Add a slight delay to close the popover
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dateRange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left text-xs', className)}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {formatDateRange()}
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
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            initialFocus
            numberOfMonths={2}
            className="rounded border"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
