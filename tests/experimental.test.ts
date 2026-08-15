import { describe, expect, test } from "bun:test";
import {
  NETFLIX_HOST_PERMISSION,
  OPTIONAL_PERMISSIONS,
} from "../lib/permissions";
import { DEFAULT_PREFERENCES } from "../lib/preferences";

describe("experimental settings", () => {
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
