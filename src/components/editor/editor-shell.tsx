"use client";

import { useMemo, useRef, useState } from "react";
import { AssetPalette } from "@/components/editor/asset-palette";
import { SceneCanvas } from "@/components/editor/scene-canvas";
import { ReadmePreview } from "@/components/export/readme-preview";
import { PromptPanel } from "@/components/prompt/prompt-panel";
import { ProviderStatusPanel } from "@/components/providers/provider-status-panel";
import { buildExportDraft } from "@/lib/export/export-readiness";
import { createProviderState, setProviderMode, setProviderUnavailable } from "@/lib/providers/provider-state";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";
import { addAssetToScene, createDefaultScene, moveElement, removeElement, resetScene } from "@/lib/scene/reducer";
import { parseSceneFile, serializeScene } from "@/lib/scene/serialization";
import type { ProviderMode } from "@/lib/scene/types";

export function EditorShell() {
  const [scene, setScene] = useState(createDefaultScene);
  const [providerState, setProviderState] = useState(createProviderState);
  const [importMessage, setImportMessage] = useState<string | null>(null);
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
    if (!file) return;

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
    if (mode === "cloud") {
      setProviderState(setProviderUnavailable(setProviderMode(providerState, mode)));
      return;
    }

    setProviderState(setProviderMode(providerState, mode));
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,#f5b83d_0%,#fff3d7_30%,#d7ecff_100%)] p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-600">CanvasFlow AI</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
          Build a personal-brand diorama visually, then inspect the prompt semantics before you render anything.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">
          The MVP keeps editing, prompt translation, and export readiness available even when no generation provider is configured.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <AssetPalette onAddAsset={(asset) => setScene((current) => addAssetToScene(current, asset))} />
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Scene Controls</h2>
            <div className="mt-4 grid gap-3">
              <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" onClick={() => setScene(resetScene())} type="button">Reset scene</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700" onClick={handleSaveScene} type="button">Save scene</button>
              <label className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
                Load scene
                <input className="sr-only" onChange={handleLoadScene} type="file" accept=".json" />
              </label>
            </div>
            {importMessage ? <p className="mt-3 text-sm text-slate-600">{importMessage}</p> : null}
            <a className="sr-only" ref={downloadRef}>download</a>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Generation Mode</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["none", "local", "cloud"] as ProviderMode[]).map((mode) => (
                <button key={mode} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-slate-400" onClick={() => handleProviderModeChange(mode)} type="button">{mode}</button>
              ))}
            </div>
          </section>
          <ProviderStatusPanel state={providerState} />
        </div>

        <div className="space-y-6">
          <SceneCanvas
            scene={scene}
            onNudge={(elementId, axis, delta) =>
              setScene((current) => {
                const element = current.elements.find((item) => item.id === elementId);
                if (!element) return current;
                return moveElement(current, elementId, {
                  x: axis === "x" ? element.x + delta : element.x,
                  y: axis === "y" ? element.y + delta : element.y,
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
