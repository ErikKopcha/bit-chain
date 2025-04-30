import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPosition,
  deletePosition,
  getPositionsByUserId,
  updatePosition,
} from '../api/positions';
import { Trade } from '../types/position';

export const usePositions = () => {
  const getPositions = async () => {
    const positions = await getPositionsByUserId();
    return positions;
  };

  return useQuery({
    queryKey: ['positions'],
    queryFn: getPositions,
  });
};

export const useCreatePosition = () => {
  const create = async (position: Trade) => {
    const newPosition = await createPosition({ ...position });
    return newPosition;
  };

  return useMutation({
    mutationFn: create,
  });
};

export const useUpdatePosition = () => {
  const update = async (position: Trade) => {
    const updatedPosition = await updatePosition(position.id, { ...position });
    return updatedPosition;
  };

  return useMutation({
    mutationFn: update,
  });
};

export const useDeletePosition = () => {
  const onDelete = async (position: Trade) => {
    const deletedPosition = await deletePosition(position.id);
    return deletedPosition;
  };

  return useMutation({
    mutationFn: onDelete,
  });
};
