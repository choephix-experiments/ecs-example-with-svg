import { Entity } from "../types";

export const SelectionBox: React.FC<{ entity: Entity }> = ({ entity }) => {
  const boxSize = 20 * entity.scale + 4;
  return (
    <rect
      x={entity.x - boxSize / 2}
      y={entity.y - boxSize / 2}
      width={boxSize}
      height={boxSize}
      fill='none'
      stroke='blue'
      strokeWidth='1'
      strokeDasharray='2, 2'
    />
  );
};
