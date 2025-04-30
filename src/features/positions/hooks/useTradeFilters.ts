import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useTradeFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sideFilter, setSideFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [resultFilter, setResultFilter] = useState<string | undefined>(undefined);

  const handleSideFilterChange = (value: string) => {
    setSideFilter(value === 'all' ? undefined : value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === 'all' ? undefined : value);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value === 'all' ? undefined : value);
  };

  return {
    dateRange,
    sideFilter,
    categoryFilter,
    resultFilter,
    setDateRange,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
  };
};
