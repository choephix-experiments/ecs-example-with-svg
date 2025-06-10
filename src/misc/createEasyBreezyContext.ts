import { subscribe } from 'valtio';
import { worldDataState, worldDataStateActions } from '../stores/worldDataState';
import { ideState, ideStateActions } from '../stores/ideStore';
import { BehaviorProps, StageEntityProps } from '../types/data-types';
import {
  findEntityBehaviorByName,
  findEntityBehaviorByType,
  findEntityBehaviorByUuid,
} from '../utils/finders';
import { StageEntityBlueprint } from '../types/blueprint-types';
import { createInputTracker } from '../input/createInputTracker';

type EasyBreezyEntity = StageEntityProps & {
  getBehavior: (
    search: string | ((behavior: BehaviorProps) => boolean),
    createIfNotFound: boolean
  ) => BehaviorProps | undefined;
  removeBehavior: (search: string | ((behavior: BehaviorProps) => boolean)) => void;
  addBehavior: (behaviorBlueprint: any) => BehaviorProps;
  getBounds: () => { x: number; y: number; width: number; height: number };
  isInRange: (x: number, y: number, range: number) => boolean;
  getDistance: (x: number, y: number) => number;
  destroy: () => void;
  getRawProps: () => StageEntityProps;
};

type SearchParam<T> = string | ((entity: T) => boolean);

const input = createInputTracker();

// Module-level cache for EasyBreezyEntity proxies
const easyBreezyEntityCache: Record<string, EasyBreezyEntity> = {};

