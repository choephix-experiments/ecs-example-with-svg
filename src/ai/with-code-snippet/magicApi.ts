import { BuiltInBehaviorBlueprint, BuiltInBehaviorsPropsDictionary } from "../../behaviors/behaviors";
import { ideStateActions } from "../../stores/ideStore";
import { worldDataState, worldDataStateActions } from "../../stores/worldDataState";
import { BehaviorProps, StageEntityProps } from "../../types/data-types";
import { findBehavior } from "../../utils/findBehavior";

export const magicApi = {
  // Get all entities
  getAllEntities: (): StageEntityProps[] => {
    return worldDataState.entities;
  },

  // Find an entity by ID
  findEntityById: (id: string): StageEntityProps | undefined => {
    return worldDataState.entities.find((entity) => entity.uuid === id);
  },

  // Find the first entity that matches the condition
  findEntity: (
    condition: (entity: StageEntityProps) => boolean
  ): StageEntityProps | undefined => {
    return worldDataState.entities.find(condition);
  },
  
  findEntities: (
    condition: (entity: StageEntityProps) => boolean
  ): StageEntityProps[] => {
    return worldDataState.entities.filter(condition);
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

  // New methods for actions
  addEntity: (entityProps: StageEntityProps): void => {
    console.log('➕ Adding entity:', entityProps.uuid);
    worldDataStateActions.addEntity(entityProps);
  },

  removeEntity: (entityId: string): void => {
    console.log('➖ Removing entity:', entityId);
    worldDataStateActions.removeEntity(entityId);
  },

  updateEntity: (entityId: string, updates: Partial<StageEntityProps>): void => {
    console.log('🔄 Updating entity:', entityId);
    const entity = worldDataStateActions.getEntity(entityId);
    if (!entity) throw new Error("Entity not found");
    Object.assign(entity, updates);
  },

  addBehavior: (entityId: string, behaviorProps: BuiltInBehaviorBlueprint): void => {
    console.log('🧠 Adding behavior to entity:', entityId);
    worldDataStateActions.addBehaviorToEntity(entityId, behaviorProps);
  },

  removeBehavior: (entityId: string, behaviorType: string): void => {
    console.log('🗑️ Removing behavior from entity:', entityId);
    worldDataStateActions.removeBehaviorFromEntity(entityId, behaviorType);
  },

  updateBehavior: (entityId: string, behaviorType: string, updates: Partial<BehaviorProps>): void => {
    console.log('🔧 Updating behavior for entity:', entityId);
    const entity = worldDataStateActions.getEntity(entityId);
    if (!entity) throw new Error("Entity not found");

    const existingBehaviorIndex = entity.behaviors.findIndex(
      (b) => b.type === behaviorType
    );
    const existingBehavior = entity.behaviors[existingBehaviorIndex] as
      | BehaviorProps
      | undefined;
    if (existingBehavior) {
      Object.assign(existingBehavior, updates);
    } else {
      const newBehavior = {
        type: behaviorType,
        ...updates,
        uuid: crypto.randomUUID(),
      };
      entity.behaviors.push(newBehavior);
    }
  },

  clearWorld: (): void => {
    console.log('🧹 Clearing the world');
    worldDataStateActions.clearWorld();
  },

  selectEntities: (entityIds: string[]): void => {
    console.log('🔍 Selecting entities:', entityIds);
    ideStateActions.setSelectedEntityIds(entityIds);
  },

  deselectEntities: (entityIds: string[]): void => {
    console.log('👋 Deselecting entities:', entityIds);
    ideStateActions.removeSelectedEntityIds(entityIds);
  },

  clearSelection: (): void => {
    console.log('🧹 Clearing entity selection');
    ideStateActions.clearSelection();
  },
};
