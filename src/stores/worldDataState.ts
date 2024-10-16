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

export const defaultEntityProps: Required<StageEntityBlueprint> = {
  name: "Nameless",
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  behaviors: [],
};

export const defaultBehaviorProps: Required<BehaviorBlueprint> = {
  name: "Nameless",
  type: "CustomBehavior",
};

export const worldDataStateActions = {
  addEntity: (entityBlueprint: StageEntityBlueprint) => {
    const entityProps = blueprintConverter.toEntityProps(entityBlueprint);

    //// Apply extra-care fixes, like ensuring all numbers are numbers
    //// and that behaviors is an array
    for (const key of ["x", "y", "rotation", "scale"] as const) {
      if (typeof entityProps[key] === "string") {
        entityProps[key] = parseFloat(entityProps[key]);
      }
      if (isNaN(entityProps[key])) {
        entityProps[key] = defaultEntityProps[key];
      }
    }
    for (const key of ["name", "uuid"] as const) {
      if (typeof entityProps[key] !== "string") {
        entityProps[key] = String(entityProps[key]);
      }
    }

    if (!Array.isArray(entityBlueprint.behaviors)) {
      if (entityBlueprint.behaviors !== null) {
        if (typeof entityBlueprint.behaviors === "object") {
          entityBlueprint.behaviors = [entityBlueprint.behaviors];
        }
      }
      // entityBlueprint.behaviors = [];
    }

    entityProps.behaviors = [];
    for (const behaviorBlueprint of entityBlueprint.behaviors ?? []) {
      console.log("🔄 Adding behavior to entity", behaviorBlueprint);
      const behaviorProps = blueprintConverter.toBehaviorProps(behaviorBlueprint);
      entityProps.behaviors.push(behaviorProps);
    }

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

    const behaviorProps = blueprintConverter.toBehaviorProps(behaviorBlueprint);
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

const blueprintConverter = {
  toEntityProps: (blueprint: StageEntityBlueprint): StageEntityProps => {
    return {
      ...defaultEntityProps,
      ...cloneDeep(blueprint),
      uuid: crypto.randomUUID(),
    };
  },
  toBehaviorProps: (blueprint: BehaviorBlueprint): BehaviorProps => {
    return {
      ...defaultBehaviorProps,
      ...cloneDeep(blueprint),
      uuid: crypto.randomUUID(),
    };
  },
};
