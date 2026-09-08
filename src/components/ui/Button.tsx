import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading = false, icon, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-smooth select-none whitespace-nowrap';
    const variants: Record<Variant, string> = {
      primary: 'bg-primary-600 text-white shadow-xs hover:bg-primary-500 active:scale-[0.97] dark:bg-primary-500 dark:hover:bg-primary-400',
      secondary: 'bg-surface text-secondary border border-strong hover:bg-subtle active:scale-[0.98]',
      danger: 'bg-danger-600 text-white shadow-xs hover:bg-danger-500 active:scale-[0.97] dark:bg-danger-500 dark:hover:bg-danger-600',
      ghost: 'text-secondary hover:bg-muted active:scale-[0.98]',
      link: 'text-primary-600 dark:text-primary-400 hover:underline underline-offset-3',
    };
    const sizes: Record<Size, string> = {
      sm: 'h-8 px-3 text-[13px]',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-base',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
