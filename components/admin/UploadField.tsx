"use client";

import { useRef, useState } from "react";

type Folder = "portfolio/profile" | "portfolio/projects";
type ResourceType = "image" | "raw";

const input =
  "w-full rounded-lg border border-line bg-panel-2/50 px-3 py-2 text-sm text-fg placeholder:text-line-2 transition-colors duration-200 focus:outline-none focus:border-accent";

async function uploadToCloudinary(
  file: File,
  folder: Folder,
  resourceType: ResourceType,
): Promise<string> {
  const signed = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, resourceType }),
  });

  if (!signed.ok) {
    throw new Error(
      signed.status === 401 ? "Session expired — sign in again." : "Could not sign the upload.",
    );
  }

  const config = await signed.json();

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", config.apiKey);
  body.append("timestamp", String(config.timestamp));
  body.append("signature", config.signature);
  body.append("folder", config.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/${config.resourceType}/upload`,
    { method: "POST", body },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Cloudinary rejected the file.");
  }

  return result.secure_url as string;
}

/**
 * A Cloudinary upload can succeed while delivery is blocked — new accounts
 * restrict PDF and ZIP formats, and the asset then answers 401 at its own URL.
 * Without this check the admin sees "uploaded" and the site serves a dead link.
 */
async function deliveryBlocked(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    return !response.ok;
  } catch {
    return false;
  }
}

export function UploadField({
  name,
  label,
  defaultValue,
  folder,
  resourceType = "image",
  accept = "image/*",
  hint,
  preview = true,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: Folder;
  resourceType?: ResourceType;
  accept?: string;
  hint?: string;
  preview?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setWarning(null);
    try {
      const url = await uploadToCloudinary(file, folder, resourceType);
      setValue(url);

      if (await deliveryBlocked(url)) {
        setWarning(
          "Uploaded, but Cloudinary is refusing to serve this file. In the Cloudinary console open Settings → Security and allow delivery of PDF and ZIP files, then reload this URL.",
        );
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-baseline gap-2 font-mono text-xs text-muted">
        {label}
        {hint && <span className="text-line-2">({hint})</span>}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://res.cloudinary.com/…"
        className={input}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="max-w-full text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-line file:bg-panel file:px-3 file:py-1.5 file:text-xs file:text-fg hover:file:border-accent/50"
        />
        {busy && <span className="font-mono text-xs text-accent">Uploading…</span>}
        {value && !busy && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="font-mono text-xs text-line-2 transition-colors hover:text-[#ff6b6b]"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-[#ff6b6b]">
          {error}
        </p>
      )}

      {warning && (
        <p
          role="alert"
          className="rounded-lg border border-[#febc2e]/35 bg-[#febc2e]/10 px-3 py-2 text-xs leading-relaxed text-[#febc2e]"
        >
          {warning}
        </p>
      )}

      {preview && value && (
        // Plain <img>: next/image would need every future Cloudinary host in
        // remotePatterns, and this is an admin-only thumbnail.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-1 max-h-32 w-auto rounded-lg border border-line object-contain"
        />
      )}

      {!preview && value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted underline underline-offset-2 transition-colors hover:text-accent"
        >
          Open uploaded file ↗
        </a>
      )}
    </div>
  );
}

/** Gallery: uploads append to a newline-separated list the action parses. */
export function UploadListField({
  name,
  label,
  defaultValue,
  folder,
}: {
  name: string;
  label: string;
  defaultValue?: string[] | null;
  folder: Folder;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadToCloudinary(file, folder, "image"));
      }
      setUrls((current) => [...current, ...uploaded]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-baseline gap-2 font-mono text-xs text-muted">
        {label}
        <span className="text-line-2">(one URL per line)</span>
      </label>

      <textarea
        id={name}
        name={name}
        rows={3}
        value={urls.join("\n")}
        onChange={(event) =>
          setUrls(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))
        }
        className={`${input} resize-y`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(event) => {
            if (event.target.files?.length) handleFiles(event.target.files);
          }}
          className="max-w-full text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-line file:bg-panel file:px-3 file:py-1.5 file:text-xs file:text-fg hover:file:border-accent/50"
        />
        {busy && <span className="font-mono text-xs text-accent">Uploading…</span>}
      </div>

      {error && (
        <p role="alert" className="text-xs text-[#ff6b6b]">
          {error}
        </p>
      )}

      {urls.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              className="h-16 w-24 rounded-md border border-line object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
