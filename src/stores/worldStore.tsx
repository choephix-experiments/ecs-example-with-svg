import { proxy } from 'valtio';
import { Behavior, Entity } from '../types';

interface GameState {
  entities: Entity[];
  selectedEntityId: number | null;
}

const state = proxy<GameState>({
  entities: [],
  selectedEntityId: null,
});

const actions = {
  addEntity: (entity: Entity) => {
    state.entities.push(entity);
    console.log('Added entity', entity);
  },
  removeEntity: (id: number) => {
    state.entities = state.entities.filter(e => e.id !== id);
  },
  addBehaviorToEntity: (entityId: number, behavior: Behavior) => {
    const entity = state.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors.push(behavior);
    }
  },
  removeBehaviorFromEntity: (entityId: number, behaviorName: string) => {
    const entity = state.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors = entity.behaviors.filter(b => b.name !== behaviorName);
    }
  },
  setSelectedEntityId: (id: number | null) => {
    state.selectedEntityId = id;
  },
  updateEntities: (deltaTime: number) => {
    state.entities.forEach(entity => {
      entity.behaviors.forEach(behavior => {
        if (behavior.update) {
          behavior.update(entity, deltaTime);
        }
      });
    });
  },
  clearWorld: () => {
    state.entities = [];
    state.selectedEntityId = null;
  },
};

Object.assign(globalThis, { state });

export { actions, state };
