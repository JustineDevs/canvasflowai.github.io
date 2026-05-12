import type { ExportDraft, ExportFormat, Scene } from "@/lib/scene/types";

const SIZE_BUDGET = 10 * 1024 * 1024;

export function buildExportDraft(scene: Scene, format: ExportFormat): ExportDraft {
  const estimatedBytes = 400000 + scene.elements.length * 150000 + (format === "gif" ? 500000 : 0);

  return {
    format,
    estimatedBytes,
    withinBudget: estimatedBytes <= SIZE_BUDGET,
    budgetLabel: estimatedBytes <= SIZE_BUDGET ? "Within budget" : "Over budget",
  };
}
