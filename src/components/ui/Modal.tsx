import { type ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  hint?: string;
  variant?: 'default' | 'danger';
}

export function Modal({ open, onClose, title, description, children, footer, hint, variant = 'default' }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface rounded-2xl shadow-modal w-full max-w-md animate-spring-in flex flex-col max-h-[90vh]"
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <h2 className={cn('text-base font-semibold', variant === 'danger' && 'text-danger-600 dark:text-danger-500')}>{title}</h2>
            {description && <p className="text-[13px] text-secondary mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary transition-fast p-1 -mr-1 rounded-md" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-2 overflow-y-auto">{children}</div>
        {(footer || hint) && (
          <div className="flex items-center justify-between gap-3 p-5 pt-3 border-t border-subtle">
            {hint ? <span className="text-xs text-muted flex-1">{hint}</span> : <span className="flex-1" />}
            <div className="flex items-center gap-2">{footer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  hint?: string;
  children?: ReactNode;
}

export function ConfirmModal({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'default', hint, children,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      hint={hint}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} size="sm" onClick={() => { onConfirm(); onClose(); }} autoFocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
