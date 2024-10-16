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
  global: {
    timeScale: 0,
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
    const fixedBlueprint = blueprintFixer.fixEntityBlueprint(entityBlueprint);
    const entityProps = blueprintConverter.toEntityProps(fixedBlueprint);
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

    return entity;
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

const blueprintFixer = {
  fixEntityBlueprint(blueprint: StageEntityBlueprint) {
    const fixedBlueprint = { ...blueprint };

    for (const key of ["x", "y", "rotation", "scale"] as const) {
      if (typeof fixedBlueprint[key] === "string") {
        fixedBlueprint[key] = parseFloat(fixedBlueprint[key]);
      }
      if (isNaN(fixedBlueprint[key])) {
        fixedBlueprint[key] = defaultEntityProps[key];
      }
    }

    for (const key of ["name"] as const) {
      if (typeof fixedBlueprint[key] !== "string") {
        fixedBlueprint[key] = String(fixedBlueprint[key]);
      }
    }

    if (!Array.isArray(fixedBlueprint.behaviors)) {
      fixedBlueprint.behaviors = [fixedBlueprint.behaviors];
    }

    for (const behaviorBlueprintIndex in fixedBlueprint.behaviors ?? []) {
      const behaviorBlueprint =
        fixedBlueprint.behaviors[behaviorBlueprintIndex];
      const fixedBehaviorBlueprint =
        this.fixBehaviorBlueprint(behaviorBlueprint);
      const behaviorProps = blueprintConverter.toBehaviorProps(
        fixedBehaviorBlueprint
      );
      fixedBlueprint.behaviors[behaviorBlueprintIndex] = behaviorProps;
    }

    return fixedBlueprint;
  },
  fixBehaviorBlueprint(blueprint: BehaviorBlueprint) {
    if (typeof blueprint === "string") {
      blueprint = { type: blueprint };
    }

    return { ...blueprint };
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
