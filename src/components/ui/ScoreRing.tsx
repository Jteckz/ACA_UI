import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ScoreRing({ score, size = 36, strokeWidth = 3, className, label }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'var(--color-danger-500)' : score >= 40 ? 'var(--color-accent-500)' : 'var(--color-secondary-400)';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-smooth"
          style={{ transitionDuration: '480ms' }}
        />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums text-primary" style={{ fontSize: size < 40 ? 10 : 12 }}>
        {score}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
}

export function ScoreBar({ score, max = 100, label, showValue = true, color }: ScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const barColor = color || (score >= 70 ? 'bg-danger-500' : score >= 40 ? 'bg-accent-500' : 'bg-secondary-400');
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-secondary">{label}</span>
          {showValue && <span className="text-xs font-medium tabular-nums text-secondary">{score}</span>}
        </div>
      )}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-smooth', barColor)}
          style={{ width: `${pct}%`, transitionDuration: '480ms' }}
        />
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ segments, size = 120, strokeWidth = 12, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
        {total > 0 && segments.map((seg, i) => {
          const len = (seg.value / total) * circumference;
          const circle = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              className="transition-smooth"
              style={{ transitionDuration: '480ms' }}
            />
          );
          offset += len;
          return circle;
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute flex flex-col items-center">
          {centerValue && <span className="text-lg font-semibold tabular-nums text-primary">{centerValue}</span>}
          {centerLabel && <span className="text-[10px] text-muted uppercase tracking-wide">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
