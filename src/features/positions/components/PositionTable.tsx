import { columns } from '@/app/(protected)/journal/config/columns';
import { Trade } from '@/app/(protected)/journal/types';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { PositionModal } from './PositionModal';

interface PositionTableProps {
  trades: Trade[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onEdit: (position: Partial<Trade>) => void;
  onDelete: (trade: Trade) => () => void;
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
}: PositionTableProps) {
  return (
    <div className="p-4 bg-white flex flex-col gap-4 justify-between items-start md:items-center">
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
          {trades.length > 0 ? (
            trades.map(trade => (
              <TableRow key={trade.id}>
                {columns.map(column => (
                  <TableCell key={`${trade.id}-${column.key}`}>{column.cell(trade)}</TableCell>
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
        <div className="p-4 border-t w-full">
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
