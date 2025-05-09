import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDefaultCategory } from '@/features/positions/queries/categories';
import { ColumnDef, Trade } from '@/features/positions/types/position';
import { useMemo } from 'react';
import {
  formatCurrency,
  formatDate,
  getCategoryColorClass,
  getResultColorClass,
  getSideColorClass,
} from '../utils/formatters';

export function useColumns() {
  const { data: defaultCategory } = useDefaultCategory();
  const defaultCategoryId = defaultCategory?.id || '';

  return useMemo(() => {
    return [
      {
        key: 'date',
        header: 'Date',
        className: 'w-[100px]',
        cell: (trade: Trade) => formatDate(trade.date),
      },
      {
        key: 'symbol',
        header: 'Symbol',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className="font-medium text-center block">{trade.symbol}</span>
        ),
      },
      {
        key: 'side',
        header: 'Side',
        className: 'text-center',
        cell: (trade: Trade) => (
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
        cell: (trade: Trade) => (
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
        cell: (trade: Trade) => <span className="block text-center">{trade.riskPercent}%</span>,
      },
      {
        key: 'entryPrice',
        header: 'Entry Price',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.entryPrice)}</span>
        ),
      },
      {
        key: 'exitPrice',
        header: 'Exit Price',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.exitPrice)}</span>
        ),
      },

      {
        key: 'stopLoss',
        header: 'Stop Loss',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.stopLoss)}</span>
        ),
      },
      {
        key: 'positionSize',
        header: 'Size',
        className: 'text-center',
        cell: (trade: Trade) => <span className="block text-center">{trade.positionSize}</span>,
      },
      {
        key: 'leverage',
        header: 'Leverage',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className="block text-center">{trade.leverage || 'N/A'}</span>
        ),
      },
      {
        key: 'investment',
        header: 'Investment',
        className: 'text-right',
        cell: (trade: Trade) =>
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
        cell: (trade: Trade) => (
          <span className="block text-center">{formatCurrency(trade.commission)}</span>
        ),
      },
      {
        key: 'result',
        header: 'Result',
        className: 'text-center',
        cell: (trade: Trade) => (
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
        cell: (trade: Trade) => {
          const categoryName = trade.category.name;
          const categoryId = trade.category.id;

          return (
            <span
              className={`block text-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColorClass(
                categoryName,
                categoryId,
                defaultCategoryId,
              )}`}
            >
              {categoryName}
            </span>
          );
        },
      },
      {
        key: 'comment',
        header: 'Comment',
        className: 'max-w-[100px]',
        cell: (trade: Trade) =>
          trade.comment ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[70px] truncate cursor-pointer">{trade.comment}</span>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span className="whitespace-pre-line break-words max-w-xs block">
                  {trade.comment}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            '-'
          ),
      },
    ];
  }, [defaultCategoryId]);
}

// Export dummy columns for type compatibility with existing code
export const columns: ColumnDef<Trade>[] = [];
