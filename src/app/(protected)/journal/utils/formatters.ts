import { TRADE_CATEGORIES, TRADE_RESULTS, TRADE_SIDES } from '@/features/positions/types/position';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ua-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const getCategoryColorClass = (category: string): string => {
  switch (category) {
    case TRADE_CATEGORIES.SOLO:
      return 'bg-purple-100 dark:bg-transparent text-purple-800 dark:text-white border-purple-200 dark:border dark:border-zinc-700';
    case TRADE_CATEGORIES.RADAR:
    case TRADE_CATEGORIES.EVEREST:
      return 'bg-blue-100 dark:bg-transparent text-blue-800 dark:text-white border-blue-200 dark:border dark:border-zinc-700';
    case TRADE_CATEGORIES.CRYPTONITE_RADAR:
    case TRADE_CATEGORIES.CRYPTONITE_EVEREST:
      return 'bg-cyan-100 dark:bg-transparent text-cyan-800 dark:text-white border-cyan-200 dark:border dark:border-zinc-700';
    case TRADE_CATEGORIES.HUMSTER:
      return 'bg-amber-100 dark:bg-transparent text-amber-800 dark:text-white border-amber-200 dark:border dark:border-zinc-700';
    default:
      return 'bg-gray-100 dark:bg-transparent text-gray-800 dark:text-white border-gray-200 dark:border dark:border-zinc-700';
  }
};

export const getSideColorClass = (side: string): string => {
  return side === TRADE_SIDES.LONG
    ? 'bg-green-100 dark:bg-transparent text-green-800 dark:text-green-400 border border-green-300 dark:border-green-800/30'
    : 'bg-red-100 dark:bg-transparent text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800/30';
};

export const getResultColorClass = (result: string): string => {
  switch (result) {
    case TRADE_RESULTS.PENDING:
      return 'bg-yellow-100 dark:bg-transparent text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800/30';
    case TRADE_RESULTS.WIN:
      return 'bg-emerald-100 dark:bg-transparent text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/30';
    case TRADE_RESULTS.LOSS:
      return 'bg-rose-100 dark:bg-transparent text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800/30';
    default:
      return 'bg-gray-100 dark:bg-transparent text-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-500/30';
  }
};
