import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search categories or codes...",
  id = "category-search",
}: SearchInputProps) {
  return (
    <label className="relative block px-3 pt-3" htmlFor={id}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-[1.35rem] left-6 size-4 text-[var(--color-muted)]"
      />
      <input
        id={id}
        type="search"
        aria-label="Search categories or codes"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="h-10 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-ink-soft)] pr-3 pl-10 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      />
    </label>
  );
}
