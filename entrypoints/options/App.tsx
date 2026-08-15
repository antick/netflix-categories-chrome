import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  disableExperimentalHeader,
  enableExperimentalHeader,
} from "../../lib/permissions";
import {
  parseSettingsImportText,
  settingsExportFilename,
  settingsExportToJson,
} from "../../lib/settings-export";
import { applyTheme } from "../../lib/theme";
import { usePreferences } from "../../lib/use-preferences";

export function OptionsApp() {
  const prefsApi = usePreferences();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefsApi.prefs) applyTheme(prefsApi.prefs.theme);
  }, [prefsApi.prefs]);

  if (!prefsApi.ready || !prefsApi.prefs) {
    return (
      <p className="p-8 text-sm text-[var(--color-muted)]">
        {prefsApi.error ?? "Loading…"}
      </p>
    );
  }

  const prefs = prefsApi.prefs;

  const toggleExperimental = async (enabled: boolean) => {
    setStatus(null);
    if (enabled) {
      const granted = await enableExperimentalHeader();
      if (granted) {
        await prefsApi.setExperimentalEnabled(true);
        setStatus(
          "Hidden Categories enabled. Refresh Netflix to attach the header item.",
        );
      } else {
        await prefsApi.setExperimentalEnabled(false);
        setStatus(
          "Permission was denied. The popup continues to work normally.",
        );
      }
      return;
    }
    await prefsApi.setExperimentalEnabled(false);
    await disableExperimentalHeader();
    setStatus("Hidden Categories menu disabled.");
  };

  const exportSettings = () => {
    const json = settingsExportToJson(prefs);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = settingsExportFilename();
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Settings downloaded.");
  };

  const importSettingsFile = async (file: File) => {
    setBusy(true);
    setStatus(null);
    try {
      const imported = parseSettingsImportText(await file.text());
      let experimental = imported.experimentalHeaderMenuEnabled;
      if (experimental) {
        experimental = await enableExperimentalHeader();
      } else {
        await disableExperimentalHeader();
      }
      await prefsApi.replaceAll({
        ...imported,
        experimentalHeaderMenuEnabled: experimental,
      });
      applyTheme(imported.theme);
      setStatus(
        experimental === imported.experimentalHeaderMenuEnabled
          ? "Settings imported."
          : "Settings imported. Netflix permission was not granted, so Hidden Categories stayed off.",
      );
    } catch (error) {
      console.error(error);
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not import that file. Try again.",
      );
    } finally {
      setBusy(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const runDataAction = async (label: string, work: () => Promise<void>) => {
    setBusy(true);
    setStatus(null);
    try {
      await work();
      setStatus(label);
    } catch (error) {
      console.error(error);
      setStatus("Could not update saved data. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-10 text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Netflix Categories
      </h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Local settings only. Nothing is sent anywhere.
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-5">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
          Appearance
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Light or dark for the popup, options, and Netflix menu.
        </p>
        <div className="mt-4">
          <ThemeToggle
            value={prefs.theme}
            onChange={(theme) => void prefsApi.setTheme(theme)}
          />
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-5">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent-soft)] uppercase">
          Experimental
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Add a searchable Hidden Categories control to Netflix's top
          navigation. Needs permission on netflix.com and can break when Netflix
          restyles the header.
        </p>
        <label className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">
            Hidden Categories in Netflix header
          </span>
          <input
            type="checkbox"
            checked={prefs.experimentalHeaderMenuEnabled}
            onChange={(event) => void toggleExperimental(event.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
        </label>
        {prefs.experimentalHeaderMenuEnabled ? (
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            If Hidden Categories does not appear, refresh Netflix. The popup
            still works if the header cannot attach.
          </p>
        ) : null}
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-5">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
          Backup
        </h2>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Export favorites, hidden, empty, recent, theme, and other local
          settings as a JSON file. Import replaces the current state on this
          browser.
        </p>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Import settings file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const ok = window.confirm(
              "Replace favorites, hidden, empty, recent, and other settings with this file?",
            );
            if (!ok) {
              event.target.value = "";
              return;
            }
            void importSettingsFile(file);
          }}
        />
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={exportSettings}
          >
            Export settings
          </button>
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={() => importInputRef.current?.click()}
          >
            Import settings
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-ink-soft)] p-5">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
          Data
        </h2>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          These change only this extension's local lists.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={() =>
              void runDataAction("Recent list cleared.", () =>
                prefsApi.clearRecent(),
              )
            }
          >
            Clear Recent
          </button>
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={() =>
              void runDataAction("Favorites cleared.", () =>
                prefsApi.clearFavorites(),
              )
            }
          >
            Clear Favorites
          </button>
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={() =>
              void runDataAction("Hidden categories restored.", () =>
                prefsApi.restoreHidden(),
              )
            }
          >
            Restore All Hidden Categories
          </button>
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-muted)] disabled:opacity-60"
            onClick={() =>
              void runDataAction("Empty list cleared.", () =>
                prefsApi.clearEmpty(),
              )
            }
          >
            Restore All Empty Categories
          </button>
          <button
            type="button"
            disabled={busy}
            className="w-full rounded-xl border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-3 py-2.5 text-left text-sm font-medium text-[var(--color-accent-soft)] hover:border-[var(--color-accent)] disabled:opacity-60"
            onClick={() =>
              void runDataAction("All settings reset.", async () => {
                await prefsApi.resetAll();
                await disableExperimentalHeader();
              })
            }
          >
            Reset All Settings
          </button>
        </div>
      </section>

      {status ? (
        <p className="mt-4 text-sm text-[var(--color-accent-soft)]">{status}</p>
      ) : null}
    </main>
  );
}
