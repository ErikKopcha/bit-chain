import {
  Trade,
  TRADE_CATEGORIES,
  TRADE_CATEGORIES_LIST,
  TRADE_SIDES,
  TRADE_SIDES_LIST,
} from '@/app/(protected)/journal/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type PositionFormValues = {
  date: Date;
  symbol: string;
  side: TRADE_SIDES;
  entryPrice: number;
  positionSize: number;
  stopLoss?: number;
  exitPrice?: number;
  commission?: number;
  category: TRADE_CATEGORIES;
  totalDeposit: number;
};

const positionSchema = z.object({
  date: z.date(),
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.nativeEnum(TRADE_SIDES),
  entryPrice: z.preprocess(val => Number(val), z.number().positive('Entry price must be positive')),
  positionSize: z.preprocess(
    val => Number(val ?? 0),
    z.number().positive('Position size must be positive'),
  ),
  stopLoss: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().positive('Stop loss must be positive').optional(),
  ),
  exitPrice: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().positive('Exit price must be positive').optional(),
  ),
  commission: z.preprocess(
    val => (!val ? undefined : Number(val ?? 0)),
    z.number().min(0, 'Commission must be positive').optional(),
  ),
  category: z.nativeEnum(TRADE_CATEGORIES),
  totalDeposit: z.preprocess(
    val => Number(val ?? 0),
    z.number().positive('Total deposit must be positive'),
  ),
}) as z.ZodType<PositionFormValues>;

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRADE_SIDES_LIST.map(side => (
                          <SelectItem key={side} value={side}>
                            {side.charAt(0).toUpperCase() + side.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Size</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRADE_CATEGORIES_LIST.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Deposit</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
