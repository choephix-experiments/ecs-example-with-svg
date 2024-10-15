import React from "react";
import { EntityResolver } from "../../services/EntityResolver";
import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";

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

  for (const prop of [
    "x",
    "y",
    "rotation",
    "scale",
  ] satisfies (keyof StageEntityProps)[]) {
    const value = entity[prop];
    if (isNaN(value)) {
      console.warn(
        `Entity ${entity.uuid} has a non-numeric value for ${prop}: ${value}`
      );
      // @ts-ignore
      entity[prop] = 1;
    }
  }

  const transform = `translate(${entity.x}, ${entity.y}) rotate(${entity.rotation}) scale(${entity.scale})`;

  return (
    <g onClick={handleClick} transform={transform}>
      {EntityResolver.render(entity)}
    </g>
  );
};
