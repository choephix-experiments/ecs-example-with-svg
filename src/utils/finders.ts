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
