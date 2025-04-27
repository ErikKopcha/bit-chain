export interface Position {
  id: string;
  date: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  commission?: number;
  size: number;
  leverage?: number;
  category?: string;
  pnl?: number;
  result?: number;
}

export interface PositionFormValues {
  date: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  commission?: number;
  size: number;
  leverage?: number;
  category?: string;
}
