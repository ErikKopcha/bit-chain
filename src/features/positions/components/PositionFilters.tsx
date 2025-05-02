import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { TRADE_CATEGORIES_LIST, TRADE_RESULTS_LIST, TRADE_SIDES_LIST } from '../types/position';

interface PositionFiltersProps {
  dateRange: DateRange | undefined;
  sideFilter: string | undefined;
  categoryFilter: string | undefined;
  resultFilter: string | undefined;
  onResultFilterChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSideFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onRefetch?: () => void;
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
  onRefetch,
}: PositionFiltersProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto custom-filter-container">
        <div className="col-span-1 md:col-span-1">
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            placeholder="All time"
            mode="range"
            showPresets
          />
        </div>

        <Select value={sideFilter} onValueChange={onSideFilterChange}>
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue placeholder="Select side" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sides</SelectItem>
            {TRADE_SIDES_LIST.map(side => (
              <SelectItem key={side} value={side}>
                {side.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {TRADE_CATEGORIES_LIST.map(category => (
              <SelectItem key={category} value={category}>
                {category.toLowerCase().replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={resultFilter} onValueChange={onResultFilterChange}>
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue placeholder="Select result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All results</SelectItem>
            {TRADE_RESULTS_LIST.map(result => (
              <SelectItem key={result} value={result}>
                {result.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {onRefetch && (
        <Button variant="outline" size="icon" onClick={onRefetch} className="h-9 w-9">
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
