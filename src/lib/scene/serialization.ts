import { sceneFileSchema } from "@/lib/scene/schema";
import type { Scene, SceneFilePayload } from "@/lib/scene/types";

export function serializeScene(scene: Scene): string {
  const payload: SceneFilePayload = {
    version: 1,
    scene,
  };

  return JSON.stringify(payload, null, 2);
}

export function parseSceneFile(serialized: string): SceneFilePayload {
  try {
    const payload = JSON.parse(serialized);
    return sceneFileSchema.parse(payload);
  } catch {
    throw new Error("Invalid scene file");
  }
}
