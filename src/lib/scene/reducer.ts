import { starterAssets } from "@/lib/assets/starter-assets";
import type { Scene, SceneElement, StarterAsset } from "@/lib/scene/types";

function toSceneElement(asset: StarterAsset, index: number): SceneElement {
  return {
    id: `${asset.id}-${index}`,
    kind: asset.kind,
    label: asset.label,
    shortLabel: asset.shortLabel,
    x: asset.defaultPosition.x,
    y: asset.defaultPosition.y,
    width: asset.width,
    height: asset.height,
    rotation: 0,
    zIndex: index,
    color: asset.color,
  };
}

function cloneElements(scene: Scene): SceneElement[] {
  return scene.elements.map((element) => ({ ...element }));
}

export function createDefaultScene(): Scene {
  return {
    id: "scene-001",
    name: "Walking Dev Cloud",
    styleProfileId: "pixel",
    viewport: {
      width: 960,
      height: 540,
      backgroundTheme: "sunrise-grid",
    },
    elements: starterAssets.slice(0, 3).map((asset, index) => toSceneElement(asset, index)),
    providerMode: "none",
  };
}

export function addAssetToScene(scene: Scene, asset: StarterAsset): Scene {
  const elements = cloneElements(scene);
  elements.push(toSceneElement(asset, elements.length));
  return {
    ...scene,
    elements,
  };
}

export function moveElement(scene: Scene, elementId: string, position: Pick<SceneElement, "x" | "y">): Scene {
  return {
    ...scene,
    elements: scene.elements.map((element) =>
      element.id === elementId ? { ...element, ...position } : { ...element },
    ),
  };
}

export function resizeElement(scene: Scene, elementId: string, size: Pick<SceneElement, "width" | "height">): Scene {
  return {
    ...scene,
    elements: scene.elements.map((element) =>
      element.id === elementId ? { ...element, ...size } : { ...element },
    ),
  };
}

export function removeElement(scene: Scene, elementId: string): Scene {
  return {
    ...scene,
    elements: scene.elements
      .filter((element) => element.id !== elementId)
      .map((element, index) => ({ ...element, zIndex: index })),
  };
}

export function resetScene(_scene?: Scene): Scene {
  return createDefaultScene();
}
