import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';

interface Entity {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  components: Component[];
  renderContent: React.ReactNode;
}

interface Component {
  name: string;
  start?: () => void;
  update?: (entity: Entity, deltaTime: number) => void;
  destroy?: () => void;
  render?: (entity: Entity) => React.ReactNode;
}

const RenderCircle: Component = {
  name: 'RenderCircle',
  render: (entity: Entity) => {
    entity.renderContent = (
      <circle
        cx={entity.x}
        cy={entity.y}
        r={10 * entity.scale}
        transform={`rotate(${entity.rotation} ${entity.x} ${entity.y})`}
      />
    );
  },
};

const MovementComponent: Component = {
  name: 'Movement',
  update: (entity: Entity, deltaTime: number) => {
    entity.x += Math.sin(Date.now() * 0.001) * 0.5 * deltaTime;
    entity.y += Math.cos(Date.now() * 0.001) * 0.5 * deltaTime;
  },
};

const FillColor: (color: string) => Component = (color: string) => ({
  name: 'FillColor',
  render: (entity: Entity) => {
    entity.renderContent = <g fill={color}>{entity.renderContent}</g>;
  },
});

const SelectionBox: React.FC<{ entity: Entity }> = ({ entity }) => {
  const boxSize = 20 * entity.scale + 4;
  return (
    <rect
      x={entity.x - boxSize / 2}
      y={entity.y - boxSize / 2}
      width={boxSize}
      height={boxSize}
      fill='none'
      stroke='blue'
      strokeWidth='1'
      strokeDasharray='2, 2'
    />
  );
};

export default function GameSandbox() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [prompt, setPrompt] = useState('');
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const initializeEntities = useCallback(() => {
    const newEntities: Entity[] = [];
    for (let i = 0; i < 20; i++) {
      newEntities.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        components: [
          RenderCircle,
          MovementComponent,
          FillColor(`hsl(${Math.random() * 360}, 70%, 50%)`),
        ],
        renderContent: null,
      });
    }
    setEntities(newEntities);
  }, []);

  const updateEntities = useCallback((time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setEntities(prevEntities =>
        prevEntities.map(entity => {
          const updatedEntity = { ...entity, renderContent: null };
          entity.components.forEach(component => {
            if (component.update) {
              component.update(updatedEntity, deltaTime);
            }
            if (component.render) {
              component.render(updatedEntity);
            }
          });
          return updatedEntity;
        })
      );
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateEntities);
  }, []);

  useEffect(() => {
    initializeEntities();
    requestRef.current = requestAnimationFrame(updateEntities);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [initializeEntities, updateEntities]);

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
        {entities.map(entity => (
          <g
            key={entity.id}
            onClick={e => handleEntityClick(entity, e)}
            style={{ cursor: 'pointer' }}
          >
            {entity.renderContent}
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
          <h3 className='font-bold mt-2'>Components:</h3>
          <ul>
            {selectedEntity.components.map((component, index) => (
              <li key={index}>{component.name}</li>
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
