import React from 'react';
import { useSnapshot } from 'valtio';
import { StageEntity } from '../../types';
import { worldState } from '../../stores/worldStore';

interface RenderedEntityProps {
  entityId: number;
  onClick: (entity: StageEntity, event: React.MouseEvent) => void;
}

export const RenderedEntity: React.FC<RenderedEntityProps> = React.memo(({ entityId, onClick }) => {
  const { entities } = useSnapshot(worldState);
  const entity = entities.find(e => e.id === entityId) as StageEntity;

  if (!entity) return null;

  const renderEntity = (): React.ReactNode => {
    let renderContent: React.ReactNode = null;
    for (const behavior of entity.behaviors) {
      renderContent = behavior.render?.(entity, renderContent);
    }
    return renderContent;
  };

  return (
    <g onClick={e => onClick(entity, e)} style={{ cursor: 'pointer' }}>
      {renderEntity()}
    </g>
  );
});
