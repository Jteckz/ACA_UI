import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'elevated' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variants: Record<Variant, string> = {
      default: 'bg-surface border border-subtle rounded-xl shadow-card',
      elevated: 'bg-surface rounded-xl shadow-popover',
      interactive: 'bg-surface border border-subtle rounded-xl shadow-card hover:shadow-popover hover:border-strong hover:-translate-y-px transition-smooth cursor-pointer',
    };
    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
