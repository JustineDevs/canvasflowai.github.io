"use client";

import { Group, Layer, Rect, Stage, Text } from "react-konva";
import type { Scene } from "@/lib/scene/types";

interface SceneStageProps {
  scene: Scene;
}

export function SceneStage({ scene }: SceneStageProps) {
  return (
    <Stage height={scene.viewport.height / 2} width={scene.viewport.width / 2}>
      <Layer>
        <Rect
          cornerRadius={24}
          fill="#fff8ea"
          height={scene.viewport.height / 2}
          stroke="#d6d3d1"
          width={scene.viewport.width / 2}
          x={0}
          y={0}
        />
        {scene.elements.map((element) => (
          <Group key={element.id} x={element.x / 2} y={element.y / 2}>
            <Rect
              cornerRadius={18}
              fill={element.color}
              height={Math.max(28, element.height / 2.8)}
              shadowBlur={8}
              shadowColor="rgba(15,23,42,0.18)"
              width={Math.max(60, element.width / 1.8)}
            />
            <Text
              fill="#0f172a"
              fontSize={12}
              padding={10}
              text={element.shortLabel}
              verticalAlign="middle"
              width={Math.max(60, element.width / 1.8)}
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
