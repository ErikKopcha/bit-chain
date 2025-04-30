import { ColumnDef } from '@/features/positions/types/position';
import { Trade } from '@/generated/prisma';
import {
  formatCurrency,
  formatDate,
  getCategoryColorClass,
  getResultColorClass,
  getSideColorClass,
} from '../utils/formatters';

export const columns: ColumnDef<Trade>[] = [
  {
    key: 'date',
    header: 'Date',
    className: 'w-[100px]',
    cell: trade => formatDate(trade.date),
  },
  {
    key: 'symbol',
    header: 'Symbol',
    className: 'text-center',
    cell: trade => <span className="font-medium text-center block">{trade.symbol}</span>,
  },
  {
    key: 'side',
    header: 'Side',
    className: 'text-center',
    cell: trade => (
      <span
        className={`px-2 block text-center py-1 rounded-full text-xs font-medium ${getSideColorClass(trade.side)}`}
      >
        {trade.side.toLowerCase()}
      </span>
    ),
  },
  {
    key: 'pnl',
    header: 'P/L',
    className: 'text-right',
    cell: trade => (
      <span
        className={
          trade.pnl >= 0 ? 'text-green-600 block text-right' : 'text-red-600 block text-right'
        }
      >
        {formatCurrency(trade.pnl)}
      </span>
    ),
  },
  {
    key: 'riskPercent',
    header: 'Risk %',
    className: 'text-center',
    cell: trade => <span className="block text-center">{trade.riskPercent}%</span>,
  },
  {
    key: 'entryPrice',
    header: 'Entry Price',
    className: 'text-right',
    cell: trade => <span className="block text-right">{formatCurrency(trade.entryPrice)}</span>,
  },
  {
    key: 'exitPrice',
    header: 'Exit Price',
    className: 'text-right',
    cell: trade => <span className="block text-right">{formatCurrency(trade.exitPrice)}</span>,
  },

  {
    key: 'stopLoss',
    header: 'Stop Loss',
    className: 'text-right',
    cell: trade => <span className="block text-right">{formatCurrency(trade.stopLoss)}</span>,
  },
  {
    key: 'positionSize',
    header: 'Size',
    className: 'text-center',
    cell: trade => <span className="block text-center">{trade.positionSize}</span>,
  },
  {
    key: 'leverage',
    header: 'Leverage',
    className: 'text-center',
    cell: trade => <span className="block text-center">{trade.leverage || 'N/A'}</span>,
  },
  {
    key: 'investment',
    header: 'Investment',
    className: 'text-right',
    cell: trade =>
      trade.investment ? (
        <span className="block text-right">{formatCurrency(trade.investment)}</span>
      ) : (
        <span className="block text-right">N/A</span>
      ),
  },
  {
    key: 'commission',
    header: 'Commission',
    className: 'text-center',
    cell: trade => <span className="block text-center">{formatCurrency(trade.commission)}</span>,
  },
  {
    key: 'result',
    header: 'Result',
    className: 'text-center',
    cell: trade => (
      <span
        className={`block text-center px-2 py-1 rounded-full text-xs font-medium ${getResultColorClass(trade.result)}`}
      >
        {trade.result.toLowerCase()}
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    className: 'text-center',
    cell: trade => (
      <span
        className={`block text-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColorClass(trade.category)}`}
      >
        {trade.category}
      </span>
    ),
  },
];
