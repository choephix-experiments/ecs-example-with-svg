import { worldDataState, worldDataStateActions } from '../stores/worldDataState';
import { ideStateActions } from '../stores/ideStore';
import { StageEntityProps, BehaviorProps } from '../types/data-types';
import { BuiltInBehaviorsProps, BuiltInBehaviorsPropsDictionary } from '../behaviors/behaviors';
import { findBehavior } from '../utils/findBehavior';

export const magicApi = {
  // Select an entity or deselect entities
  selectEntity: (entityId: number | null) => {
    ideStateActions.setSelectedEntityId(entityId);
  },

  // Add a new entity
  addEntity: (entity: StageEntityProps) => {
    worldDataStateActions.addEntity(entity);
    return entity;
  },

  // Remove an entity
  removeEntity: (entityId: number) => {
    worldDataStateActions.removeEntity(entityId);
  },

  // Add a behavior to an entity
  addBehaviorToEntity: <T extends BuiltInBehaviorsProps | BehaviorProps>(
    entityOrId: StageEntityProps | number,
    behavior: T
  ) => {
    const entityId = typeof entityOrId === 'number' ? entityOrId : entityOrId.id;
    worldDataStateActions.addBehaviorToEntity(entityId, behavior);
  },

  // Remove a behavior from an entity
  removeBehaviorFromEntity: (
    entityOrId: StageEntityProps | number,
    behaviorType: string
  ) => {
    const entityId = typeof entityOrId === 'number' ? entityOrId : entityOrId.id;
    worldDataStateActions.removeBehaviorFromEntity(entityId, behaviorType);
  },

  // Get an entity by ID
  getEntity: (entityId: number): StageEntityProps | undefined => {
    return worldDataState.entities.find(e => e.id === entityId);
  },

  // Get a behavior from an entity by type
  getEntityBehavior: <T extends keyof BuiltInBehaviorsPropsDictionary>(
    entityOrId: StageEntityProps | number,
    behaviorType: T
  ): BuiltInBehaviorsPropsDictionary[T] | undefined => {
    const entity = typeof entityOrId === 'number' ? magicApi.getEntity(entityOrId) : entityOrId;
    if (entity) {
      return findBehavior(entity, behaviorType);
    }
    return undefined;
  },

  // Update an entity
  updateEntity: (entityId: number, updates: Partial<StageEntityProps>) => {
    worldDataStateActions.updateEntity(entityId, updates);
  },

  // Clear all entities from the world
  clearWorld: () => {
    worldDataStateActions.clearWorld();
  },

  // Get all entities
  getAllEntities: (): StageEntityProps[] => {
    return worldDataState.entities;
  },
};

