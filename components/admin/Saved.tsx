const IMAGE_FIELDS = new Set(["avatarUrl", "thumbnailUrl", "gallery"]);

export function Saved({
  show,
  invalid,
}: {
  show: boolean;
  invalid?: string;
}) {
  if (invalid) {
    const rule = IMAGE_FIELDS.has(invalid)
      ? "must be an upload from this form (Cloudinary) or a /local path"
      : "must be a full https:// link";

    return (
      <p
        role="alert"
        className="mb-6 rounded-lg border border-[#ff6b6b]/35 bg-[#ff6b6b]/10 px-4 py-3 text-sm text-[#ff6b6b]"
      >
        Not saved: <span className="font-mono">{invalid}</span> {rule}. Nothing
        was changed.
      </p>
    );
  }

  if (!show) return null;

  return (
    <p className="mb-6 rounded-lg border border-term/30 bg-term/5 px-4 py-3 text-sm text-term">
      Saved. The live site has been rebuilt.
    </p>
  );
}
