import { useStore } from '@/store';

const DEFAULT_FILTERS = ['all', undefined, ''];

export const useTradeFilters = () => {
  const {
    selectedDateRange: dateRange,
    tradeFilters,
    setSelectedDateRange: setDateRange,
    setTradeFilters,
  } = useStore();

  const handleSideFilterChange = (value: string) => {
    setTradeFilters({ side: DEFAULT_FILTERS.includes(value) ? undefined : value });
  };

  const handleCategoryFilterChange = (value: string) => {
    setTradeFilters({ category: DEFAULT_FILTERS.includes(value) ? undefined : value });
  };

  const handleResultFilterChange = (value: string) => {
    setTradeFilters({ result: DEFAULT_FILTERS.includes(value) ? undefined : value });
  };

  return {
    dateRange,
    sideFilter: tradeFilters.side,
    categoryFilter: tradeFilters.category,
    resultFilter: tradeFilters.result,
    setDateRange,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
  };
};
