import { getStyleProfile } from "@/lib/styles/profiles";
import type { PromptSummary, Scene, SceneElement } from "@/lib/scene/types";

function describeRelation(primary: SceneElement, secondary: SceneElement): string {
  const verticalDelta = secondary.y - primary.y;
  const horizontalDelta = secondary.x - primary.x;

  let vertical = "beside";
  if (verticalDelta < -40) {
    vertical = "above";
  } else if (verticalDelta > 40) {
    vertical = "below";
  }

  let horizontal = "";
  if (horizontalDelta < -60) {
    horizontal = "to the left";
  } else if (horizontalDelta > 60) {
    horizontal = "to the right";
  }

  return [secondary.label, vertical, horizontal].filter(Boolean).join(" ");
}

export function generatePromptSummary(scene: Scene): PromptSummary {
  const style = getStyleProfile(scene.styleProfileId);
  const persona = scene.elements.find((element) => element.kind === "persona");
  const nearbyTech = scene.elements.filter((element) => element.kind === "tech");

  if (!persona) {
    return {
      title: `${style.name} Scene Concept`,
      body: `No primary persona is present. Compose a ${style.descriptor} using the remaining visual elements.`,
      relationships: scene.elements.map((element) => `${element.label} held in scene memory`),
    };
  }

  const relationships = nearbyTech.length
    ? nearbyTech.map((element) => describeRelation(persona, element))
    : ["No nearby technology accents yet"];

  const techLabels = nearbyTech.map((element) => element.label).join(", ");

  return {
    title: `${style.name} Developer Diorama`,
    body: `A ${style.tone} developer portrait featuring ${persona.label.toLowerCase()} with ${
      techLabels || "ambient environment details"
    }.`,
    relationships,
  };
}
