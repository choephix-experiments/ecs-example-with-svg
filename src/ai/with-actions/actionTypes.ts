import { BuiltInBehaviorBlueprint } from "../../behaviors/behaviors";
import { BehaviorProps, StageEntityProps } from "../../types/data-types";

export type ActionProps =
  | { type: "addEntity"; entityProps: StageEntityProps }
  | { type: "removeEntity"; entityId: string }
  | { type: "updateEntity"; entityId: string; updates: Partial<StageEntityProps> }
  | { type: "addBehavior"; entityId: string; behaviorProps: BuiltInBehaviorBlueprint }
  | { type: "removeBehavior"; entityId: string; behaviorType: string }
  | { type: "updateBehavior"; entityId: string; behaviorType: string; updates: Partial<BehaviorProps> }
  | { type: "clearWorld" }
  | { type: "selectEntities"; entityIds: string[] }
  | { type: "deselectEntities"; entityIds: string[] }
  | { type: "clearSelection" };
