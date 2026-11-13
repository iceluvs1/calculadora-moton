'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isIPhone } from '@/lib/iphone';
import { cn } from '@/lib/utils';

type CalculatorSelectProps<Value extends string> = {
  id?: string;
  ariaLabel?: string;
  className: string;
  value: Value | null;
  onValueChange: (value: Value | null) => void;
  options: readonly { value: Value; label: string }[];
  placeholder?: string;
  icon?: ReactNode;
};

export function CalculatorSelect<Value extends string>({
  id,
  ariaLabel,
  className,
  value,
  onValueChange,
  options,
  placeholder,
  icon,
}: CalculatorSelectProps<Value>) {
  const [nativePicker, setNativePicker] = useState(false);
  useEffect(() => {
    setNativePicker(isIPhone(navigator.userAgent, navigator.platform));
  }, []);

  if (nativePicker) {
    return (
      <div className={cn('relative', className)}>
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </span>
        )}
        {/* Al tocar el control HTML directamente, iOS abre su menú nativo. */}
        <select
          id={id}
          aria-label={ariaLabel}
          className={cn(
            'h-12 w-full min-w-0 appearance-none truncate rounded-xl border border-input bg-background py-2 pr-8 text-base font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            icon ? 'pl-9' : 'pl-3',
            value === null && 'text-muted-foreground',
          )}
          value={value ?? ''}
          onChange={(event) => {
            const selected = event.currentTarget.value;
            onValueChange(selected === '' ? null : (selected as Value));
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <Select<Value> value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          'h-12 rounded-xl bg-background px-3 text-base font-semibold',
          className,
        )}
      >
        {icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
