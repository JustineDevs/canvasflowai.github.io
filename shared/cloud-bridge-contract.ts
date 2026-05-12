export type CloudProviderId = "apimart" | "laozhang";
export type CloudBridgeConnectionState = "ready" | "unavailable";
export type CloudBridgeRequestFormat = "png" | "webp" | "gif";

export interface CloudBridgeSceneSnapshot {
  id: string;
  name: string;
  styleProfileId: string;
  providerMode: "cloud" | "local" | "none";
  elementCount: number;
}

export interface CloudBridgePromptSummary {
  title: string;
  body: string;
  relationships: string[];
}

export interface CloudBridgeGenerateRequest {
  provider: CloudProviderId;
  scene: CloudBridgeSceneSnapshot;
  promptSummary: CloudBridgePromptSummary;
  output: {
    format: CloudBridgeRequestFormat;
    maxBytes: number;
  };
}

export interface CloudBridgeStatusResponse {
  mode: "cloud";
  connectionState: CloudBridgeConnectionState;
  configuredProviders: CloudProviderId[];
  message: string;
}

export interface CloudBridgeHealthResponse {
  service: "canvasflow-cloud-bridge";
  status: "ok" | "degraded";
  configuredProviders: CloudProviderId[];
  message: string;
}

export interface CloudBridgeGenerateResponse {
  status: "accepted" | "unavailable";
  requestId: string | null;
  assetUrl: string | null;
  format: CloudBridgeRequestFormat;
  estimatedBytes: number | null;
  message: string;
  warnings: string[];
}