export function createEasyBreezyContext() {
  const easyBreezyState = {
    input: input,
    stage: worldDataState.stage,
    entities: [] as EasyBreezyEntity[],
    addEntity: (entityBlueprint: StageEntityBlueprint): EasyBreezyEntity => {
      const newEntity = worldDataStateActions.addEntity(entityBlueprint);
      updateEasyBreezyEntities();
      return easyBreezyState.getEntity(newEntity.uuid)!;
    },
    duplicateEntity: (search: SearchParam<EasyBreezyEntity>) => {
      const originalEntity = easyBreezyState.getEntity(search);
      if (originalEntity) {
        const newEntityBlueprint = { ...originalEntity.getRawProps() };
        return easyBreezyState.addEntity(newEntityBlueprint);
      }
      return undefined;
    },
    getEntity: (
      search: string | ((entity: EasyBreezyEntity) => boolean)
    ): EasyBreezyEntity | undefined => {
      if (typeof search === 'string') {
        // Try to find by UUID first
        let entity = easyBreezyState.entities.find(e => e.uuid === search);
        if (entity) return entity;

        // Then by name
        entity = easyBreezyState.entities.find(e => e.name === search);
        if (entity) return entity;

        // Finally by any property that matches the string
        return easyBreezyState.entities.find(e =>
          Object.values(e).some(value => typeof value === 'string' && value.includes(search))
        );
      } else if (typeof search === 'function') {
        // Use the condition function
        return easyBreezyState.entities.find(search);
      }
      return undefined;
    },
    getEntities: (
      search: string | ((entity: EasyBreezyEntity) => boolean) | string[]
    ): EasyBreezyEntity[] => {
      if (Array.isArray(search)) {
        return search
          .map(id => easyBreezyState.getEntity(id))
          .filter(Boolean) as EasyBreezyEntity[];
      } else if (typeof search === 'function') {
        return easyBreezyState.entities.filter(search);
      } else {
        const entity = easyBreezyState.getEntity(search);
        return entity ? [entity] : [];
      }
    },
    removeEntity: (search: string | ((entity: EasyBreezyEntity) => boolean)): void => {
      const entity = easyBreezyState.getEntity(search);
      if (entity) {
        worldDataStateActions.removeEntity(entity.uuid);
        easyBreezyState.entities = easyBreezyState.entities.filter(e => e.uuid !== entity.uuid);
      }
    },
    getSelectedEntities: (): EasyBreezyEntity[] => {
      const selectedEntityIds = ideState.selectedEntityIds;
      return easyBreezyState.getEntities(selectedEntityIds);
    },
    selectEntities: (search: string | ((entity: EasyBreezyEntity) => boolean) | string[]) => {
      const entitiesToSelect = easyBreezyState.getEntities(search);
      const entityIds = entitiesToSelect.map(entity => entity.uuid);
      console.log('🔍 Selecting entities:', entityIds);
      ideStateActions.setSelectedEntityIds(entityIds);
      return entitiesToSelect;
    },
    deselectEntities: (search: string | ((entity: EasyBreezyEntity) => boolean) | string[]) => {
      const entitiesToDeselect = easyBreezyState.getEntities(search);
      const entityIds = entitiesToDeselect.map(entity => entity.uuid);
      console.log('👋 Deselecting entities:', entityIds);
      ideStateActions.removeSelectedEntityIds(entityIds);
    },
    clearSelection: () => {
      console.log('🧹 Clearing entity selection');
      ideStateActions.clearSelection();
    },
    clearWorld: () => {
      console.log('🧹 Clearing the world');
      worldDataStateActions.clearWorld();
      // Clear the cache as well
      Object.keys(easyBreezyEntityCache).forEach(uuid => delete easyBreezyEntityCache[uuid]);
    },
  };

  function createEasyBreezyEntity(entity: StageEntityProps): EasyBreezyEntity {
    // If a proxy for this uuid exists, update its reference and return it
    const cached = easyBreezyEntityCache[entity.uuid];
    if (cached) {
      // Update the underlying reference for getRawProps
      (cached as any).getRawProps = () => entity;
      // Also update all direct properties (x, y, etc.)
      Object.assign(cached, entity);
      return cached;
    }
    const easyEntity: EasyBreezyEntity = {
      ...entity,
      getBehavior: (search, createIfNotFound = true) => {
        if (typeof search === 'string') {
          // Try to find by UUID first
          const byUuid = findEntityBehaviorByUuid(entity, search);
          if (byUuid) return byUuid;

          // Then by type
          const byType = findEntityBehaviorByType(entity, search as any);
          if (byType) return byType;

          // Finally by name
          return findEntityBehaviorByName(entity, search);
        } else if (typeof search === 'function') {
          // Use the condition function
          return entity.behaviors.find(search);
        }

        if (createIfNotFound) {
          const newBehavior = worldDataStateActions.addBehaviorToEntity(entity.uuid, search as any);
          return newBehavior;
        }

        return null;
      },
      removeBehavior: search => {
        const behavior = easyEntity.getBehavior(search, false);
        if (behavior) {
          worldDataStateActions.removeBehaviorFromEntity(entity.uuid, behavior.type);
        }
      },
      addBehavior: behaviorBlueprint => {
        return worldDataStateActions.addBehaviorToEntity(entity.uuid, behaviorBlueprint);
      },
      getBounds: () => ({
        x: entity.x,
        y: entity.y,
        width: 0,
        height: 0,
      }),
      isInRange: (x: number, y: number, range: number) => {
        return easyEntity.getDistance(x, y) <= range;
      },
      getDistance: (x: number, y: number) => {
        const dx = x - entity.x;
        const dy = y - entity.y;
        return Math.sqrt(dx * dx + dy * dy);
      },
      destroy: () => worldDataStateActions.removeEntity(entity.uuid),
      getRawProps: () => entity,
    };

    const proxy = new Proxy(easyEntity, {
      set(target, prop: string, value) {
        if (prop in entity) {
          worldDataStateActions.updateEntity(entity.uuid, { [prop]: value });
        }
        return Reflect.set(target, prop, value);
      },
    });
    easyBreezyEntityCache[entity.uuid] = proxy;
    return proxy;
  }

  const updateEasyBreezyEntities = () => {
    // Remove proxies for entities that no longer exist
    const currentUuids = new Set(worldDataState.entities.map(e => e.uuid));
    Object.keys(easyBreezyEntityCache).forEach(uuid => {
      if (!currentUuids.has(uuid)) {
        delete easyBreezyEntityCache[uuid];
      }
    });
    // Update the entities array with proxies from the cache
    easyBreezyState.entities = worldDataState.entities.map(createEasyBreezyEntity);
  };

  // Initial update
  updateEasyBreezyEntities();

  // Subscribe to changes in worldDataState
  subscribe(worldDataState, () => updateEasyBreezyEntities());

  return easyBreezyState;
}
