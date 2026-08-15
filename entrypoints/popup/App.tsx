import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import { ExperimentalNotice } from "../../components/ExperimentalNotice";
import { ThemeToggle } from "../../components/ThemeToggle";
import { enableExperimentalHeader } from "../../lib/permissions";
import { applyTheme } from "../../lib/theme";
import { usePreferences } from "../../lib/use-preferences";

export function App() {
  const prefsApi = usePreferences();
  const [permissionMessage, setPermissionMessage] = useState<string | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefsApi.prefs) applyTheme(prefsApi.prefs.theme);
  }, [prefsApi.prefs]);

  if (!prefsApi.ready || !prefsApi.prefs) {
    return (
      <div className="flex h-[620px] w-[440px] items-center justify-center text-sm text-[var(--color-muted)]">
        {prefsApi.error ?? "Loading categories…"}
      </div>
    );
  }

  const prefs = prefsApi.prefs;

  const tryExperimental = async () => {
    setBusy(true);
    setPermissionMessage(null);
    const granted = await enableExperimentalHeader();
    if (granted) {
      await prefsApi.setExperimentalEnabled(true);
      setPermissionMessage(
        "Enabled. Refresh Netflix to see Hidden Categories in the header.",
      );
    } else {
      await prefsApi.setExperimentalEnabled(false);
      setPermissionMessage(
        "Netflix permission was not granted. The popup still works normally.",
      );
    }
    setBusy(false);
  };

  return (
    <div className="flex h-[620px] w-[440px] flex-col bg-[var(--color-ink)] text-[var(--color-text)]">
      <header className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3">
        <div>
          <h1 className="text-[17px] font-bold tracking-tight">
            Netflix Categories
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Hidden categories & genre codes
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle
            value={prefs.theme}
            onChange={(theme) => void prefsApi.setTheme(theme)}
          />
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => browser.runtime.openOptionsPage()}
            className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </header>

      {!prefs.experimentalHeaderMenuNoticeDismissed &&
      !prefs.experimentalHeaderMenuEnabled ? (
        <ExperimentalNotice
          onTry={() => void tryExperimental()}
          onDismiss={() => void prefsApi.dismissNotice()}
          busy={busy}
          message={permissionMessage}
        />
      ) : null}

      <CategoryBrowser
        prefs={prefs}
        onFavorite={(id) => void prefsApi.toggleFavorite(id)}
        onHide={(id) => void prefsApi.hide(id)}
        onUnhide={(id) => void prefsApi.unhide(id)}
        onRestoreHidden={() => void prefsApi.restoreHidden()}
        onUnmarkEmpty={(id) => void prefsApi.unmarkEmpty(id)}
        onClearEmpty={() => void prefsApi.clearEmpty()}
        onClearRecent={() => void prefsApi.clearRecent()}
        onOpened={(id) => void prefsApi.rememberRecent(id)}
      />
    </div>
  );
}
