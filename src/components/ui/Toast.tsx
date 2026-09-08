import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }].slice(-3));
    const duration = t.type === 'error' ? 10000 : t.type === 'warning' ? 6000 : 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm hidden sm:flex">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 sm:hidden">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-success-500" />,
    error: <AlertCircle className="w-4 h-4 text-danger-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-accent-500" />,
    info: <Info className="w-4 h-4 text-primary-500" />,
  };
  const dotColors = {
    success: 'bg-success-500',
    error: 'bg-danger-500',
    warning: 'bg-accent-500',
    info: 'bg-primary-500',
  };
  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className="bg-surface border border-subtle rounded-xl shadow-lg p-3.5 flex items-start gap-3 animate-slide-up"
    >
      <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', dotColors[toast.type])} />
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-primary">{toast.title}</p>
        {toast.description && <p className="text-xs text-secondary mt-0.5">{toast.description}</p>}
        {toast.action && (
          <button
            onClick={() => { toast.action!.onClick(); onDismiss(); }}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline mt-1.5"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button onClick={onDismiss} className="text-muted hover:text-primary transition-fast shrink-0" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
