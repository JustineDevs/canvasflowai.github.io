export type ElementKind = "persona" | "tech" | "environment";
export type ProviderMode = "none" | "local" | "cloud";
export type ProviderConnectionState = "idle" | "unavailable" | "ready";
export type ExportFormat = "png" | "webp" | "gif";

export interface SceneViewport {
  width: number;
  height: number;
  backgroundTheme: string;
}

export interface SceneElement {
  id: string;
  kind: ElementKind;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  color: string;
}

export interface Scene {
  id: string;
  name: string;
  styleProfileId: string;
  viewport: SceneViewport;
  elements: SceneElement[];
  providerMode: ProviderMode;
}

export interface StarterAsset {
  id: string;
  kind: ElementKind;
  label: string;
  shortLabel: string;
  width: number;
  height: number;
  color: string;
  defaultPosition: {
    x: number;
    y: number;
  };
}

export interface StyleProfile {
  id: string;
  name: string;
  tone: string;
  descriptor: string;
}

export interface PromptSummary {
  title: string;
  body: string;
  relationships: string[];
}

export interface ExportDraft {
  format: ExportFormat;
  estimatedBytes: number;
  withinBudget: boolean;
  budgetLabel: string;
}

export interface ProviderState {
  mode: ProviderMode;
  connectionState: ProviderConnectionState;
}

export interface SceneFilePayload {
  version: number;
  scene: Scene;
}
