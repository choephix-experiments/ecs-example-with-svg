import {
  BuiltInBehaviorProps,
  BuiltInBehaviorType,
} from "../resolvers/builtInBehaviorResolversDictionary";
import { ReadonlyDeep, StageEntityProps } from "../types/data-types";

export function findBehavior<K extends BuiltInBehaviorType>(
  entity: ReadonlyDeep<StageEntityProps>,
  behaviorType: K
): BuiltInBehaviorProps<K> | undefined {
  return entity.behaviors.find((b) => b.type === behaviorType) as
    | BuiltInBehaviorProps<K>
    | undefined;
}
