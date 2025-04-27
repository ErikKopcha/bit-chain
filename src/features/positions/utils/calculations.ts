import { TRADE_SIDES } from '@/app/(protected)/journal/types';

export function calculatePnl(
  side: TRADE_SIDES,
  entryPrice: number,
  exitPrice: number,
  positionSize: number,
  commission: number,
): number {
  const priceDifference =
    side === TRADE_SIDES.LONG ? exitPrice - entryPrice : entryPrice - exitPrice;
  return priceDifference * positionSize - commission;
}

export function calculateRiskPercent(
  side: TRADE_SIDES,
  entryPrice: number,
  stopLoss: number,
  positionSize: number,
  deposit: number,
): number {
  if (!entryPrice || !stopLoss || !positionSize || !deposit) return 0;

  const riskPerTrade = Math.abs(entryPrice - stopLoss) * positionSize;
  const riskPercent = (riskPerTrade / deposit) * 100;

  return Math.round(riskPercent * 100) / 100; // округлення до 2 знаків
}
