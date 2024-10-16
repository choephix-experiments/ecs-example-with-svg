import { subscribe } from "valtio";
import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { BehaviorProps, StageEntityProps } from "../types/data-types";
import {
  findEntityBehaviorByName,
  findEntityBehaviorByType,
  findEntityBehaviorByUuid,
} from "../utils/finders";

type EasyBreezyEntity = StageEntityProps & {
  getBehavior: (
    search: string | ((behavior: BehaviorProps) => boolean),
    createIfNotFound: boolean
  ) => BehaviorProps | undefined;
  removeBehavior: (
    search: string | ((behavior: BehaviorProps) => boolean)
  ) => void;
  addBehavior: (behaviorBlueprint: any) => BehaviorProps;
  getBounds: () => { x: number; y: number; width: number; height: number };
  isInRange: (x: number, y: number, range: number) => boolean;
  getDistance: (x: number, y: number) => number;
  destroy: () => void;
};

export function createEasyBreezyContext() {
  const easyBreezyState = {
    entities: [] as EasyBreezyEntity[],
  };

  const updateEasyBreezyEntities = () => {
    easyBreezyState.entities = worldDataState.entities.map((entity) => {
      const easyEntity: EasyBreezyEntity = {
        ...entity,
        getBehavior: (search, createIfNotFound = true) => {
          if (typeof search === "string") {
            // Try to find by UUID first
            const byUuid = findEntityBehaviorByUuid(entity, search);
            if (byUuid) return byUuid;

            // Then by type
            const byType = findEntityBehaviorByType(entity, search as any);
            if (byType) return byType;

            // Finally by name
            return findEntityBehaviorByName(entity, search);
          } else if (typeof search === "function") {
            // Use the condition function
            return entity.behaviors.find(search);
          }

          if (createIfNotFound) {
            const newBehavior = worldDataStateActions.addBehaviorToEntity(
              entity.uuid,
              search as any
            );
            return newBehavior;
          }

          return null;
        },
        removeBehavior: (search) => {
          const behavior = easyEntity.getBehavior(search, false);
          if (behavior) {
            worldDataStateActions.removeBehaviorFromEntity(
              entity.uuid,
              behavior.type
            );
          }
        },
        addBehavior: (behaviorBlueprint) => {
          return worldDataStateActions.addBehaviorToEntity(
            entity.uuid,
            behaviorBlueprint
          );
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
