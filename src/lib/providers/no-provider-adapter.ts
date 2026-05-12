import type { GenerationAdapter } from "@/lib/providers/adapter";

export const noProviderAdapter: GenerationAdapter = {
  async getStatus() {
    return {
      mode: "cloud",
      connectionState: "unavailable",
      configuredProviders: [],
      message: "No provider selected. Local editing remains fully available.",
    };
  },
  async generate(_scene, _promptSummary, _provider) {
    return {
      status: "unavailable",
      requestId: null,
      assetUrl: null,
      format: "png",
      estimatedBytes: null,
      message: "No provider selected. Cloud generation is intentionally disabled.",
      warnings: [],
    };
  },
};
