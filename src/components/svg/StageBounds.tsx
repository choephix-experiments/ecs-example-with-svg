import React from "react";
import { useSnapshot } from "valtio";
import { worldDataState } from "../../stores/worldDataState";

export const StageBounds: React.FC = () => {
  const { stage } = useSnapshot(worldDataState);

  const layer2gap = 20;
  const layer3gap = 10;

  return (
    <>
      <rect
        x={-stage.width / 2}
        y={-stage.height / 2}
        width={stage.width}
        height={stage.height}
        fill="none"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="18,4,18,0"
      />
      <rect
        x={-stage.width / 2 - layer2gap}
        y={-stage.height / 2 - layer2gap}
        width={stage.width + layer2gap * 2}
        height={stage.height + layer2gap * 2}
        fill="none"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="8"
        opacity={0.2}
      />
      <rect
        x={-stage.width / 2 - layer3gap}
        y={-stage.height / 2 - layer3gap}
        width={stage.width + layer3gap * 2}
        height={stage.height + layer3gap * 2}
        fill="none"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="8"
        opacity={0.2}
      />
    </>
  );
};
