import type { ThemePreference } from "./types";

export function applyTheme(
  theme: ThemePreference,
  root: HTMLElement = document.documentElement,
): void {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
