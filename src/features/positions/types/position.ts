import { TRADE_CATEGORIES, TRADE_SIDES } from '@/app/(protected)/journal/types';
import * as z from 'zod';

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
  totalDeposit: number;
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
  totalDeposit: z.preprocess(
    val => Number(val ?? 0),
    z.number().positive('Total deposit must be positive'),
  ),
}) as z.ZodType<PositionFormValues>;
