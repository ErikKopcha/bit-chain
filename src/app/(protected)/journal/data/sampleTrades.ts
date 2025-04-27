import { calculatePnl, calculateRiskPercent } from '@/features/positions/utils/calculations';
import {
  Trade,
  TRADE_CATEGORIES,
  TRADE_CATEGORIES_LIST,
  TRADE_RESULTS,
  TRADE_SIDES,
} from '../types';

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT'];

export const sampleTrades: Trade[] = Array.from({ length: 400 }, (_, i) => {
  const randomSymbolIndex = Math.floor(Math.random() * CRYPTO_SYMBOLS.length);
  const symbol = CRYPTO_SYMBOLS[randomSymbolIndex] || 'BTC';
  const side = Math.random() > 0.5 ? TRADE_SIDES.LONG : TRADE_SIDES.SHORT;
  const entryPrice = Math.floor(Math.random() * 1000) + 100;
  const categoryIndex = Math.floor(Math.random() * TRADE_CATEGORIES_LIST.length);
  const category = TRADE_CATEGORIES_LIST[categoryIndex] || TRADE_CATEGORIES.SOLO;
  const exitPrice = Math.floor(Math.random() * 1100) + 100;
  const stopLoss = Math.floor(Math.random() * 900) + 100;
  const positionSize = Math.floor(Math.random() * 10) + 1;
  const leverage = Math.floor(Math.random() * 3) + 1;
  const commission = Math.floor(Math.random() * 10) + 1;
  const totalDeposit = 500;
  const result =
    side === TRADE_SIDES.LONG
      ? exitPrice > entryPrice
        ? TRADE_RESULTS.WIN
        : TRADE_RESULTS.LOSS
      : exitPrice < entryPrice
        ? TRADE_RESULTS.WIN
        : TRADE_RESULTS.LOSS;

  return {
    id: `trde_${i + 1}`,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    symbol,
    side,
    entryPrice,
    positionSize,
    stopLoss,
    exitPrice,
    commission,
    riskPercent: calculateRiskPercent(side, entryPrice, stopLoss, positionSize, totalDeposit),
    pnl: calculatePnl(side, entryPrice, exitPrice, positionSize, commission),
    result,
    leverage,
    investment: Math.floor((entryPrice * (Math.floor(Math.random() * 10) + 1)) / leverage),
    category,
    totalDeposit,
  };
});
