import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PositionFormValues, TRADE_CATEGORIES_LIST, TRADE_SIDES_LIST } from '../types/position';
import { handleNumericInput } from '../utils/calculations';
import { HelpTooltip } from './HelpTooltip';
interface PositionFormFieldsProps {
  form: UseFormReturn<PositionFormValues>;
}

export function PositionFormFields({ form }: PositionFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <DatePicker
                mode="default"
                date={field.value}
                onDateChange={field.onChange}
                placeholder="All time"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

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
                    {side.toLowerCase()}
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
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
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
            <div className="flex items-center gap-2">
              <FormLabel>Position Size</FormLabel>
              <HelpTooltip text="Enter the amount of cryptocurrency you bought (e.g., 0.32 BTC)" />
            </div>
            <FormControl>
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
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
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="leverage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leverage</FormLabel>
            <FormControl>
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
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
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
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
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
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
                    {category.toLowerCase()}
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
        name="deposit"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Total Deposit</FormLabel>
              <HelpTooltip text="Enter your total account deposit to calculate risk percentage relative to stop loss" />
            </div>
            <FormControl>
              <Input
                {...field}
                onChange={e => {
                  handleNumericInput(e);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
