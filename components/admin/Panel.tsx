export function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 border-b border-line pb-5">
      <h1 className="text-xl font-medium">
        <span className="font-mono text-muted">{"// "}</span>
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 text-sm text-muted">{description}</p>
      )}
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-panel/50 p-5 sm:p-6">
      {children}
    </div>
  );
}

/** Collapsed row that opens into an edit form. No client JS involved. */
export function Row({
  title,
  meta,
  children,
  defaultOpen,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-line bg-panel/50 transition-colors open:border-line-2"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4">
        <span className="font-mono text-xs text-line-2 transition-transform group-open:rotate-90">
          ▸
        </span>
        <span className="text-sm font-medium">{title}</span>
        {meta && (
          <span className="ml-auto font-mono text-xs text-line-2">{meta}</span>
        )}
      </summary>
      <div className="border-t border-line px-5 py-5">{children}</div>
    </details>
  );
}

export function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
      {children}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
      {children}
    </p>
  );
}
