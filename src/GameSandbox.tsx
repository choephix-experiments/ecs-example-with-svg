import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { PromptBar } from './components/gui/PromptBar';
import { Grid } from './components/svg/Grid';
import { RenderedEntity } from './components/svg/RenderedEntity';
import { SelectionBox } from './components/svg/SelectionBox';
import { state } from './stores/worldStore';
import { Entity } from './types';

export default function GameSandbox() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const { entities } = useSnapshot(state);

  const updateEntities = useCallback((time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;

      for (const entity of state.entities) {
        for (const behavior of entity.behaviors) {
          behavior.update?.(entity as any, deltaTime);
        }
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateEntities);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateEntities);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updateEntities]);

  const handleEntityClick = useCallback((entity: Entity, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedEntity(entity);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  return (
    <div className='w-full h-screen relative overflow-hidden'>
      <svg className='w-full h-full' onClick={handleBackgroundClick}>
        <Grid />
        {entities.map(entity => (
          <RenderedEntity key={entity.id} entityId={entity.id} onClick={handleEntityClick} />
        ))}
        {selectedEntity && <SelectionBox entity={selectedEntity} />}
      </svg>

      {selectedEntity && (
        <div className='absolute top-4 right-4 bg-white p-4 rounded shadow-lg'>
          <h2 className='text-lg font-bold mb-2'>Selected Entity</h2>
          <p>ID: {selectedEntity.id}</p>
          <p>X: {selectedEntity.x.toFixed(2)}</p>
          <p>Y: {selectedEntity.y.toFixed(2)}</p>
          <p>Rotation: {selectedEntity.rotation.toFixed(2)}</p>
          <p>Scale: {selectedEntity.scale.toFixed(2)}</p>
          <h3 className='font-bold mt-2'>Behaviors:</h3>
          <ul>
            {selectedEntity.behaviors.map((behavior, index) => (
              <li key={index}>{behavior.name}</li>
            ))}
          </ul>
        </div>
      )}

      <PromptBar />
    </div>
  );
}
