import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadmePreview } from "@/components/export/readme-preview";
import { createDefaultScene } from "@/lib/scene/reducer";
import { buildExportDraft } from "@/lib/export/export-readiness";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";

describe("ReadmePreview", () => {
  it("shows export readiness metadata for the current scene", () => {
    const scene = createDefaultScene();
    const draft = buildExportDraft(scene, "png");
    const summary = generatePromptSummary(scene);

    render(<ReadmePreview draft={draft} summary={summary} />);

    expect(screen.getByText(/estimated size/i)).toBeInTheDocument();
    expect(screen.getByText(/format/i)).toBeInTheDocument();
    expect(screen.getByText(/within budget/i)).toBeInTheDocument();
  });
});
