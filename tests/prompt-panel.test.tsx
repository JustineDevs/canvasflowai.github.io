import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PromptPanel } from "@/components/prompt/prompt-panel";
import { generatePromptSummary } from "@/lib/prompting/generate-prompt-summary";
import { createDefaultScene } from "@/lib/scene/reducer";

describe("PromptPanel", () => {
  it("renders a deterministic summary for the current scene", () => {
    const scene = createDefaultScene();
    const summary = generatePromptSummary(scene);

    render(<PromptPanel summary={summary} />);

    expect(screen.getByRole("heading", { name: summary.title })).toBeInTheDocument();
    expect(screen.getByText(summary.relationships[0])).toBeInTheDocument();
  });
});
