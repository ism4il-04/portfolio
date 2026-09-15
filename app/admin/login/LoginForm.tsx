"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const INITIAL: LoginState = {};

const fieldClass =
  "w-full rounded-lg border border-line bg-panel-2/50 px-3.5 py-2.5 text-sm text-fg placeholder:text-line-2 transition-colors duration-200 focus:outline-none focus:border-accent";

export function LoginForm({ totpEnabled }: { totpEnabled: boolean }) {
  const [state, action, pending] = useActionState(login, INITIAL);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-mono text-xs text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-mono text-xs text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>

      {totpEnabled && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="totp" className="font-mono text-xs text-muted">
            Authentication code
          </label>
          <input
            id="totp"
            name="totp"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            autoComplete="one-time-code"
            placeholder="000000"
            className={`${fieldClass} font-mono tracking-[0.35em]`}
          />
          <p className="text-xs text-line-2">
            6-digit code from your authenticator app.
          </p>
        </div>
      )}

      <label className="mt-1 flex items-center gap-2.5 text-sm text-muted select-none">
        <input
          type="checkbox"
          name="rememberMe"
          defaultChecked
          className="size-4 rounded border-line bg-panel-2 accent-accent"
        />
        Remember me for 30 days
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-[#ff6b6b]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
