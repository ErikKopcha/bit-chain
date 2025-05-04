'use client';

import { usePagination } from '@/app/(protected)/journal/hooks/usePagination';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDeleteDialog } from '../hooks/useDeleteDialog';
import { useTradeData } from '../hooks/useTradeData';
import { useTradeFilters } from '../hooks/useTradeFilters';
import { Trade } from '../types/position';
import { DeletePositionDialog } from './DeletePositionDialog';
import { PositionFilters } from './PositionFilters';
import { PositionModal } from './PositionModal';
import { PositionStats } from './PositionStats';
import { PositionTable } from './PositionTable';

export default function PositionsContainer() {
  const searchParams = useSearchParams();

  const {
    dateRange,
    sideFilter,
    categoryFilter,
    resultFilter,
    setDateRange,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
  } = useTradeFilters();

  const {
    filteredTrades,
    handleCreatePosition: handleCreateTrade,
    handleEditPosition: handleEditTrade,
    handleDeletePosition: handleDeleteTrade,
    refetch,
    isLoading,
    isFetching,
  } = useTradeData({
    dateRange,
    sideFilter,
    categoryFilter,
    resultFilter,
  });

  const {
    deleteDialogOpen,
    positionToDelete,
    setDeleteDialogOpen,
    setPositionToDelete,
    onDelete,
    handleDeleteConfirm,
  } = useDeleteDialog();

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredTrades, searchParams);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePosition = async (id: string) => {
    setIsDeleting(true);
    try {
      await handleDeleteTrade(id);
      handleDeleteConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const onCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const handleEditPosition = async (position: Partial<Trade>) => {
    await handleEditTrade(position);
  };

  const handleCreatePosition = async (position: Trade) => {
    await handleCreateTrade(position);
  };

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

      <PositionStats trades={filteredTrades} />

      <div className="shadow">
        <div className="p-4 bg-card border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-t-lg">
          <PositionFilters
            dateRange={dateRange}
            sideFilter={sideFilter}
            categoryFilter={categoryFilter}
            resultFilter={resultFilter}
            onDateRangeChange={setDateRange}
            onSideFilterChange={handleSideFilterChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            onResultFilterChange={handleResultFilterChange}
            onRefetch={refetch}
          />
        </div>

        <div className="bg-card rounded-b-lg overflow-hidden">
          <PositionTable
            trades={paginatedTrades}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditPosition}
            onDelete={onDelete}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>
      </div>

      {positionToDelete && (
        <DeletePositionDialog
          isOpen={deleteDialogOpen}
          onClose={onCloseDeleteDialog}
          onConfirm={() => handleDeletePosition(positionToDelete.id)}
          positionSymbol={positionToDelete.symbol}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
