import { describe, expect, it, vi } from "vitest";
import { buildStatusResponse, handleBridgeRequest } from "../workers/cloud-bridge/src/index";

describe("cloud bridge worker", () => {
  it("reports unavailable when no provider secrets are configured", () => {
    const status = buildStatusResponse({});

    expect(status.connectionState).toBe("unavailable");
    expect(status.configuredProviders).toHaveLength(0);
  });

  it("reports ready when full upstream configuration and allowed origin exist", () => {
    const status = buildStatusResponse({
      APIMART_API_KEY: "secret",
      APIMART_BASE_URL: "https://api.apimart.example",
      ALLOWED_ORIGIN: "http://localhost:3000",
    });

    expect(status.connectionState).toBe("ready");
    expect(status.configuredProviders).toContain("apimart");
  });

  it("returns an accepted response for configured providers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        requestId: "upstream-123",
        assetUrl: "https://cdn.example.com/generated.png",
        estimatedBytes: 2048,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleBridgeRequest(
      new Request("https://bridge.example.workers.dev/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: "apimart",
          scene: {
            id: "scene-001",
            name: "demo",
            styleProfileId: "pixel",
            providerMode: "cloud",
            elementCount: 3,
          },
          promptSummary: {
            title: " Pixel Diorama ",
            body: " hello\tworld ",
            relationships: ["React   above"],
          },
          output: {
            format: "png",
            maxBytes: 1024,
          },
        }),
      }),
      { APIMART_API_KEY: "secret", APIMART_BASE_URL: "https://api.apimart.example" },
    );

    expect(response.status).toBe(202);
    const payload = (await response.json()) as {
      status: string;
      message: string;
      format: string;
      assetUrl: string;
    };
    expect(payload.status).toBe("accepted");
    expect(payload.format).toBe("png");
    expect(payload.assetUrl).toBe("https://cdn.example.com/generated.png");
    expect(payload.message).toContain("forwarded");
  });

  it("answers health checks", async () => {
    const response = await handleBridgeRequest(
      new Request("https://bridge.example.workers.dev/api/health"),
      {},
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { status: string };
    expect(payload.status).toBe("degraded");
  });
});
