import { useCallback } from 'react';
import {
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useUpdatePosition,
} from '../queries/positions';
import { Trade } from '../types/position';

export const useTradeData = () => {
  const { data: trades, refetch, isLoading } = usePositions();
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const { mutateAsync: deletePosition } = useDeletePosition();

  const handleCreatePosition = useCallback(
    async (position: Omit<Trade, 'id' | 'pnl' | 'result' | 'riskPercent'>) => {
      const newTrade = await createPosition(position as Trade);
      await refetch();
      return newTrade;
    },
    [createPosition, refetch],
  );

  const handleEditPosition = useCallback(
    async (position: Partial<Trade>) => {
      const updatedTrade = await updatePosition(position as Trade);
      await refetch();
      return updatedTrade;
    },
    [updatePosition, refetch],
  );

  const handleDeletePosition = useCallback(
    async (id: string) => {
      await deletePosition({ id } as Trade);
      await refetch();
    },
    [deletePosition, refetch],
  );

  return {
    trades: trades || [],
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    isLoading,
  };
};
