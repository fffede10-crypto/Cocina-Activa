interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color = 'bg-stone-100 text-stone-700', size = 'md' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${color}`}>
      {label}
    </span>
  );
}
