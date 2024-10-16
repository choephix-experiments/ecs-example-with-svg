import React from "react";
import { entityResolver } from "../../resolvers/entityResolver";
import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import { defaultEntityProps } from "../../stores/worldDataState";

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

  const safeEntity = {
    ...defaultEntityProps,
    ...entity,
  };

  const transform = `
  translate(${safeEntity.x}, ${safeEntity.y}) 
  rotate(${safeEntity.rotation}) 
  scale(${safeEntity.scale})
  `;

  return (
    <g onClick={handleClick} transform={transform}>
      {entityResolver.render(entity)}
    </g>
  );
};
