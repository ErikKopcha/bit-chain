'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { usePositions } from '../hooks/usePositions';
import { DeletePositionDialog } from './DeletePositionDialog';
import { PositionFilters } from './PositionFilters';
import { PositionModal } from './PositionModal';
import { PositionStats } from './PositionStats';
import { PositionTable } from './PositionTable';

export default function TablePositionsContainer() {
  const {
    trades,
    paginatedTrades,
    currentPage,
    totalPages,
    pageSize,
    dateRange,
    sideFilter,
    categoryFilter,
    resultFilter,
    deleteDialogOpen,
    positionToDelete,
    handlePageChange,
    handlePageSizeChangeString,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
    setDateRange,
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    onDelete,
    setDeleteDialogOpen,
    setPositionToDelete,
  } = usePositions();

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

      <PositionStats trades={trades} />

      <div className=" rounded-md shadow">
        <div className="p-4 bg-white border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <PositionFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sideFilter={sideFilter}
            onSideFilterChange={handleSideFilterChange}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={handleCategoryFilterChange}
            resultFilter={resultFilter}
            onResultFilterChange={handleResultFilterChange}
          />
        </div>

        <PositionTable
          trades={paginatedTrades}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChangeString}
          onEdit={handleEditPosition}
          onDelete={onDelete}
        />
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
