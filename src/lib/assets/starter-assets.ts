import type { StarterAsset } from "@/lib/scene/types";

export const starterAssets: StarterAsset[] = [
  {
    id: "persona-developer",
    kind: "persona",
    label: "Pixel Developer",
    shortLabel: "Dev",
    width: 140,
    height: 180,
    color: "#f5b83d",
    defaultPosition: { x: 180, y: 240 },
  },
  {
    id: "react-badge",
    kind: "tech",
    label: "React Badge",
    shortLabel: "React",
    width: 110,
    height: 70,
    color: "#66d9ef",
    defaultPosition: { x: 210, y: 120 },
  },
  {
    id: "pixel-cloud",
    kind: "environment",
    label: "Pixel Cloud",
    shortLabel: "Cloud",
    width: 220,
    height: 90,
    color: "#9bd0ff",
    defaultPosition: { x: 360, y: 130 },
  },
  {
    id: "github-orb",
    kind: "tech",
    label: "GitHub Orb",
    shortLabel: "GitHub",
    width: 110,
    height: 70,
    color: "#c8b6ff",
    defaultPosition: { x: 470, y: 250 },
  },
];
