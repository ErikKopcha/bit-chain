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
  const result = Math.random() > 0.5 ? TRADE_RESULTS.WIN : TRADE_RESULTS.LOSS;
  const entryPrice = Math.floor(Math.random() * 1000) + 100;
  const categoryIndex = Math.floor(Math.random() * TRADE_CATEGORIES_LIST.length);
  const category = TRADE_CATEGORIES_LIST[categoryIndex] || TRADE_CATEGORIES.SOLO;

  return {
    id: `trde_${i + 1}`,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    symbol,
    side,
    entryPrice,
    positionSize: Math.floor(Math.random() * 10) + 1,
    stopLoss: Math.floor(Math.random() * 900) + 100,
    exitPrice: Math.floor(Math.random() * 1100) + 100,
    commission: Math.floor(Math.random() * 10) + 1,
    riskPercent: Math.floor(Math.random() * 5) + 1,
    pnl: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : -Math.floor(Math.random() * 100),
    result,
    leverage: Math.floor(Math.random() * 3) + 1,
    investment: Math.floor(Math.random() * 5000) + 1000,
    category,
  };
});
