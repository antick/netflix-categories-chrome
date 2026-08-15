import "./style.css";
import "~/assets/tailwind.css";
import ReactDOM from "react-dom/client";
import {
  findNetflixNavigationAnchor,
  HEADER_CONTROL_LABEL,
  hasInjectedButton,
  placeCategoriesButton,
  removeInjectedButtons,
  removeInjectedHeaderUi,
  shouldMountOnPath,
} from "../../lib/netflix-dom";
import { loadPreferences, subscribeToPreferences } from "../../lib/storage";
import type { ExtensionPreferences } from "../../lib/types";
import { usePreferences } from "../../lib/use-preferences";
import { MegaMenu } from "./MegaMenu";

const HOST_NAME = "netflix-categories-menu";
const BOOTSTRAP_ATTR = "data-nc-header-bootstrapped";
const SCRIPT_VERSION = "hidden-categories-v1";

function MenuRoot({ onClose, open }: { open: boolean; onClose: () => void }) {
  const prefsApi = usePreferences();
  if (!prefsApi.prefs) return null;
  return (
    <MegaMenu
      prefs={prefsApi.prefs}
      open={open}
      onClose={onClose}
      onFavorite={(id) => void prefsApi.toggleFavorite(id)}
      onHide={(id) => void prefsApi.hide(id)}
      onUnhide={(id) => void prefsApi.unhide(id)}
      onRestoreHidden={() => void prefsApi.restoreHidden()}
      onClearRecent={() => void prefsApi.clearRecent()}
      onOpened={(id) => void prefsApi.rememberRecent(id)}
    />
  );
}

export default defineContentScript({
  matches: ["https://www.netflix.com/*"],
  registration: "runtime",
  cssInjectionMode: "ui",

  async main(ctx) {
    if (
      document.documentElement.getAttribute(BOOTSTRAP_ATTR) === SCRIPT_VERSION
    )
      return;
    removeInjectedHeaderUi();
    document.documentElement.setAttribute(BOOTSTRAP_ATTR, SCRIPT_VERSION);

    let button: HTMLButtonElement | null = null;
    let item: HTMLElement | null = null;
    let observer: MutationObserver | null = null;
    let ui: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;
    let open = false;
    let root: ReactDOM.Root | null = null;
    let shellEl: HTMLElement | null = null;
    let enabled = false;
    let mounting = false;

    const positionShell = () => {
      if (!shellEl || !button) return;
      const rect = button.getBoundingClientRect();
      const width = Math.min(440, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, rect.right - width),
        window.innerWidth - width - 12,
      );
      shellEl.style.top = `${Math.round(rect.bottom + 12)}px`;
      shellEl.style.left = `${Math.round(left)}px`;
      shellEl.style.right = "auto";
      shellEl.style.width = `${width}px`;
    };

    const renderMenu = () => {
      if (!root) return;
      if (open) positionShell();
      root.render(
        <MenuRoot
          open={open}
          onClose={() => {
            open = false;
            button?.setAttribute("aria-expanded", "false");
            renderMenu();
          }}
        />,
      );
    };

    const removeInjected = () => {
      item?.remove();
      item = null;
      button = null;
      ui?.remove();
      ui = null;
      root = null;
      shellEl = null;
      observer?.disconnect();
      observer = null;
    };

    const insertButton = (nav: HTMLElement) => {
      const existing = document.querySelector<HTMLElement>(
        "[data-nc-categories-button]",
      );
      const existingButton =
        existing?.shadowRoot?.querySelector("button") ??
        existing?.querySelector("button");
      if (
        existing &&
        existingButton &&
        existingButton.textContent === HEADER_CONTROL_LABEL
      ) {
        item = existing;
        button = existingButton;
        return;
      }
      removeInjectedButtons();

      item = document.createElement(
        nav.tagName === "UL" || nav.tagName === "OL" ? "li" : "div",
      );
      item.setAttribute("data-nc-categories-button", "true");
      item.style.display = "inline-flex";
      item.style.alignItems = "center";
      item.style.flex = "0 0 auto";
      item.style.position = "relative";
      item.style.zIndex = "20";
      item.style.margin = "0 40px 0 12px";
      item.style.listStyle = "none";

      const shadow = item.attachShadow({ mode: "open" });
      const styles = document.createElement("style");
      styles.textContent = `
        button {
          appearance: none;
          background: rgba(229, 9, 20, 0.16);
          border: 1px solid #e50914;
          border-radius: 4px;
          color: #e50914;
          cursor: pointer;
          font: 700 13px/1.2 "Helvetica Neue", Helvetica, Arial, sans-serif;
          letter-spacing: 0.04em;
          padding: 6px 12px;
          white-space: nowrap;
        }
        button:hover,
        button[aria-expanded="true"] {
          background: #e50914;
          color: #fff;
        }
        button:focus-visible {
          outline: 2px solid #e50914;
          outline-offset: 2px;
        }
      `;
      button = document.createElement("button");
      button.type = "button";
      button.textContent = HEADER_CONTROL_LABEL;
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", HEADER_CONTROL_LABEL);
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        open = !open;
        button?.setAttribute("aria-expanded", String(open));
        renderMenu();
      });
      shadow.append(styles, button);
      placeCategoriesButton(nav, item);
    };

    const ensureObserver = () => {
      if (observer) return;
      observer = new MutationObserver(() => {
        if (!enabled || ctx.isInvalid) {
          removeInjected();
          return;
        }
        if (!shouldMountOnPath(location.pathname)) {
          removeInjected();
          return;
        }
        if (!hasInjectedButton() || !ui) void mount();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    };

    const mount = async () => {
      if (mounting) return;
      mounting = true;
      try {
        const prefs = await loadPreferences();
        enabled = prefs.experimentalHeaderMenuEnabled;
        if (
          !enabled ||
          ctx.isInvalid ||
          !shouldMountOnPath(location.pathname)
        ) {
          removeInjected();
          return;
        }
        ensureObserver();
        const nav = findNetflixNavigationAnchor();
        if (!nav) return;
        insertButton(nav);

        if (!ui) {
          ui = await createShadowRootUi(ctx, {
            name: HOST_NAME,
            position: "overlay",
            anchor: "body",
            isolateEvents: true,
            onMount(container) {
              const shadow = container.getRootNode() as ShadowRoot;
              if (shadow.host instanceof HTMLElement) {
                shadow.host.style.pointerEvents = "none";
                shadow.host.style.background = "transparent";
              }
              const wrap = document.createElement("div");
              wrap.className = "nc-shell";
              container.append(wrap);
              shellEl = wrap;
              root = ReactDOM.createRoot(wrap);
              renderMenu();
              return root;
            },
            onRemove(mounted) {
              mounted?.unmount();
              root = null;
              shellEl = null;
            },
          });
          ui.mount();
        }
      } finally {
        mounting = false;
      }
    };

    subscribeToPreferences((prefs: ExtensionPreferences) => {
      enabled = prefs.experimentalHeaderMenuEnabled;
      if (!enabled) removeInjected();
      else void mount();
    });

    ctx.addEventListener(window, "wxt:locationchange", () => {
      void mount();
    });
    ctx.addEventListener(window, "resize", () => {
      if (open) positionShell();
    });
    ctx.addEventListener(window, "scroll", () => {
      if (open) positionShell();
    });

    await mount();
  },
});
