export function Saved({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <p className="mb-6 rounded-lg border border-term/30 bg-term/5 px-4 py-3 text-sm text-term">
      Saved. The live site has been rebuilt.
    </p>
  );
}
