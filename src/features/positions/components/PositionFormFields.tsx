import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PositionFormValues, TRADE_CATEGORIES_LIST, TRADE_SIDES_LIST } from '../types/position';
import { parseFormattedNumber } from '../utils/calculations';
import { HelpTooltip } from './HelpTooltip';

interface PositionFormFieldsProps {
  form: UseFormReturn<PositionFormValues>;
}

// Helper function for handling numeric input with decimal support
const handleDecimalInput = (value: string): string => {
  // Allow only numbers, decimal points, and commas
  const cleanValue = value.replace(/[^\d.,]/g, '');
  // Replace all commas with dots and ensure only one decimal point
  const parts = cleanValue.split(/[.,]/);
  const integerPart = parts[0] || '';
  if (parts.length > 1) {
    return integerPart + '.' + parts.slice(1).join('');
  }
  return integerPart;
};

// Format a numeric string with spaces as thousand separators, preserving decimal part
const formatWithSpaces = (value: string): string => {
  if (!value) return '';
  const parts = value.split('.');
  const integerPart = parts[0] || '0';
  // Remove leading zeros except for '0.'
  const cleanedInteger = integerPart.replace(/^0+(?!$)/, '');
  const formattedInteger = cleanedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length > 1) {
    return `${formattedInteger}.${parts[1]}`;
  }
  return formattedInteger;
};

export function PositionFormFields({ form }: PositionFormFieldsProps) {
  // Track the raw text input values before parsing to numbers
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

  // Set initial raw values when form values change
  useEffect(() => {
    const formValues = form.getValues();
    const initialRawInputs: Record<string, string> = {};

    Object.keys(formValues).forEach(key => {
      const value = formValues[key as keyof PositionFormValues];
      if (typeof value === 'number') {
        initialRawInputs[key] = value.toString();
      }
    });

    setRawInputs(prev => ({ ...prev, ...initialRawInputs }));
  }, [form]);

  // Custom handling for numeric fields to preserve decimal point and format with spaces
  const handleNumericFieldChange = (name: keyof PositionFormValues, value: string) => {
    // Clean and format value
    const processedValue = handleDecimalInput(value);
    const formattedValue = formatWithSpaces(processedValue);
    setRawInputs(prev => ({ ...prev, [name]: formattedValue }));
    // Parse number for form
    if (processedValue) {
      const numericValue = parseFormattedNumber(processedValue);
      form.setValue(name, numericValue);
    } else {
      form.setValue(name, undefined);
    }
  };

  // Handle focus/blur for formatting
  const handleFocus = (name: string) => {
    setIsFocused(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: keyof PositionFormValues) => {
    setIsFocused(prev => ({ ...prev, [name]: false }));

    // Format the value with spaces when blurring
    const rawValue = rawInputs[name] || '';
    if (rawValue) {
      // Format with spaces on blur
      const formattedValue = formatWithSpaces(rawValue);
      setRawInputs(prev => ({ ...prev, [name]: formattedValue }));
    }
  };

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
        render={({ field }) => {
          const fieldName = 'entryPrice';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? formatWithSpaces(String(field.value))
                : '';
          return (
            <FormItem>
              <FormLabel>Entry Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => handleNumericFieldChange(fieldName, e.target.value)}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="positionSize"
        render={({ field }) => {
          const fieldName = 'positionSize';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Position Size</FormLabel>
                <HelpTooltip text="Enter the amount of cryptocurrency you bought (e.g., 0.32 BTC)" />
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="stopLoss"
        render={({ field }) => {
          const fieldName = 'stopLoss';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Stop Loss</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="leverage"
        render={({ field }) => {
          const fieldName = 'leverage';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Leverage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="exitPrice"
        render={({ field }) => {
          const fieldName = 'exitPrice';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Exit Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="commission"
        render={({ field }) => {
          const fieldName = 'commission';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Commission</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
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
        render={({ field }) => {
          const fieldName = 'deposit';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Total Deposit</FormLabel>
                <HelpTooltip text="Enter your total account deposit to calculate risk percentage relative to stop loss" />
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onFocus={() => handleFocus(fieldName)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
