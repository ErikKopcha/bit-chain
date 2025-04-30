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
      return 'bg-purple-100 text-purple-800';
    case TRADE_CATEGORIES.RADAR:
    case TRADE_CATEGORIES.EVEREST:
      return 'bg-blue-100 text-blue-800';
    case TRADE_CATEGORIES.CRYPTONITE_RADAR:
    case TRADE_CATEGORIES.CRYPTONITE_EVEREST:
      return 'bg-cyan-100 text-cyan-800';
    case TRADE_CATEGORIES.HUMSTER:
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSideColorClass = (side: string): string => {
  return side === TRADE_SIDES.LONG
    ? 'bg-green-100 text-green-800 border border-green-300'
    : 'bg-red-100 text-red-800 border border-red-300';
};

export const getResultColorClass = (result: string): string => {
  switch (result) {
    case TRADE_RESULTS.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case TRADE_RESULTS.WIN:
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    case TRADE_RESULTS.LOSS:
      return 'bg-rose-100 text-rose-800 border border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};
