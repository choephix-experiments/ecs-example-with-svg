import type { BuiltInBehaviorProps } from "../resolvers/builtInBehaviorResolversDictionary";
import type { BehaviorProps, StageEntityProps } from "./data-types";

export type BuiltInBehaviorBlueprint<
  T extends BuiltInBehaviorProps = BuiltInBehaviorProps
> = Omit<T, "uuid">;

export type BehaviorBlueprint<T extends BehaviorProps = BehaviorProps> = //
  Omit<T, "uuid">;

export type StageEntityBlueprint = Omit<StageEntityProps, "uuid">;
