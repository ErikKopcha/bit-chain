import { TRADE_SIDES } from '../types/position';

export function calculatePnl({
  side,
  entryPrice,
  exitPrice,
  positionSize,
  commission = 0,
  // leverage = 1,
}: {
  side: TRADE_SIDES;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  commission?: number;
}): number {
  if (!entryPrice || !exitPrice || !positionSize) return 0;

  const rawPnL =
    side === TRADE_SIDES.LONG
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize;

  const netPnL = rawPnL - commission;
  return Math.round(netPnL * 100) / 100;
}

export function calculateRiskPercent({
  side,
  entryPrice,
  stopLoss,
  positionSize,
  deposit,
}: {
  side: TRADE_SIDES;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  deposit: number;
}): number {
  if (!entryPrice || !stopLoss || !positionSize || !deposit) return 0;

  const potentialLoss =
    side === TRADE_SIDES.LONG
      ? (entryPrice - stopLoss) * positionSize
      : (stopLoss - entryPrice) * positionSize;

  const leveragedLoss = potentialLoss;
  const percent = (leveragedLoss / deposit) * 100;

  return Math.round(percent * 100) / 100;
}

export function calculateInvestment({
  entryPrice,
  positionSize,
  leverage = 1,
}: {
  entryPrice: number;
  positionSize: number;
  leverage: number;
}): number {
  if (!entryPrice || !positionSize || !leverage) return 0;

  const investment = (entryPrice * positionSize) / leverage;

  return Math.round(investment * 100) / 100;
}
