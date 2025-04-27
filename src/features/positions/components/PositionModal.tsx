import { Trade, TRADE_CATEGORIES, TRADE_SIDES } from '@/app/(protected)/journal/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PositionFormValues, positionSchema } from '../types/position';
import { PositionFormFields } from './PositionFormFields';

interface PositionModalProps {
  position?: Trade;
  onSave: (position: Omit<Trade, 'id' | 'pnl' | 'result' | 'riskPercent'>) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export function PositionModal({ position, onSave, onDelete, children }: PositionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: position || {
      date: new Date(),
      symbol: '',
      side: TRADE_SIDES.LONG,
      category: TRADE_CATEGORIES.SOLO,
    },
  });

  const handleSubmit = (values: PositionFormValues) => {
    onSave({
      ...values,
      stopLoss: values.stopLoss || 0,
      exitPrice: values.exitPrice || 0,
      commission: values.commission || 0,
      totalDeposit: values.totalDeposit || 500,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{position ? 'Edit Position' : 'Create Position'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <PositionFormFields form={form} />
            <div className="flex justify-end gap-2">
              {position && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
