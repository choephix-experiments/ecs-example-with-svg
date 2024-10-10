import { proxy } from 'valtio';
import { Behavior, Entity } from '../types';

interface GameState {
  entities: Entity[];
  stage: {
    width: number;
    height: number;
  };
}

const worldState = proxy<GameState>({
  entities: [],
  stage: {
    width: 1000,
    height: 1000,
  },
});

const worldStateActions = {
  addEntity: (entity: Entity) => {
    worldState.entities.push(entity);
    console.debug('Added entity', entity);
  },
  removeEntity: (id: number) => {
    worldState.entities = worldState.entities.filter(e => e.id !== id);
  },
  addBehaviorToEntity: (entityId: number, behavior: Behavior) => {
    const entity = worldState.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors.push(behavior);
    }
  },
  removeBehaviorFromEntity: (entityId: number, behaviorName: string) => {
    const entity = worldState.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors = entity.behaviors.filter(b => b.name !== behaviorName);
    }
  },
  updateEntities: (deltaTime: number) => {
    worldState.entities.forEach(entity => {
      entity.behaviors.forEach(behavior => {
        if (behavior.update) {
          behavior.update(entity, deltaTime);
        }
      });
    });
  },
  clearWorld: () => {
    worldState.entities = [];
  },
};

Object.assign(globalThis, { state: worldState });

export { worldStateActions, worldState };
