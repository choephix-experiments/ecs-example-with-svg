import { BuiltInBehaviorsPropsDictionary } from "../behaviors/behaviors";
import { ReadonlyDeep, StageEntityProps } from "../types/data-types";

export function findBehavior<T extends keyof BuiltInBehaviorsPropsDictionary>(
  entity: ReadonlyDeep<StageEntityProps>,
  behaviorType: T
): BuiltInBehaviorsPropsDictionary[T] | undefined {
  return entity.behaviors.find(
    (b) => b.type === behaviorType
  ) as BuiltInBehaviorsPropsDictionary[T] | undefined;
}
