import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EditorShell } from "@/components/editor/editor-shell";

describe("EditorShell", () => {
  it("adds a selected asset to the scene", () => {
    render(<EditorShell />);

    fireEvent.click(screen.getByRole("button", { name: /add react badge/i }));

    expect(screen.getByText(/elements on canvas: 4/i)).toBeInTheDocument();
  });

  it("resets the scene to the starter layout", () => {
    render(<EditorShell />);

    fireEvent.click(screen.getByRole("button", { name: /add react badge/i }));
    fireEvent.click(screen.getByRole("button", { name: /reset scene/i }));

    expect(screen.getByText(/elements on canvas: 3/i)).toBeInTheDocument();
  });
});
