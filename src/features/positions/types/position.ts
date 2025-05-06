import { ReactNode } from 'react';
import * as z from 'zod';

export enum TRADE_SIDES {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum TRADE_RESULTS {
  WIN = 'WIN',
  LOSS = 'LOSS',
  PENDING = 'PENDING',
}

export enum TRADE_CATEGORIES {
  SOLO = 'solo',
  RADAR = 'radar',
  EVEREST = 'everest',
  CRYPTONITE_RADAR = 'cryptonite_radar',
  CRYPTONITE_EVEREST = 'cryptonite_everest',
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
  leverage: number;
  investment: number;
  category: TRADE_CATEGORIES;
  deposit: number;
  comment?: string;
}

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (item: Trade) => ReactNode;
  className?: string;
}

export type PositionFormValues = {
  date: Date;
  symbol: string;
  side: TRADE_SIDES;
  entryPrice: number;
  positionSize: number;
  stopLoss?: number;
  exitPrice?: number;
  commission?: number;
  category: TRADE_CATEGORIES;
  deposit: number;
  leverage?: number;
  comment?: string;
};

export const positionSchema = z.object({
  date: z.date(),
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.nativeEnum(TRADE_SIDES),
  entryPrice: z.preprocess(val => Number(val), z.number().positive('Entry price must be positive')),
  positionSize: z.preprocess(
    val => Number(val ?? 0),
    z.number().positive('Position size must be positive'),
  ),
  stopLoss: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().positive('Stop loss must be positive').optional(),
  ),
  exitPrice: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().positive('Exit price must be positive').optional(),
  ),
  commission: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().min(0, 'Commission must be positive').optional(),
  ),
  category: z.nativeEnum(TRADE_CATEGORIES),
  deposit: z.preprocess(val => Number(val ?? 0), z.number().positive('Deposit must be positive')),
  leverage: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().min(1, 'Leverage must be at least 1').optional(),
  ),
  comment: z.preprocess(
    val => (val === null ? '' : val),
    z.string().max(255, 'Comment must be less than 255 characters').optional().nullable(),
  ),
}) as z.ZodType<PositionFormValues>;
