import { useToast } from '@/components/ui/use-toast';
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCreatePosition = () => {
  const { toast } = useToast();

  const create = async (position: Trade) => {
    const newPosition = await createPosition(position);
    return newPosition;
  };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast({
        title: 'Position created',
        description: 'Your position has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create position. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePosition = () => {
  const { toast } = useToast();

  const update = async (position: Trade) => {
    const updatedPosition = await updatePosition(position.id, position);
    return updatedPosition;
  };

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast({
        title: 'Position updated',
        description: 'Your position has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update position. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePosition = () => {
  const { toast } = useToast();

  const onDelete = async (position: Trade) => {
    const deletedPosition = await deletePosition(position.id);
    return deletedPosition;
  };

  return useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      toast({
        title: 'Position deleted',
        description: 'Your position has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete position. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
