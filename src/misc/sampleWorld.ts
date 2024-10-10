import { worldStateActions, worldState } from '../stores/worldStore';
import { Entity } from '../types';

export function populateSampleWorld() {
  worldStateActions.clearWorld();
  const { width, height } = worldState.stage;

  for (let i = 0; i < 20; i++) {
    const entity: Entity = {
      id: i,
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      behaviors: []
    };
    worldStateActions.addEntity(entity);
    worldStateActions.addBehaviorToEntity(i, {
      type: 'RenderCircle',
    });
    worldStateActions.addBehaviorToEntity(i, {
      type: 'FillColor',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });
  }
}
