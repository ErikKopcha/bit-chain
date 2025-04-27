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
