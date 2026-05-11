import { describe, expect, it } from "vitest";
import {
  addAssetToScene,
  createDefaultScene,
  moveElement,
  removeElement,
  resetScene,
  resizeElement,
} from "@/lib/scene/reducer";
import { starterAssets } from "@/lib/assets/starter-assets";

describe("scene reducer helpers", () => {
  it("adds a starter asset to the scene", () => {
    const scene = createDefaultScene();
    const nextScene = addAssetToScene(scene, starterAssets[2]);

    expect(nextScene.elements).toHaveLength(scene.elements.length + 1);
    expect(nextScene.elements.at(-1)?.label).toBe(starterAssets[2].label);
  });

  it("moves and resizes an element without mutating the original scene", () => {
    const scene = createDefaultScene();
    const target = scene.elements[0];
    const moved = moveElement(scene, target.id, { x: 320, y: 260 });
    const resized = resizeElement(moved, target.id, { width: 180, height: 220 });

    expect(scene.elements[0].x).not.toBe(320);
    expect(resized.elements[0]).toMatchObject({ x: 320, y: 260, width: 180, height: 220 });
  });

  it("removes an element and restores the starter layout on reset", () => {
    const scene = createDefaultScene();
    const removed = removeElement(scene, scene.elements[1].id);
    const reset = resetScene(removed);

    expect(removed.elements).toHaveLength(scene.elements.length - 1);
    expect(reset.elements).toHaveLength(scene.elements.length);
  });
});
