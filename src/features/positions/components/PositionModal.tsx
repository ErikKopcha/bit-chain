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
import { Loader2 } from 'lucide-react';
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
  onSave: (position: Trade) => Promise<void>;
  onDelete?: () => Promise<void>;
  children: React.ReactNode;
}

export function PositionModal({ position, onSave, onDelete, children }: PositionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues: position
      ? {
          date: position.date,
          symbol: position.symbol,
          side: position.side,
          entryPrice: position.entryPrice,
          positionSize: position.positionSize,
          stopLoss: position.stopLoss || 0,
          exitPrice: position.exitPrice || 0,
          commission: position.commission || 0,
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

  const handleSubmit = async (values: PositionFormValues) => {
    try {
      setIsLoading(true);
      await onSave({
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
        id: position?.id || '',
      });
      setIsOpen(false);
    } catch {
      // Error is handled in queries
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsLoading(true);
      await onDelete();
      setIsOpen(false);
    } catch {
      // Error is handled in queries
    } finally {
      setIsLoading(false);
    }
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
