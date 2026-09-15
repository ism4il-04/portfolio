import type { Localized, LocalizedList } from "@/lib/schema";

const input =
  "w-full rounded-lg border border-line bg-panel-2/50 px-3 py-2 text-sm text-fg placeholder:text-line-2 transition-colors duration-200 focus:outline-none focus:border-accent";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 font-mono text-xs text-muted"
    >
      {children}
      {hint && <span className="text-line-2">({hint})</span>}
    </label>
  );
}

export function Text({
  name,
  label,
  defaultValue,
  placeholder,
  required,
  hint,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={input}
      />
    </div>
  );
}

export function Number_({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type="number"
        defaultValue={defaultValue ?? 0}
        className={`${input} max-w-28`}
      />
    </div>
  );
}

export function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean | null;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-muted select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked ?? false}
        className="size-4 rounded border-line bg-panel-2 accent-accent"
      />
      {label}
    </label>
  );
}

export function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? options[0]}
        className={input}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-panel">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/** FR and EN single-line inputs side by side. */
export function LocalizedText({
  name,
  label,
  value,
  required,
}: {
  name: string;
  label: string;
  value?: Localized | null;
  required?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["fr", "en"] as const).map((locale) => (
          <div key={locale} className="flex items-center gap-2">
            <span className="w-6 shrink-0 font-mono text-[10px] text-line-2 uppercase">
              {locale}
            </span>
            <input
              name={`${name}.${locale}`}
              required={required}
              defaultValue={value?.[locale] ?? ""}
              className={input}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function LocalizedArea({
  name,
  label,
  value,
  rows = 4,
}: {
  name: string;
  label: string;
  value?: Localized | null;
  rows?: number;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["fr", "en"] as const).map((locale) => (
          <div key={locale} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-line-2 uppercase">
              {locale}
            </span>
            <textarea
              name={`${name}.${locale}`}
              rows={rows}
              defaultValue={value?.[locale] ?? ""}
              className={`${input} resize-y`}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

/** FR and EN lists, one item per line. */
export function LocalizedLines({
  name,
  label,
  value,
  rows = 5,
}: {
  name: string;
  label: string;
  value?: LocalizedList | null;
  rows?: number;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <Label hint="one per line">{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["fr", "en"] as const).map((locale) => (
          <div key={locale} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-line-2 uppercase">
              {locale}
            </span>
            <textarea
              name={`${name}.${locale}`}
              rows={rows}
              defaultValue={(value?.[locale] ?? []).join("\n")}
              className={`${input} resize-y`}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function CsvText({
  name,
  label,
  value,
  placeholder,
}: {
  name: string;
  label: string;
  value?: string[] | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} hint="comma separated">
        {label}
      </Label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={(value ?? []).join(", ")}
        className={input}
      />
    </div>
  );
}
