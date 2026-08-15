import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "Netflix Categories",
    description:
      "Unofficial, open-source Chrome extension for browsing Netflix's hidden categories and secret genre codes.",
    permissions: ["storage", "activeTab"],
    optional_permissions: ["scripting"],
    optional_host_permissions: ["https://www.netflix.com/*"],
    action: {
      default_title: "Netflix Categories",
    },
    icons: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
  },
  hooks: {
    "build:manifestGenerated": (_wxt, manifest) => {
      const optionalHosts = new Set(manifest.optional_host_permissions ?? []);
      if (manifest.host_permissions) {
        manifest.host_permissions = manifest.host_permissions.filter(
          (host: string) => {
            if (host.includes("netflix.com")) {
              optionalHosts.add(host);
              return false;
            }
            return true;
          },
        );
        if (manifest.host_permissions.length === 0) {
          delete manifest.host_permissions;
        }
      }
      manifest.optional_host_permissions = [...optionalHosts];
      if (manifest.options_ui) {
        manifest.options_ui.open_in_tab = true;
      }
    },
  },
});
