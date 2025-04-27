'use client';

import { columns } from '@/app/(protected)/journal/config/columns';
import { sampleTrades } from '@/app/(protected)/journal/data/sampleTrades';
import { usePagination } from '@/app/(protected)/journal/hooks/usePagination';
import {
  Trade,
  TRADE_CATEGORIES,
  TRADE_CATEGORIES_LIST,
  TRADE_RESULTS,
  TRADE_RESULTS_LIST,
  TRADE_SIDES,
  TRADE_SIDES_LIST,
} from '@/app/(protected)/journal/types';
import { formatCurrency } from '@/app/(protected)/journal/utils/formatters';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { calculatePnl, calculateRiskPercent } from '../utils/calculations';
import { DeletePositionDialog } from './DeletePositionDialog';
import { PositionModal } from './PositionModal';

export default function TablePositions() {
  const searchParams = useSearchParams();
  const [trades, setTrades] = useState<Trade[]>(sampleTrades);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Trade | null>(null);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(trades, searchParams);

  const stats = {
    totalTrades: trades.length,
    winTrades: trades.filter(t => t.result === 'win').length,
    lossTrades: trades.filter(t => t.result === 'loss').length,
    totalPnl: trades.reduce((sum, t) => sum + t.pnl, 0),
    winRate:
      trades.length > 0
        ? ((trades.filter(t => t.result === 'win').length / trades.length) * 100).toFixed(2)
        : '0.00',
  };

  // Date range filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Dropdown filters
  const [sideFilter, setSideFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [resultFilter, setResultFilter] = useState<string | undefined>(undefined);

  const handleSideFilterChange = (value: string) => {
    setSideFilter(value === 'all' ? undefined : value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === 'all' ? undefined : value);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value === 'all' ? undefined : value);
  };

  const handleCreatePosition = (position: Partial<Trade>) => {
    const newPosition: Trade = {
      date: position.date ?? new Date(),
      symbol: position.symbol ?? '',
      side: position.side ?? TRADE_SIDES.LONG,
      entryPrice: position.entryPrice ?? 0,
      positionSize: position.positionSize ?? 0,
      stopLoss: position.stopLoss ?? 0,
      exitPrice: position.exitPrice ?? 0,
      commission: position.commission ?? 0,
      category: position.category ?? TRADE_CATEGORIES.SOLO,
      id: Math.random().toString(36).substr(2, 9),
      pnl: 0,
      result: TRADE_RESULTS.PENDING,
      riskPercent: 0,
      totalDeposit: position.totalDeposit ?? 500,
    };
    setTrades([...trades, newPosition]);
  };

  const handleEditPosition = (position: Partial<Trade>) => {
    const currentTrade = trades.find(t => t.id === positionToDelete?.id);
    if (!currentTrade) return;
    setTrades(
      trades.map(t =>
        t.id === currentTrade.id
          ? {
              ...currentTrade,
              ...position,
              date: position.date ?? currentTrade.date,
              symbol: position.symbol ?? currentTrade.symbol,
              side: position.side ?? currentTrade.side,
              entryPrice: position.entryPrice ?? currentTrade.entryPrice,
              positionSize: position.positionSize ?? currentTrade.positionSize,
              stopLoss: position.stopLoss ?? currentTrade.stopLoss,
              exitPrice: position.exitPrice ?? currentTrade.exitPrice,
              commission: position.commission ?? currentTrade.commission,
              category: position.category ?? currentTrade.category,
              leverage: position.leverage ?? currentTrade.leverage,
              investment: position.investment ?? currentTrade.investment,
              totalDeposit: position.totalDeposit ?? currentTrade.totalDeposit,
              // Calculate PnL based on position data
              pnl: calculatePnl(
                position.side ?? currentTrade.side,
                position.entryPrice ?? currentTrade.entryPrice,
                position.exitPrice ?? currentTrade.exitPrice,
                position.positionSize ?? currentTrade.positionSize,
                position.commission ?? currentTrade.commission,
              ),
              // Determine result based on PnL
              result:
                calculatePnl(
                  position.side ?? currentTrade.side,
                  position.entryPrice ?? currentTrade.entryPrice,
                  position.exitPrice ?? currentTrade.exitPrice,
                  position.positionSize ?? currentTrade.positionSize,
                  position.commission ?? currentTrade.commission,
                ) > 0
                  ? TRADE_RESULTS.WIN
                  : position.exitPrice
                    ? TRADE_RESULTS.LOSS
                    : TRADE_RESULTS.PENDING,
              // Calculate risk percent based on entry, stop loss and position size
              riskPercent: calculateRiskPercent(
                position.side ?? currentTrade.side,
                position.entryPrice ?? currentTrade.entryPrice,
                position.stopLoss ?? currentTrade.stopLoss,
                position.positionSize ?? currentTrade.positionSize,
                position.totalDeposit ?? currentTrade.totalDeposit,
              ),
            }
          : t,
      ),
    );
  };

  const handleDeletePosition = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const onDelete = useCallback(
    (trade: Trade) => () => {
      setPositionToDelete(trade);
      setDeleteDialogOpen(true);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage and analyze your trading history</p>
          <PositionModal onSave={handleCreatePosition}>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </PositionModal>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-muted-foreground">Win Trades</p>
          <p className="text-2xl font-bold text-green-600">{stats.winTrades}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-muted-foreground">Loss Trades</p>
          <p className="text-2xl font-bold text-red-600">{stats.lossTrades}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold">{stats.winRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-muted-foreground">Total P/L</p>
          <p
            className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(stats.totalPnl)}
          </p>
        </div>
      </div>

      <div className="border rounded-md shadow">
        <div className="p-4 bg-white border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="col-span-1 md:col-span-1">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="All time"
              />
            </div>

            <Select value={sideFilter} onValueChange={handleSideFilterChange}>
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sides</SelectItem>
                {TRADE_SIDES_LIST.map(side => (
                  <SelectItem key={side} value={side}>
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {TRADE_CATEGORIES_LIST.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={resultFilter} onValueChange={handleResultFilterChange}>
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All results</SelectItem>
                {TRADE_RESULTS_LIST.map(result => (
                  <SelectItem key={result} value={result}>
                    {result.charAt(0).toUpperCase() + result.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTrades.length > 0 ? (
              paginatedTrades.map(trade => (
                <TableRow key={trade.id}>
                  {columns.map(column => (
                    <TableCell key={`${trade.id}-${column.key}`}>{column.cell(trade)}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex">
                      <PositionModal position={trade} onSave={handleEditPosition}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </PositionModal>
                      <Button variant="ghost" size="icon" onClick={onDelete(trade)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No trades match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {trades.length > 0 && (
          <div className="p-4 border-t">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      {positionToDelete && (
        <DeletePositionDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setPositionToDelete(null);
          }}
          onConfirm={() => handleDeletePosition(positionToDelete.id)}
          positionSymbol={positionToDelete.symbol}
        />
      )}
    </div>
  );
}
