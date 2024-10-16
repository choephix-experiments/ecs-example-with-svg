import { proxy, subscribe } from "valtio";
import { worldDataState, worldDataStateActions } from "../stores/worldDataState";
import { StageEntityProps, BehaviorProps } from "../types/data-types";
import { findEntityBehaviorByUuid, findEntityBehaviorByType, findEntityBehaviorByName } from "../utils/finders";

type EasyBreezyEntity = StageEntityProps & {
  getBehavior: (search: string | ((behavior: BehaviorProps) => boolean)) => BehaviorProps | undefined;
  getBounds: () => { x: number; y: number; width: number; height: number };
  isInRange: (x: number, y: number, range: number) => boolean;
  destroy: () => void;
};

export function createEasyBreezyContext() {
  const easyBreezyState = proxy({
    entities: [] as EasyBreezyEntity[],
  });

  const updateEasyBreezyEntities = () => {
    easyBreezyState.entities = worldDataState.entities.map((entity) => {
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
        getBounds: () => ({
          x: entity.x,
          y: entity.y,
          width: 0,
          height: 0,
        }),
        isInRange: (x: number, y: number, range: number) => {
          const dx = x - entity.x;
          const dy = y - entity.y;
          return Math.sqrt(dx * dx + dy * dy) <= range;
        },
        destroy: () => worldDataStateActions.removeEntity(entity.uuid),
      };

      return new Proxy(easyEntity, {
        set(target, prop: string, value) {
          if (prop in entity) {
            worldDataStateActions.updateEntity(entity.uuid, { [prop]: value });
          }
          return Reflect.set(target, prop, value);
        },
      });
    });
  };

  // Initial update
  updateEasyBreezyEntities();

  // Subscribe to changes in worldDataState
  subscribe(worldDataState, () => {
    console.log("🔄 Updating EasyBreezy entities");
    updateEasyBreezyEntities();
  });

  return easyBreezyState;
}
