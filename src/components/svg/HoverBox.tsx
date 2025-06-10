import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { getEntityBounds } from "../../utils/finders";

export const HoverBox: React.FC<{
  entity: ReadonlyDeep<StageEntityProps>;
}> = ({ entity }) => {
  const bounds = getEntityBounds(entity);
  const padding = 8;

  if (!bounds) return null;

  const x = bounds.x - padding / 2;
  const y = bounds.y - padding / 2;
  const width = bounds.width + padding;
  const height = bounds.height + padding;

  const dashLength = 6;
  const dashThickness = 2;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="none"
      stroke="DodgerBlue"
      strokeWidth={dashThickness}
      strokeDasharray={`${dashLength},${dashLength}`}
      opacity="0.6"
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
