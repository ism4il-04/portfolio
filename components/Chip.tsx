export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-panel-2/60 px-2.5 py-1 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent">
      {children}
    </span>
  );
}
