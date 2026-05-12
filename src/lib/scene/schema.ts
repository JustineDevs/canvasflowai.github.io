import { z } from "zod";

export const sceneElementSchema = z.object({
  id: z.string(),
  kind: z.enum(["persona", "tech", "environment"]),
  label: z.string().min(1),
  shortLabel: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number(),
  zIndex: z.number(),
  color: z.string().min(1),
});

export const sceneSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  styleProfileId: z.string().min(1),
  viewport: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    backgroundTheme: z.string().min(1),
  }),
  elements: z.array(sceneElementSchema),
  providerMode: z.enum(["none", "local", "cloud"]),
});

export const sceneFileSchema = z.object({
  version: z.literal(1),
  scene: sceneSchema,
});
