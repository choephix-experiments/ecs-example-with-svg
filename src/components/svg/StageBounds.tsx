import React from "react";
import { useSnapshot } from "valtio";
import { worldDataState } from "../../stores/worldDataState";

export const StageBounds: React.FC = () => {
  return (
    <>
      {renderMainLayer()}
      {renderSubLayer(20)}
      {renderSubLayer(10)}
    </>
  );
};

const renderMainLayer = () => {
  const { stage } = useSnapshot(worldDataState);

  return (
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
  );
};

const renderSubLayer = (gap: number) => {
  const { stage } = useSnapshot(worldDataState);

  return (
    <rect
      x={-stage.width / 2 - gap}
      y={-stage.height / 2 - gap}
      width={stage.width + gap * 2}
      height={stage.height + gap * 2}
      fill="none"
      stroke="gray"
      strokeWidth="1"
      strokeDasharray="8"
      opacity={0.2}
    />
  );
};
