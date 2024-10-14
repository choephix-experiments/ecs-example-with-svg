import { proxy } from "valtio";
import { BuiltInBehaviorBlueprint } from "../behaviors/behaviors";
import {
  BehaviorProps,
  EntityBlueprint,
  StageEntityProps,
  WorldDataState,
} from "../types/data-types";
import { cloneDeep } from "../utils/core/cloneDeep";

export const worldDataState = proxy<WorldDataState>({
  entities: [],
  stage: {
    width: 1000,
    height: 1000,
  },
});

export const worldDataStateActions = {
  addEntity: (entityBlueprint: EntityBlueprint) => {
    const entityProps: StageEntityProps = {
      ...cloneDeep(entityBlueprint),
      uuid: crypto.randomUUID(),
    };
    worldDataState.entities.push(entityProps);
    return entityProps;
  },
  removeEntity: (id: string) => {
    worldDataState.entities = worldDataState.entities.filter(
      (e) => e.uuid !== id
    );
  },
  updateEntity: (id: string, updates: Partial<StageEntityProps>) => {
    const entity = worldDataState.entities.find((e) => e.uuid === id);
    if (entity) {
      Object.assign(entity, updates);
    }
  },
  addBehaviorToEntity: <T extends BuiltInBehaviorBlueprint>(
    entityId: string,
    behaviorBlueprint: T
  ) => {
    const entity = worldDataState.entities.find((e) => e.uuid === entityId);
    if (!entity) throw new Error("Entity not found");

    const behaviorProps: BehaviorProps = {
      ...cloneDeep(behaviorBlueprint),
      uuid: crypto.randomUUID(),
    };
    entity.behaviors.push(behaviorProps);
    return behaviorProps;
  },
  removeBehaviorFromEntity: (entityId: string, behaviorType: string) => {
    const entity = worldDataState.entities.find((e) => e.uuid === entityId);
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
    return worldDataState.entities.find((e) => e.uuid === id);
  },
};
