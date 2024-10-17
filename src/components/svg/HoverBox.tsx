import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { findEntityBehaviorByType } from "../../utils/finders";

export const HoverBox: React.FC<{
  entity: ReadonlyDeep<StageEntityProps>;
}> = ({ entity }) => {
  const circle = findEntityBehaviorByType(entity, "RenderCircle");

  const padding = 8;
  const boxSize = (circle?.radius ?? 30) * 2 * entity.scale + padding;

  const dashLength = 6;
  const dashThickness = 2;

  return (
    <rect
      x={entity.x - boxSize / 2}
      y={entity.y - boxSize / 2}
      width={boxSize}
      height={boxSize}
      fill="none"
      stroke="DodgerBlue"
      strokeWidth={dashThickness}
      strokeDasharray={`${dashLength},${dashLength}`}
      opacity="0.3"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to={`${dashLength * 2}`}
        dur="0.4s"
        repeatCount="indefinite"
      />
    </rect>
  );
};
