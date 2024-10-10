import { Search } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { state } from './stores/worldStore';
import { Entity } from './types';
import { SelectionBox } from './components/SelectionBox';

export default function GameSandbox() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [prompt, setPrompt] = useState('');
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const { entities } = state;
  const [entityRenderContents, setEntityRenderContents] = useState<[Entity, React.ReactNode][]>([]);

  const updateEntities = useCallback((time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;

      for (const entity of entities) {
        for (const behavior of entity.behaviors) {
          behavior.update?.(entity as any, deltaTime);
        }
      }

      const newEntityRenderContents: typeof entityRenderContents = [];
      for (const entity of entities) {
        let renderContent: React.ReactNode = null;
        for (const behavior of entity.behaviors) {
          renderContent = behavior.render?.(entity, renderContent);
        }
        if (renderContent !== null) {
          newEntityRenderContents.push([entity as any, renderContent] as const);
        }

        console.log(entity.id, renderContent);
      }
      setEntityRenderContents(newEntityRenderContents);
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

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Prompt submitted:', prompt);
    // Here you would handle the prompt, e.g., add new entities, modify existing ones, etc.
    setPrompt('');
  };

  return (
    <div className='w-full h-screen relative overflow-hidden'>
      <svg className='w-full h-full' onClick={handleBackgroundClick}>
        <defs>
          <pattern
            id='plusPattern'
            x='0'
            y='0'
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <path d='M20 15 V25 M15 20 H25' stroke='#e0e0e0' strokeWidth='1' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#plusPattern)' />
        {entityRenderContents.map(([entity, content]) => (
          <g
            key={entity.id}
            onClick={e => handleEntityClick(entity, e)}
            style={{ cursor: 'pointer' }}
          >
            {content}
          </g>
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

      <form
        onSubmit={handlePromptSubmit}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
      >
        <div className='relative'>
          <input
            type='text'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder='Enter prompt...'
            className='w-96 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2'>
            <Search className='h-5 w-5 text-gray-500' />
          </button>
        </div>
      </form>
    </div>
  );
}
