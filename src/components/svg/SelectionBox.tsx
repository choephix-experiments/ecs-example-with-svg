import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { findEntityBehaviorByType, getEntityBounds } from "../../utils/finders";

export const SelectionBox: React.FC<{
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
  const label = entity.name;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke="DodgerBlue"
        strokeWidth={dashThickness}
        strokeDasharray={`${dashLength},${dashLength}`}
        opacity="1"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={`${dashLength * 2}`}
          dur="0.4s"
          repeatCount="indefinite"
        />
      </rect>

      <text
        x={x + width / 2}
        y={y + height + 20}
        textAnchor="middle"
        fill="DodgerBlue"
        fontSize="17"
        fontFamily="Calibri, Arial, sans-serif"
        fontWeight="bolder"
        stroke="slategray"
        strokeWidth="7"
      >
        {label}
      </text>

      <text
        x={x + width / 2}
        y={y + height + 20}
        textAnchor="middle"
        fill="DodgerBlue"
        fontSize="17"
        fontFamily="Calibri, Arial, sans-serif"
        fontWeight="bolder"
        stroke="white"
        strokeWidth="4"
      >
        {label}
      </text>

      <text
        x={x + width / 2}
        y={y + height + 20}
        textAnchor="middle"
        fill="DodgerBlue"
        fontSize="17"
        fontFamily="Calibri, Arial, sans-serif"
        fontWeight="bolder"
      >
        {label}
      </text>
    </>
  );
};
