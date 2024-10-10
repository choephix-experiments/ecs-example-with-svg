interface GridProps {
  cellSize?: number;
}

export function Grid({ cellSize = 40 }: GridProps) {
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
        x="-50%"
        y="-50%"
        width="100%"
        height="100%"
        fill="url(#plusPattern)"
      />
    </>
  );
}
