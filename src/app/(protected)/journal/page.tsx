'use client';

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
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { columns } from './config/columns';
import { sampleTrades } from './data/sampleTrades';
import { usePagination } from './hooks/usePagination';
import { TRADE_CATEGORIES_LIST, TRADE_RESULTS_LIST, TRADE_SIDES_LIST } from './types';
import { formatCurrency } from './utils/formatters';

export default function JournalPage() {
  const searchParams = useSearchParams();

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(sampleTrades, searchParams);

  const stats = {
    totalTrades: sampleTrades.length,
    winTrades: sampleTrades.filter(t => t.result === 'win').length,
    lossTrades: sampleTrades.filter(t => t.result === 'loss').length,
    totalPnl: sampleTrades.reduce((sum, t) => sum + t.pnl, 0),
    winRate:
      sampleTrades.length > 0
        ? (
            (sampleTrades.filter(t => t.result === 'win').length / sampleTrades.length) *
            100
          ).toFixed(2)
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

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Manage and analyze your trading history</p>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTrades.length > 0 ? (
              paginatedTrades.map(trade => (
                <TableRow key={trade.id}>
                  {columns.map(column => (
                    <TableCell key={`${trade.id}-${column.key}`}>{column.cell(trade)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No trades match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {sampleTrades.length > 0 && (
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
    </div>
  );
}
