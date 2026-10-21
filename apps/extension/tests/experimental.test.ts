import { describe, expect, test } from "bun:test";
import {
  enableExperimentalHeader,
  NETFLIX_HOST_PERMISSION,
  OPTIONAL_PERMISSIONS,
} from "../lib/permissions";
import { DEFAULT_PREFERENCES, migratePreferences } from "../lib/preferences";
import { PAGE_INTEGRATION_ENABLED } from "../lib/release";

describe("experimental settings", () => {
  test("store build cannot enable injection through old settings or the API", async () => {
    expect(PAGE_INTEGRATION_ENABLED).toBe(false);
    expect(
      migratePreferences({ experimentalHeaderMenuEnabled: true })
        .experimentalHeaderMenuEnabled,
    ).toBe(false);
    expect(await enableExperimentalHeader()).toBe(false);
  });
  test("feature is off by default", () => {
    expect(DEFAULT_PREFERENCES.experimentalHeaderMenuEnabled).toBe(false);
    expect(DEFAULT_PREFERENCES.experimentalHeaderMenuNoticeDismissed).toBe(
      false,
    );
  });

  test("optional permission constants stay narrow", () => {
    expect(OPTIONAL_PERMISSIONS).toEqual(["scripting"]);
    expect(NETFLIX_HOST_PERMISSION).toBe("https://www.netflix.com/*");
  });
});
