import React from 'react';
import { useSnapshot } from 'valtio';
import { worldDataState } from '../../stores/worldDataState';

export const StageBounds: React.FC = () => {
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
