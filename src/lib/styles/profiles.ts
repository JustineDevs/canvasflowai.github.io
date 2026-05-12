import type { StyleProfile } from "@/lib/scene/types";

export const styleProfiles: StyleProfile[] = [
  {
    id: "pixel",
    name: "Pixel",
    tone: "playful",
    descriptor: "pixel-art personal brand diorama",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tone: "clean",
    descriptor: "minimal, crisp portfolio scene",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    tone: "dramatic",
    descriptor: "cinematic technology portrait scene",
  },
];

export function getStyleProfile(styleProfileId: string): StyleProfile {
  return (
    styleProfiles.find((profile) => profile.id === styleProfileId) ?? styleProfiles[0]
  );
}
