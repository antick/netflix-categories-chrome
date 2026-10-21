import { Moon, Sun } from "lucide-react";
import type { ThemePreference } from "../lib/types";

interface ThemeToggleProps {
  value: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <fieldset
      aria-label="Color theme"
      className="m-0 flex rounded-lg border-0 bg-[var(--color-panel)] p-0.5"
    >
      <button
        type="button"
        aria-pressed={value === "light"}
        aria-label="Light theme"
        onClick={() => onChange("light")}
        className={`rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none ${
          value === "light"
            ? "bg-[var(--color-ink-soft)] text-[var(--color-text)] shadow-sm"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
        }`}
      >
        <Sun className="size-3.5" />
      </button>
      <button
        type="button"
        aria-pressed={value === "dark"}
        aria-label="Dark theme"
        onClick={() => onChange("dark")}
        className={`rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none ${
          value === "dark"
            ? "bg-[var(--color-ink-soft)] text-[var(--color-text)] shadow-sm"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
        }`}
      >
        <Moon className="size-3.5" />
      </button>
    </fieldset>
  );
}
