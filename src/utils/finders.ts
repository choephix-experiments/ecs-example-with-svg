import { worldDataState } from "../stores/worldDataState";

import type {
  BuiltInBehaviorProps,
  BuiltInBehaviorType,
} from "../resolvers/builtInBehaviorResolversDictionary";
import type {
  BehaviorProps,
  ReadonlyDeep,
  StageEntityProps,
} from "../types/data-types";
import { builtInBehaviorResolversDictionary } from "../resolvers/builtInBehaviorResolversDictionary";

export function findEntityByUuid(entityUuid: string) {
  return worldDataState.entities.find((entity) => entity.uuid === entityUuid);
}

export function findEntityByName(entityName: string) {
  return worldDataState.entities.find((entity) => entity.name === entityName);
}

export function findEntityByBehaviorType(behaviorType: string) {
  return worldDataState.entities.find((entity) =>
    entity.behaviors.some((behavior) => behavior.type === behaviorType)
  );
}

export function findEntity(condition: (entity: StageEntityProps) => boolean) {
  return worldDataState.entities.find(condition);
}

export function findEntities(condition: (entity: StageEntityProps) => boolean) {
  return worldDataState.entities.filter(condition);
}

export function findEntityBehaviorByUuid<
  K extends BuiltInBehaviorType = BuiltInBehaviorType,
  E extends StageEntityProps | ReadonlyDeep<StageEntityProps> = StageEntityProps
>(entity: E, behaviorUuid: string): E extends StageEntityProps
  ? BuiltInBehaviorProps<K> | undefined
  : ReadonlyDeep<BuiltInBehaviorProps<K>> | undefined {
  return entity.behaviors.find((behavior) => behavior.uuid === behaviorUuid) as any;
}

export function findEntityBehaviorByType<
  K extends BuiltInBehaviorType = BuiltInBehaviorType,
  E extends StageEntityProps | ReadonlyDeep<StageEntityProps> = StageEntityProps
>(
  entity: E,
  behaviorType: K
): E extends StageEntityProps
  ? BuiltInBehaviorProps<K> | undefined
  : ReadonlyDeep<BuiltInBehaviorProps<K>> | undefined {
  return entity.behaviors.find(
    (behavior) => behavior.type === behaviorType
  ) as any;
}

export function findEntityBehaviorByName<
  K extends BuiltInBehaviorType = BuiltInBehaviorType,
  E extends StageEntityProps | ReadonlyDeep<StageEntityProps> = StageEntityProps
>(entity: E, behaviorName: string): E extends StageEntityProps
  ? BuiltInBehaviorProps<K> | undefined
  : ReadonlyDeep<BuiltInBehaviorProps<K>> | undefined {
  return entity.behaviors.find((behavior) => behavior.name === behaviorName) as any;
}

export function findEntityBehavior<
  E extends StageEntityProps | ReadonlyDeep<StageEntityProps> = StageEntityProps
>(
  entity: E,
  condition: (behavior: BehaviorProps | BuiltInBehaviorType) => boolean
): E extends StageEntityProps
  ? BehaviorProps | BuiltInBehaviorType | undefined
  : ReadonlyDeep<BehaviorProps | BuiltInBehaviorType> | undefined {
  return entity.behaviors.find(condition) as any;
}

export function getEntityBounds(entity: ReadonlyDeep<StageEntityProps>) {
  const boundsList = entity.behaviors
    .map((behavior) => {
      const key = behavior.type as keyof typeof builtInBehaviorResolversDictionary;
      const resolver = builtInBehaviorResolversDictionary[key];
      if (resolver?.getBounds) {
        return (resolver as any).getBounds.call(behavior, entity);
      }
      return undefined;
    })
    .filter(Boolean) as { x: number; y: number; width: number; height: number }[];

  if (boundsList.length === 0) return undefined;

  const minX = Math.min(...boundsList.map((b) => b.x));
  const minY = Math.min(...boundsList.map((b) => b.y));
  const maxX = Math.max(...boundsList.map((b) => b.x + b.width));
  const maxY = Math.max(...boundsList.map((b) => b.y + b.height));

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    x: minX + width / 2,
    y: minY + height / 2,
    width,
    height,
  };
}
