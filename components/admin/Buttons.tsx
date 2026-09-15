"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Save" }: { children?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!confirm("Delete this permanently?")) event.preventDefault();
      }}
      className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-[#ff6b6b]/50 hover:text-[#ff6b6b] disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
