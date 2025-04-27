import {
  TRADE_CATEGORIES_LIST,
  TRADE_RESULTS_LIST,
  TRADE_SIDES_LIST,
} from '@/app/(protected)/journal/types';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

interface PositionFiltersProps {
  dateRange: DateRange | undefined;
  sideFilter: string | undefined;
  categoryFilter: string | undefined;
  resultFilter: string | undefined;
  onResultFilterChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSideFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

export function PositionFilters({
  dateRange,
  sideFilter,
  categoryFilter,
  resultFilter,
  onResultFilterChange,
  onDateRangeChange,
  onSideFilterChange,
  onCategoryFilterChange,
}: PositionFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
      <div className="col-span-1 md:col-span-1">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          placeholder="All time"
        />
      </div>

      <Select value={sideFilter} onValueChange={onSideFilterChange}>
        <SelectTrigger className="w-full text-xs h-8">
          <SelectValue placeholder="Select side" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sides</SelectItem>
          {TRADE_SIDES_LIST.map(side => (
            <SelectItem key={side} value={side}>
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-full text-xs h-8">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {TRADE_CATEGORIES_LIST.map(category => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={resultFilter} onValueChange={onResultFilterChange}>
        <SelectTrigger className="w-full text-xs h-8">
          <SelectValue placeholder="Select result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All results</SelectItem>
          {TRADE_RESULTS_LIST.map(result => (
            <SelectItem key={result} value={result}>
              {result.charAt(0).toUpperCase() + result.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
