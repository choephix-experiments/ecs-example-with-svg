interface StageGridProps {
  cellSize?: number;
}

export function StageGrid({ cellSize = 40 }: StageGridProps) {
  return (
    <>
      <defs>
        <pattern
          id="plusPattern"
          x="0"
          y="0"
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <rect width={cellSize} height={cellSize} fill="#f8f8f8" />
          <path
            d={`M${cellSize / 2} ${cellSize * 0.375} V${cellSize * 0.625} M${
              cellSize * 0.375
            } ${cellSize / 2} H${cellSize * 0.625}`}
            stroke="#d8d8d8"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x="-100%"
        y="-100%"
        width="200%"
        height="200%"
        fill="url(#plusPattern)"
      />
    </>
  );
}
