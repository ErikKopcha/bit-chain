import { TRADE_RESULTS, TRADE_SIDES } from '../types/position';

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

export function calculateWinRate(trades: Array<{ result: TRADE_RESULTS }>): number {
  const completedTrades = trades.filter(t => t.result !== TRADE_RESULTS.PENDING);
  if (completedTrades.length === 0) return 0;

  const winningTrades = completedTrades.filter(t => t.result === TRADE_RESULTS.WIN).length;
  return Math.round((winningTrades / completedTrades.length) * 100);
}

export const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  // Allow only numbers and one decimal point
  const sanitizedValue = value.replace(/[^\d.]/g, '');
  // Ensure only one decimal point
  const parts = sanitizedValue.split('.');
  if (parts.length > 2) {
    e.target.value = parts[0] + '.' + parts.slice(1).join('');
  } else {
    e.target.value = sanitizedValue;
  }
};

export type PositionStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS';

export interface PositionMetrics {
  pnl: number;
  result: number;
  riskPercentage: number;
  investment: number;
  status: PositionStatus;
}

export function calculatePositionMetrics(
  entryPrice: number,
  exitPrice: number | undefined,
  size: number,
  leverage: number,
  side: 'LONG' | 'SHORT',
  commission: number = 0,
): PositionMetrics {
  const investment = size * entryPrice;
  const leveragedInvestment = investment * leverage;

  if (!exitPrice) {
    return {
      pnl: 0,
      result: 0,
      riskPercentage: 0,
      investment: leveragedInvestment,
      status: 'IN_PROGRESS',
    };
  }

  const priceDifference = side === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;

  const pnl = priceDifference * size * leverage - commission;
  const result = (pnl / leveragedInvestment) * 100;

  // Risk percentage calculation (assuming stop loss is set)
  const riskPercentage = 0; // This will be calculated when stop loss is implemented

  return {
    pnl,
    result,
    riskPercentage,
    investment: leveragedInvestment,
    status: 'CLOSED',
  };
}
