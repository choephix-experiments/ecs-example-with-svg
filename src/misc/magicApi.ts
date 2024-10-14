import { BuiltInBehaviorsPropsDictionary } from "../behaviors/behaviors";
import { worldDataState } from "../stores/worldDataState";
import { StageEntityProps } from "../types/data-types";
import { findBehavior } from "../utils/findBehavior";

export const magicApi = {
  // Get all entities
  getAllEntities: (): StageEntityProps[] => {
    return worldDataState.entities;
  },

  // Find an entity by ID
  findEntityById: (id: string): StageEntityProps | undefined => {
    return worldDataState.entities.find((entity) => entity.id === id);
  },

  // Find the first entity that matches the condition
  findEntity: (
    condition: (entity: StageEntityProps) => boolean
  ): StageEntityProps | undefined => {
    return worldDataState.entities.find(condition);
  },

  // Get a behavior from an entity by type (kept as is)
  getEntityBehavior: <T extends keyof BuiltInBehaviorsPropsDictionary>(
    entityOrId: StageEntityProps | string,
    behaviorType: T
  ): BuiltInBehaviorsPropsDictionary[T] | undefined => {
    const entity =
      typeof entityOrId === "string"
        ? magicApi.findEntityById(entityOrId)
        : entityOrId;
    if (!entity) return undefined;

    return findBehavior(entity, behaviorType);
  },
};
