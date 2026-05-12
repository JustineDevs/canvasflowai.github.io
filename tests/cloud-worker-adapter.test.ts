import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildGenerateRequest,
  getCloudBridgeHealth,
  getCloudBridgeStatus,
  requestCloudGeneration,
} from "@/lib/providers/cloud-worker-adapter";
import { createDefaultScene } from "@/lib/scene/reducer";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";

describe("cloud worker adapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("builds a stable generate request from the current scene", () => {
    const scene = createDefaultScene();
    const summary = generatePromptSummary(scene);
    const request = buildGenerateRequest(scene, summary, "apimart");

    expect(request.scene.elementCount).toBe(scene.elements.length);
    expect(request.promptSummary.title).toBe(summary.title);
    expect(request.output.maxBytes).toBe(10 * 1024 * 1024);
  });

  it("returns unavailable status when no worker url is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDFLARE_WORKER_URL", "");

    const status = await getCloudBridgeStatus();

    expect(status.connectionState).toBe("unavailable");
    expect(status.message).toContain("NEXT_PUBLIC_CLOUDFLARE_WORKER_URL");
  });

  it("fetches status from the configured worker", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDFLARE_WORKER_URL", "https://bridge.example.workers.dev/");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          mode: "cloud",
          connectionState: "ready",
          configuredProviders: ["apimart"],
          message: "ready",
        }),
      }),
    );

    const status = await getCloudBridgeStatus();

    expect(status.connectionState).toBe("ready");
    expect(fetch).toHaveBeenCalledWith("https://bridge.example.workers.dev/api/providers/status");
  });

  it("fetches health from the configured worker", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDFLARE_WORKER_URL", "https://bridge.example.workers.dev/");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          service: "canvasflow-cloud-bridge",
          status: "ok",
          configuredProviders: ["apimart"],
          message: "healthy",
        }),
      }),
    );

    const health = await getCloudBridgeHealth();

    expect(health.status).toBe("ok");
    expect(fetch).toHaveBeenCalledWith("https://bridge.example.workers.dev/api/health");
  });

  it("posts a cloud generation request to the worker", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDFLARE_WORKER_URL", "https://bridge.example.workers.dev/");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "accepted",
          requestId: "req-1",
          assetUrl: "https://cdn.example.com/asset.png",
          format: "png",
          estimatedBytes: 1024,
          message: "forwarded",
          warnings: [],
        }),
      }),
    );

    const scene = createDefaultScene();
    scene.providerMode = "cloud";
    const summary = generatePromptSummary(scene);
    const result = await requestCloudGeneration(scene, summary, "apimart");

    expect(result.status).toBe("accepted");
    expect(fetch).toHaveBeenCalledWith(
      "https://bridge.example.workers.dev/api/generate",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
