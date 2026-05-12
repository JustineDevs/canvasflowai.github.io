import { describe, expect, it } from "vitest";
import { createDefaultScene } from "@/lib/scene/reducer";
import { parseSceneFile, serializeScene } from "@/lib/scene/serialization";

describe("scene serialization", () => {
  it("round-trips a valid scene file", () => {
    const scene = createDefaultScene();
    const payload = serializeScene(scene);
    const parsed = parseSceneFile(payload);

    expect(parsed.scene.name).toBe(scene.name);
    expect(parsed.scene.elements).toHaveLength(scene.elements.length);
  });

  it("rejects malformed scene files with a recoverable error", () => {
    expect(() => parseSceneFile("{\"scene\":{}}")).toThrow("Invalid scene file");
  });
});
