import React from "react";
import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { EntityResolver } from "../../services/EntityResolver";

interface RenderedEntityProps {
  entity: ReadonlyDeep<StageEntityProps>;
  onClick: (
    entity: ReadonlyDeep<StageEntityProps>,
    event: React.MouseEvent
  ) => void;
}

export const RenderedEntity: React.FC<RenderedEntityProps> = ({
  entity,
  onClick,
}) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(entity, event);
  };

  const transform = `translate(${entity.x}, ${entity.y}) rotate(${entity.rotation})`;

  return (
    <g onClick={handleClick} transform={transform}>
      {EntityResolver.render(entity)}
    </g>
  );
};
