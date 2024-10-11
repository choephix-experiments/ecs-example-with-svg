import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { findBehavior } from "../../utils/findBehavior";

export const SelectionBox: React.FC<{
  entity: ReadonlyDeep<StageEntityProps>;
}> = ({ entity }) => {
  const circle = findBehavior(entity, "RenderCircle");

  const boxSize = (circle?.radius ?? 30) * 2 * entity.scale + 4;
  return (
    <rect
      x={entity.x - boxSize / 2}
      y={entity.y - boxSize / 2}
      width={boxSize}
      height={boxSize}
      fill="none"
      stroke="blue"
      strokeWidth="1"
      strokeDasharray="2, 2"
    />
  );
};
