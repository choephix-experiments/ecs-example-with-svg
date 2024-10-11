import { worldDataState, worldDataStateActions } from '../stores/worldDataState';
import { StageEntityProps } from '../types/data-types';

export function populateSampleWorld() {
  worldDataStateActions.clearWorld();

  const { width, height } = worldDataState.stage;

  for (let i = 0; i < 20; i++) {
    const entity: StageEntityProps = {
      id: i,
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1 + Math.random() * 5,
      behaviors: []
    };
    worldDataStateActions.addEntity(entity);
    worldDataStateActions.addBehaviorToEntity(i, {
      type: 'RenderCircle',
    });
    worldDataStateActions.addBehaviorToEntity(i, {
      type: 'FillColor',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });
    
    // Add SimplifyMesh behavior to some entities
    if (i % 3 === 0) {
      worldDataStateActions.addBehaviorToEntity(i, {
        type: 'SimplifyMesh',
        sides: 5, // Random number of sides between 3 and 7
      });
    }
  }
}
