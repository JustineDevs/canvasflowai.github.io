import type { ProviderMode, ProviderState } from "@/lib/scene/types";

export function createProviderState(): ProviderState {
  return {
    mode: "none",
    connectionState: "idle",
  };
}

export function setProviderMode(state: ProviderState, mode: ProviderMode): ProviderState {
  return {
    mode,
    connectionState: mode === "none" ? "idle" : "ready",
  };
}

export function setProviderUnavailable(state: ProviderState): ProviderState {
  return {
    ...state,
    connectionState: "unavailable",
  };
}

export function getProviderStatusMessage(state: ProviderState): string {
  if (state.mode === "none") {
    return "No provider selected. You can keep editing and exporting metadata locally.";
  }

  if (state.connectionState === "unavailable") {
    return `The ${state.mode} provider is unavailable. You can continue editing without losing your scene.`;
  }

  return `The ${state.mode} provider is ready for optional generation.`;
}
