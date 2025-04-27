import { ReactNode } from 'react';

export enum TRADE_SIDES {
  LONG = 'long',
  SHORT = 'short',
}

export enum TRADE_RESULTS {
  WIN = 'win',
  LOSS = 'loss',
  PENDING = 'pending',
}

export enum TRADE_CATEGORIES {
  SOLO = 'solo',
  RADAR = 'radar',
  EVEREST = 'everest',
  CRYPTONITE_RADAR = 'cryptonite-radar',
  CRYPTONITE_EVEREST = 'cryptonite-everest',
  HUMSTER = 'humster',
}

export const TRADE_SIDES_LIST: TRADE_SIDES[] = [TRADE_SIDES.LONG, TRADE_SIDES.SHORT];
export const TRADE_RESULTS_LIST: TRADE_RESULTS[] = [
  TRADE_RESULTS.WIN,
  TRADE_RESULTS.LOSS,
  TRADE_RESULTS.PENDING,
];
export const TRADE_CATEGORIES_LIST: TRADE_CATEGORIES[] = [
  TRADE_CATEGORIES.SOLO,
  TRADE_CATEGORIES.RADAR,
  TRADE_CATEGORIES.EVEREST,
  TRADE_CATEGORIES.CRYPTONITE_RADAR,
  TRADE_CATEGORIES.CRYPTONITE_EVEREST,
  TRADE_CATEGORIES.HUMSTER,
];

export interface Trade {
  id: string;
  date: Date;
  symbol: string;
  side: TRADE_SIDES;
  entryPrice: number;
  positionSize: number;
  stopLoss: number;
  exitPrice: number;
  commission: number;
  riskPercent: number;
  pnl: number;
  result: TRADE_RESULTS;
  leverage?: number | null;
  investment?: number | null;
  category: TRADE_CATEGORIES;
  totalDeposit: number;
}

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}
