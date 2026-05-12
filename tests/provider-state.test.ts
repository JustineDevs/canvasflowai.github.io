import { describe, expect, it } from "vitest";
import {
  createProviderState,
  getProviderStatusMessage,
  setProviderMode,
  setProviderUnavailable,
} from "@/lib/providers/provider-state";

describe("provider state", () => {
  it("starts in supported no-provider mode", () => {
    const state = createProviderState();

    expect(state.mode).toBe("none");
    expect(getProviderStatusMessage(state)).toContain("No provider selected");
  });

  it("preserves scene-safe messaging when a provider becomes unavailable", () => {
    const state = setProviderUnavailable(setProviderMode(createProviderState(), "local"));

    expect(state.connectionState).toBe("unavailable");
    expect(getProviderStatusMessage(state)).toContain("without losing your scene");
  });
});
