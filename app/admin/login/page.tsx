import { totpEnabled } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
      />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 font-mono text-sm">
          <span className="size-2 rounded-full bg-term animate-pulse-dot" />
          <span className="text-muted">~/ismail/admin</span>
        </div>

        <div className="rounded-xl border border-line bg-panel/60 p-7">
          <h1 className="text-lg font-medium">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted">
            Private area. No account creation.
          </p>
          <LoginForm totpEnabled={totpEnabled()} />
        </div>
      </div>
    </main>
  );
}
