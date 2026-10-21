import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="px-3 py-5 text-center">
      <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{body}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
