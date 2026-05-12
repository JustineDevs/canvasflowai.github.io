import type { GenerationAdapter } from "@/lib/providers/adapter";
import type { PromptSummary, Scene } from "@/lib/scene/types";
import type {
  CloudBridgeHealthResponse,
  CloudBridgeGenerateRequest,
  CloudBridgeGenerateResponse,
  CloudBridgeStatusResponse,
  CloudProviderId,
} from "../../../shared/cloud-bridge-contract";

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getCloudWorkerBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL?.trim();
  return configured ? trimTrailingSlash(configured) : null;
}

function unavailableStatus(message: string): CloudBridgeStatusResponse {
  return {
    mode: "cloud",
    connectionState: "unavailable",
    configuredProviders: [],
    message,
  };
}

function unavailableGeneration(message: string): CloudBridgeGenerateResponse {
  return {
    status: "unavailable",
    requestId: null,
    assetUrl: null,
    format: "png",
    estimatedBytes: null,
    message,
    warnings: [],
  };
}

export function buildGenerateRequest(
  scene: Scene,
  promptSummary: PromptSummary,
  provider: CloudProviderId,
): CloudBridgeGenerateRequest {
  return {
    provider,
    scene: {
      id: scene.id,
      name: scene.name,
      styleProfileId: scene.styleProfileId,
      providerMode: scene.providerMode,
      elementCount: scene.elements.length,
    },
    promptSummary: {
      title: promptSummary.title,
      body: promptSummary.body,
      relationships: promptSummary.relationships,
    },
    output: {
      format: "png",
      maxBytes: DEFAULT_MAX_BYTES,
    },
  };
}

export async function getCloudBridgeStatus(): Promise<CloudBridgeStatusResponse> {
  const baseUrl = getCloudWorkerBaseUrl();
  if (!baseUrl) {
    return unavailableStatus(
      "Cloud bridge URL is not configured. Set NEXT_PUBLIC_CLOUDFLARE_WORKER_URL.",
    );
  }

  try {
    const response = await fetch(`${baseUrl}/api/providers/status`);
    if (!response.ok) {
      return unavailableStatus("Cloud bridge is unreachable right now.");
    }

    return (await response.json()) as CloudBridgeStatusResponse;
  } catch {
    return unavailableStatus("Cloud bridge request failed before a response was received.");
  }
}

export async function getCloudBridgeHealth(): Promise<CloudBridgeHealthResponse> {
  const baseUrl = getCloudWorkerBaseUrl();
  if (!baseUrl) {
    return {
      service: "canvasflow-cloud-bridge",
      status: "degraded",
      configuredProviders: [],
      message: "Cloud bridge URL is not configured.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/health`);
    if (!response.ok) {
      return {
        service: "canvasflow-cloud-bridge",
        status: "degraded",
        configuredProviders: [],
        message: "Cloud bridge health endpoint is unreachable.",
      };
    }

    return (await response.json()) as CloudBridgeHealthResponse;
  } catch {
    return {
      service: "canvasflow-cloud-bridge",
      status: "degraded",
      configuredProviders: [],
      message: "Cloud bridge health request failed before a response was received.",
    };
  }
}

export async function requestCloudGeneration(
  scene: Scene,
  promptSummary: PromptSummary,
  provider: CloudProviderId,
): Promise<CloudBridgeGenerateResponse> {
  const baseUrl = getCloudWorkerBaseUrl();
  if (!baseUrl) {
    return unavailableGeneration("Cloud bridge URL is not configured.");
  }

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildGenerateRequest(scene, promptSummary, provider)),
    });

    if (!response.ok) {
      return unavailableGeneration("Cloud generation request failed.");
    }

    return (await response.json()) as CloudBridgeGenerateResponse;
  } catch {
    return unavailableGeneration("Cloud generation request failed before a response was received.");
  }
}

export const cloudWorkerAdapter: GenerationAdapter = {
  getStatus: getCloudBridgeStatus,
  generate: requestCloudGeneration,
};
