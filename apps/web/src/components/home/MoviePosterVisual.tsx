import { cn } from './home-utils';

export type MoviePosterVisualProps = {
  gradient: string;
  label?: string;
  className?: string;
};

export function MoviePosterVisual({ gradient, label, className = '' }: MoviePosterVisualProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-gradient-to-br', gradient, className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_28%),linear-gradient(to_top,rgba(0,0,0,0.42),transparent_60%)]" />
      {label ? <span className="absolute bottom-2 left-2 right-2 text-[10px] font-extrabold text-white drop-shadow">{label}</span> : null}
    </div>
  );
}
