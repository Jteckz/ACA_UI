import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] font-medium text-secondary mb-1.5">
            {label}{props.required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
          <input
            ref={ref}
            className={cn(
              'w-full h-9 px-3 text-sm bg-surface border rounded-lg transition-fast',
              'placeholder:text-muted text-primary',
              error ? 'border-danger-500 ring-2 ring-danger-500/10' : 'border-strong focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10',
              icon ? 'pl-9' : '',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
        {helpText && !error && <p className="text-xs text-muted mt-1">{helpText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  showCount?: boolean;
  minChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, showCount, minChars, className, value, ...props }, ref) => {
    const len = typeof value === 'string' ? value.length : 0;
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] font-medium text-secondary mb-1.5">
            {label}{props.required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          className={cn(
            'w-full min-h-[96px] px-3 py-2 text-sm font-mono bg-surface border rounded-lg transition-fast resize-y',
            'placeholder:text-muted text-primary',
            error ? 'border-danger-500 ring-2 ring-danger-500/10' : 'border-strong focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        <div className="flex items-center justify-between mt-1">
          {error ? <p className="text-xs text-danger-500">{error}</p> : helpText ? <p className="text-xs text-muted">{helpText}</p> : <span />}
          {showCount && (
            <span className={cn('text-xs tabular-nums', len < (minChars || 0) ? 'text-accent-500' : 'text-muted')}>
              {len} {minChars ? `/ min ${minChars}` : ''}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
  searchable?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] font-medium text-secondary mb-1.5">
            {label}{props.required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-9 pl-3 pr-9 text-sm bg-surface border rounded-lg transition-fast appearance-none cursor-pointer',
              'text-primary',
              error ? 'border-danger-500' : 'border-strong focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>
        {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
        {helpText && !error && <p className="text-xs text-muted mt-1">{helpText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ onClear, className, value, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        value={value}
        className={cn(
          'w-full h-9 pl-9 pr-9 text-sm bg-subtle border border-subtle rounded-lg transition-fast',
          'placeholder:text-muted text-primary focus:border-strong focus:bg-surface',
          className
        )}
        {...props}
      />
      {value && (
        <button onClick={onClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-fast" aria-label="Clear search">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-smooth shrink-0',
          checked ? 'bg-primary-600 dark:bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-700'
        )}
        disabled={disabled}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-smooth',
            checked && 'translate-x-4'
          )}
        />
      </button>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-primary">{label}</span>}
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
      )}
    </label>
  );
}

interface FilterPillsProps {
  options: { value: string; label: string; count?: number; dotClass?: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, value, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-full transition-fast',
            value === opt.value
              ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/30'
              : 'bg-subtle text-secondary border border-subtle hover:bg-muted hover:border-strong'
          )}
        >
          {opt.dotClass && <span className={cn('w-1.5 h-1.5 rounded-full', opt.dotClass)} />}
          {opt.label}
          {opt.count !== undefined && <span className="tabular-nums text-muted">{opt.count}</span>}
        </button>
      ))}
    </div>
  );
}
