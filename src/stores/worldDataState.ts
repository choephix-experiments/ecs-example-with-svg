import { proxy } from "valtio";

import type {
  BehaviorBlueprint,
  BuiltInBehaviorBlueprint,
  StageEntityBlueprint,
} from "../types/blueprint-types";
import type {
  BehaviorProps,
  StageEntityProps,
  WorldStateProps,
} from "../types/data-types";
import { cloneDeep } from "../utils/core/cloneDeep";

export const worldDataState = proxy<WorldStateProps>({
  entities: [],
  stage: {
    width: 1000,
    height: 1000,
  },
});

const defaultEntityProps: Required<StageEntityBlueprint> = {
  name: "Nameless",
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  behaviors: [],
};

const defaultBehaviorProps: Required<BehaviorBlueprint> = {
  name: "Nameless",
  type: "CustomBehavior",
};

export const worldDataStateActions = {
  addEntity: (entityBlueprint: StageEntityBlueprint) => {
    const entityProps: StageEntityProps = {
      ...defaultEntityProps,
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
      ...defaultBehaviorProps,
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
