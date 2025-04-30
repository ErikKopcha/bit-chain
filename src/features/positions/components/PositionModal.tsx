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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PositionFormValues,
  positionSchema,
  Trade,
  TRADE_CATEGORIES,
  TRADE_RESULTS,
  TRADE_SIDES,
} from '../types/position';
import { PositionFormFields } from './PositionFormFields';

interface PositionModalProps {
  position?: Trade;
  onSave: (position: Trade) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export function PositionModal({ position, onSave, onDelete, children }: PositionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: position
      ? {
          date: position.date,
          symbol: position.symbol,
          side: position.side,
          entryPrice: position.entryPrice,
          positionSize: position.positionSize,
          stopLoss: position.stopLoss,
          exitPrice: position.exitPrice,
          commission: position.commission,
          category: position.category,
          deposit: position.deposit,
          leverage: position.leverage || 1,
        }
      : {
          date: new Date(),
          symbol: '',
          side: TRADE_SIDES.LONG,
          category: TRADE_CATEGORIES.SOLO,
          leverage: 1,
        },
  });

  const handleSubmit = (values: PositionFormValues) => {
    onSave({
      id: position?.id || 'new',
      ...position,
      ...values,
      stopLoss: values.stopLoss || 0,
      exitPrice: values.exitPrice || 0,
      commission: values.commission || 0,
      deposit: values.deposit,
      leverage: values.leverage || 1,
      riskPercent: position?.riskPercent || 0,
      pnl: position?.pnl || 0,
      result: position?.result || TRADE_RESULTS.PENDING,
      investment: 0,
    });
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && position) {
      form.reset({
        date: position.date,
        symbol: position.symbol,
        side: position.side,
        entryPrice: position.entryPrice,
        positionSize: position.positionSize,
        stopLoss: position.stopLoss,
        exitPrice: position.exitPrice,
        commission: position.commission,
        category: position.category,
        deposit: position.deposit,
        leverage: position.leverage || 1,
      });
    } else {
      form.reset();
    }
  }, [isOpen, position, form]);

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
