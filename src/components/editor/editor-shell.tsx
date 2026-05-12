"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AssetPalette } from "@/components/editor/asset-palette";
import { SceneCanvas } from "@/components/editor/scene-canvas";
import { ReadmePreview } from "@/components/export/readme-preview";
import { PromptPanel } from "@/components/prompt/prompt-panel";
import { ProviderStatusPanel } from "@/components/providers/provider-status-panel";
import { buildExportDraft } from "@/lib/export/export-readiness";
import {
  cloudWorkerAdapter,
  getCloudBridgeHealth,
} from "@/lib/providers/cloud-worker-adapter";
import {
  createProviderState,
  setProviderMode,
  setProviderUnavailable,
} from "@/lib/providers/provider-state";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";
import {
  addAssetToScene,
  createDefaultScene,
  moveElement,
  removeElement,
  reorderElement,
  resetScene,
  resizeElement,
} from "@/lib/scene/reducer";
import { parseSceneFile, serializeScene } from "@/lib/scene/serialization";
import type { ProviderMode } from "@/lib/scene/types";
import type { CloudBridgeGenerateResponse, CloudProviderId } from "../../../shared/cloud-bridge-contract";

export function EditorShell() {
  const [scene, setScene] = useState(createDefaultScene);
  const [providerState, setProviderState] = useState(createProviderState);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [providerDetail, setProviderDetail] = useState<string | null>(null);
  const [providerHealth, setProviderHealth] = useState<string | null>(null);
  const [configuredProviders, setConfiguredProviders] = useState<CloudProviderId[]>([]);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<CloudProviderId>("apimart");
  const [generationResult, setGenerationResult] = useState<CloudBridgeGenerateResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  const summary = useMemo(() => generatePromptSummary(scene), [scene]);
  const exportDraft = useMemo(() => buildExportDraft(scene, "png"), [scene]);

  function handleSaveScene() {
    const payload = serializeScene(scene);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    if (downloadRef.current) {
      downloadRef.current.href = url;
      downloadRef.current.download = `${scene.name.replace(/\s+/g, "-").toLowerCase()}.json`;
      downloadRef.current.click();
    }

    setImportMessage("Scene exported as JSON.");
  }

  async function handleLoadScene(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const payload = parseSceneFile(await file.text());
      setScene(payload.scene);
      setImportMessage("Scene loaded successfully.");
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Invalid scene file");
    } finally {
      event.target.value = "";
    }
  }

  function handleProviderModeChange(mode: ProviderMode) {
    setScene((current) => ({ ...current, providerMode: mode }));
  }

  useEffect(() => {
    setProviderState((current) =>
      current.mode === scene.providerMode ? current : setProviderMode(current, scene.providerMode),
    );
  }, [scene.providerMode]);

  useEffect(() => {
    let cancelled = false;

    async function syncCloudStatus() {
      if (providerState.mode !== "cloud") {
        setProviderDetail(null);
        setProviderHealth(null);
        return;
      }

      try {
        const [status, health] = await Promise.all([
          cloudWorkerAdapter.getStatus(),
          getCloudBridgeHealth(),
        ]);
        if (cancelled) {
          return;
        }

        setProviderState((current) =>
          status.connectionState === "ready"
            ? { ...current, mode: "cloud", connectionState: "ready" }
            : setProviderUnavailable({ ...current, mode: "cloud", connectionState: "idle" }),
        );
        setProviderDetail(status.message);
        setProviderHealth(health.message);
        setConfiguredProviders(status.configuredProviders);
        if (
          status.configuredProviders.length > 0 &&
          !status.configuredProviders.includes(selectedCloudProvider)
        ) {
          setSelectedCloudProvider(status.configuredProviders[0]);
        }
      } catch {
        if (cancelled) {
          return;
        }

        setProviderState((current) =>
          setProviderUnavailable({ ...current, mode: "cloud", connectionState: "idle" }),
        );
        setProviderDetail("Cloud bridge status sync failed before a response was received.");
        setProviderHealth("Cloud bridge health sync failed before a response was received.");
        setConfiguredProviders([]);
      }
    }

    void syncCloudStatus();

    return () => {
      cancelled = true;
    };
  }, [providerState.mode, selectedCloudProvider]);

  async function handleGenerateCloudDraft() {
    setIsGenerating(true);
    try {
      const result = await cloudWorkerAdapter.generate(scene, summary, selectedCloudProvider);
      setGenerationResult(result);
    } finally {
      setIsGenerating(false);
    }
  }

  const providerOptions =
    configuredProviders.length > 0 ? configuredProviders : (["apimart", "laozhang"] as CloudProviderId[]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,#f5b83d_0%,#fff3d7_30%,#d7ecff_100%)] p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-600">
          CanvasFlow AI
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
          Build a personal-brand diorama visually, then inspect the prompt semantics before you
          render anything.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">
          The MVP keeps editing, prompt translation, and export readiness available even when no
          generation provider is configured.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <AssetPalette onAddAsset={(asset) => setScene((current) => addAssetToScene(current, asset))} />
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Scene Controls</h2>
            <div className="mt-4 grid gap-3">
              <button
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white"
                onClick={() => setScene(resetScene())}
                type="button"
              >
                Reset scene
              </button>
              <button
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                onClick={handleSaveScene}
                type="button"
              >
                Save scene
              </button>
              <label className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
                Load scene
                <input className="sr-only" onChange={handleLoadScene} type="file" accept=".json" />
              </label>
            </div>
            {importMessage ? <p className="mt-3 text-sm text-slate-600">{importMessage}</p> : null}
            <a className="sr-only" ref={downloadRef}>
              download
            </a>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Generation Mode</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["none", "local", "cloud"] as ProviderMode[]).map((mode) => (
                <button
                  key={mode}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-slate-400"
                  onClick={() => handleProviderModeChange(mode)}
                  type="button"
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>
          <ProviderStatusPanel
            configuredProviders={configuredProviders}
            detail={providerDetail}
            healthMessage={providerHealth}
            state={providerState}
          />
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Cloud Draft</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use the Cloudflare Worker bridge to validate the end-to-end provider flow without
              embedding secrets in the frontend.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-700" htmlFor="cloud-provider">
                Provider
              </label>
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                id="cloud-provider"
                onChange={(event) => setSelectedCloudProvider(event.target.value as CloudProviderId)}
                value={selectedCloudProvider}
              >
                {providerOptions.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider === "apimart" ? "APIMart" : "LaoZhang"}
                  </option>
                ))}
              </select>
              <button
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={
                  providerState.mode !== "cloud" ||
                  isGenerating ||
                  configuredProviders.length === 0
                }
                onClick={() => void handleGenerateCloudDraft()}
                type="button"
              >
                {isGenerating ? "Generating..." : "Generate cloud draft"}
              </button>
            </div>
            {generationResult ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{generationResult.message}</p>
                <p className="mt-2">Status: {generationResult.status}</p>
                <p>Format: {generationResult.format.toUpperCase()}</p>
                <p>
                  Estimated bytes:{" "}
                  {generationResult.estimatedBytes !== null ? generationResult.estimatedBytes : "n/a"}
                </p>
                {generationResult.warnings.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {generationResult.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6">
          <SceneCanvas
            scene={scene}
            onNudge={(elementId, axis, delta) =>
              setScene((current) => {
                const element = current.elements.find((item) => item.id === elementId);
                if (!element) {
                  return current;
                }

                return moveElement(current, elementId, {
                  x: axis === "x" ? element.x + delta : element.x,
                  y: axis === "y" ? element.y + delta : element.y,
                });
              })
            }
            onReorder={(elementId, direction) =>
              setScene((current) => reorderElement(current, elementId, direction))
            }
            onResize={(elementId, delta) =>
              setScene((current) => {
                const element = current.elements.find((item) => item.id === elementId);
                if (!element) {
                  return current;
                }

                return resizeElement(current, elementId, {
                  width: Math.max(60, element.width + delta),
                  height: Math.max(60, element.height + delta),
                });
              })
            }
            onRemove={(elementId) => setScene((current) => removeElement(current, elementId))}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <PromptPanel summary={summary} />
            <ReadmePreview draft={exportDraft} summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
