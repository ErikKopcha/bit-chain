import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useTradeFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sideFilter, setSideFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [resultFilter, setResultFilter] = useState<string | undefined>();

  const handleSideFilterChange = (value: string) => {
    setSideFilter(value === 'all' ? '' : value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === 'all' ? '' : value);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value === 'all' ? '' : value);
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
