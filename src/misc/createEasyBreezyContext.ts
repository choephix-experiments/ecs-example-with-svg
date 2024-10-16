import { proxy, subscribe } from "valtio";
import { worldDataState, worldDataStateActions } from "../stores/worldDataState";
import { StageEntityProps, BehaviorProps } from "../types/data-types";

type EasyBreezyEntity = StageEntityProps & {
  getBehavior: (type: string) => BehaviorProps | undefined;
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
        getBehavior: (type: string) => entity.behaviors.find(b => b.type === type),
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

