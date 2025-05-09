import { useColumns } from '@/app/(protected)/journal/config/columns';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableLoadingBar } from '@/components/ui/table-loading-bar';
import { Pencil, Trash2 } from 'lucide-react';
import { Trade } from '../types/position';
import { PositionModal } from './PositionModal';

interface PositionTableProps {
  trades: Trade[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onEdit: (position: Partial<Trade>) => Promise<void>;
  onDelete: (trade: Trade) => () => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

export function PositionTable({
  trades,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  isLoading = false,
  isFetching = false,
}: PositionTableProps) {
  const columns = useColumns();

  return (
    <div className="pb-4 flex flex-col gap-4 justify-between items-start md:items-center overflow-hidden">
      <div className="w-full relative pt-4">
        <TableLoadingBar isLoading={isFetching} className="absolute top-0 left-0 right-0 z-10" />
        <div className="w-full px-4">
          <div className="max-h-[350px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  {columns.map(column => (
                    <TableHead key={column.key} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  // Skeleton loader rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {columns.map(column => (
                        <TableCell key={`skeleton-${index}-${column.key}`}>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  trades.length > 0 &&
                  trades.map(trade => (
                    <TableRow key={trade.id}>
                      {columns.map(column => (
                        <TableCell key={`${trade.id}-${column.key}`}>
                          {column.cell(trade)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex">
                          <PositionModal position={trade} onSave={onEdit}>
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
                  ))}
                {!isLoading && trades.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      No trades match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {trades.length > 0 && !isLoading && (
        <div className="pt-4 border-t w-full">
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
