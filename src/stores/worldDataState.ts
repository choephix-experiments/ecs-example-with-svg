import { proxy } from "valtio";
import { BuiltInBehaviorsProps } from "../behaviors/behaviors";
import {
  BehaviorProps,
  StageEntityProps,
  WorldDataState,
} from "../types/data-types";

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
  removeEntity: (id: string) => {
    worldDataState.entities = worldDataState.entities.filter(
      (e) => e.id !== id
    );
  },
  updateEntity: (id: string, updates: Partial<StageEntityProps>) => {
    const entity = worldDataState.entities.find((e) => e.id === id);
    if (entity) {
      Object.assign(entity, updates);
    }
  },
  addBehaviorToEntity: <T extends BuiltInBehaviorsProps | BehaviorProps>(
    entityId: string,
    behavior: T
  ) => {
    const entity = worldDataState.entities.find((e) => e.id === entityId);
    if (entity) {
      entity.behaviors.push(behavior);
    }
  },
  removeBehaviorFromEntity: (entityId: string, behaviorType: string) => {
    const entity = worldDataState.entities.find((e) => e.id === entityId);
    if (entity) {
      entity.behaviors = entity.behaviors.filter(
        (b) => b.type !== behaviorType
      );
    }
  },
  clearWorld: () => {
    worldDataState.entities = [];
  },
  getEntity: (id: string): StageEntityProps | undefined => {
    return worldDataState.entities.find((e) => e.id === id);
  },
};

Object.assign(globalThis, {
  worldDataState,
  worldDataStateActions,
});
