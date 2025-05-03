import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

const DEFAULT_TRADE_FILTERS = {
  tradeFilters: {
    side: undefined,
    category: undefined,
    result: undefined,
  },
  selectedDateRange: undefined,
};

interface State {
  theme: THEME;
  isNavigationOpen: boolean;
  selectedDateRange?: DateRange;
  tradeFilters: {
    side?: string;
    category?: string;
    result?: string;
  };

  // Actions
  setTheme: (theme: THEME) => void;
  toggleNavigation: () => void;
  setSelectedDateRange: (dateRange?: DateRange) => void;
  setTradeFilters: (filters: Partial<State['tradeFilters']>) => void;
  resetTradeFilters: () => void;
}

export const useStore = create<State>()(
  persist(
    set => ({
      theme: THEME.LIGHT,
      isNavigationOpen: true,
      ...DEFAULT_TRADE_FILTERS,

      // Actions
      setTheme: theme => set({ theme }),
      toggleNavigation: () => set(state => ({ isNavigationOpen: !state.isNavigationOpen })),
      setSelectedDateRange: dateRange => set({ selectedDateRange: dateRange }),
      setTradeFilters: filters =>
        set(state => ({
          tradeFilters: { ...state.tradeFilters, ...filters },
        })),
      resetTradeFilters: () => set({ ...DEFAULT_TRADE_FILTERS }),
    }),
    {
      name: 'bitchain-storage',
    },
  ),
);
