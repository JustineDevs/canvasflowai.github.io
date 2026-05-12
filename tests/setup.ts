import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach } from "vitest";
import { vi } from "vitest";

vi.mock("react-konva", () => {
  const createMockComponent = (tag: string) =>
    function MockKonvaComponent({
      children,
    }: React.PropsWithChildren<Record<string, unknown>>) {
      return React.createElement(tag, null, children);
    };

  return {
    Stage: createMockComponent("div"),
    Layer: createMockComponent("div"),
    Group: createMockComponent("div"),
    Rect: createMockComponent("div"),
    Text: createMockComponent("span"),
  };
});

afterEach(() => {
  cleanup();
});
