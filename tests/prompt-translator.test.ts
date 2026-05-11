import { describe, expect, it } from "vitest";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";
import { createDefaultScene } from "@/lib/scene/reducer";

describe("generatePromptSummary", () => {
  it("describes the primary subject, style, and nearby tech relationship", () => {
    const scene = createDefaultScene();
    const summary = generatePromptSummary(scene);

    expect(summary.title).toContain("Pixel");
    expect(summary.body).toContain("developer");
    expect(summary.body).toContain("React");
    expect(summary.relationships[0]).toContain("above");
  });

  it("falls back gracefully when no persona element exists", () => {
    const scene = createDefaultScene();
    scene.elements = scene.elements.filter((element) => element.kind !== "persona");

    const summary = generatePromptSummary(scene);

    expect(summary.title).toContain("Scene Concept");
    expect(summary.body).toContain("No primary persona");
  });
});
