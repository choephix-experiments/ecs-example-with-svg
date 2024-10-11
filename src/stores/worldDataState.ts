import { proxy } from 'valtio';
import { AnyBehaviorProps } from '../behaviors/behaviors';

export interface StageEntityProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: AnyBehaviorProps[];
}

export interface WorldDataState {
  entities: StageEntityProps[];
  stage: {
    width: number;
    height: number;
  };
}

export const worldDataState = proxy<WorldDataState>({
  entities: [],
  stage: {
    width: 1000,
    height: 1000,
  },
});

export const worldDataStateActions = {
  addEntity: (entity: StageEntityProps) => {
    worldDataState.entities.push(entity);
  },
  removeEntity: (id: number) => {
    worldDataState.entities = worldDataState.entities.filter(e => e.id !== id);
  },
  updateEntity: (id: number, updates: Partial<StageEntityProps>) => {
    const entity = worldDataState.entities.find(e => e.id === id);
    if (entity) {
      Object.assign(entity, updates);
    }
  },
  addBehaviorToEntity: (entityId: number, behavior: AnyBehaviorProps) => {
    const entity = worldDataState.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors.push(behavior);
    }
  },
  removeBehaviorFromEntity: (entityId: number, behaviorType: string) => {
    const entity = worldDataState.entities.find(e => e.id === entityId);
    if (entity) {
      entity.behaviors = entity.behaviors.filter(b => b.type !== behaviorType);
    }
  },
  clearWorld: () => {
    worldDataState.entities = [];
  },
};
