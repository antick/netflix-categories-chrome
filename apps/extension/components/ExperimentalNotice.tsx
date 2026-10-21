import { FlaskConical, X } from "lucide-react";

interface ExperimentalNoticeProps {
  onTry: () => void;
  onDismiss: () => void;
  busy?: boolean;
  message?: string | null;
}

export function ExperimentalNotice({
  onTry,
  onDismiss,
  busy,
  message,
}: ExperimentalNoticeProps) {
  return (
    <section className="mx-3 mt-2 rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-2">
      <div className="flex items-center gap-2">
        <FlaskConical
          className="size-3.5 shrink-0 text-[var(--color-accent-soft)]"
          aria-hidden="true"
        />
        <p className="min-w-0 flex-1 truncate text-xs text-[var(--color-text)]">
          Put Hidden Categories on Netflix
        </p>
        <button
          type="button"
          onClick={onTry}
          disabled={busy}
          className="shrink-0 rounded-md bg-[var(--color-accent)] px-2 py-1 text-[11px] font-semibold text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:opacity-60"
        >
          {busy ? "…" : "Try"}
        </button>
        <button
          type="button"
          aria-label="Dismiss experimental menu notice"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-0.5 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
        >
          <X className="size-3.5" />
        </button>
      </div>
      {message ? (
        <p className="mt-1 text-[11px] text-[var(--color-accent-soft)]">
          {message}
        </p>
      ) : null}
    </section>
  );
}
