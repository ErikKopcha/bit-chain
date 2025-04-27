import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeletePositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  positionSymbol: string;
}

export function DeletePositionDialog({
  isOpen,
  onClose,
  onConfirm,
  positionSymbol,
}: DeletePositionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Position</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the position for {positionSymbol}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
