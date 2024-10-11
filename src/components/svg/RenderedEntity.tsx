import React from 'react';
import { ReadonlyDeep, StageEntityProps } from '../../types/data-types';
import { EntityResolver } from '../../services/EntityResolver';

interface RenderedEntityProps {
  entity: ReadonlyDeep<StageEntityProps>;
  onClick: (entity: ReadonlyDeep<StageEntityProps>, event: React.MouseEvent) => void;
}

export const RenderedEntity: React.FC<RenderedEntityProps> = ({ entity, onClick }) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(entity, event);
  };

  return (
    <g onClick={handleClick}>
      {EntityResolver.render(entity)}
    </g>
  );
};
