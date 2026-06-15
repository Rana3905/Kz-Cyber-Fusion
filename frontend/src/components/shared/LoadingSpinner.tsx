interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-2 border-cyber-border border-t-cyber-green animate-spin`}
      />
      {label && <span className="font-mono text-xs text-gray-400">{label}</span>}
    </div>
  );
}
