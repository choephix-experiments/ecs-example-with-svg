import type {
  BehaviorBlueprint,
  StageEntityBlueprint,
} from "../../types/blueprint-types";

export type ActionProps =
  | { type: "addEntity"; entityProps: StageEntityBlueprint }
  | { type: "removeEntity"; entityId: string }
  | {
      type: "updateEntity";
      entityId: string;
      updates: Partial<StageEntityBlueprint>;
    }
  | {
      type: "addBehavior";
      entityId: string;
      behaviorProps: BehaviorBlueprint;
    }
  | { type: "removeBehavior"; entityId: string; behaviorType: string }
  | {
      type: "updateBehavior";
      entityId: string;
      behaviorType: string;
      updates: Partial<BehaviorBlueprint>;
    }
  | { type: "clearWorld" }
  | { type: "selectEntities"; entityIds: string[] }
  | { type: "deselectEntities"; entityIds: string[] }
  | { type: "clearSelection" };
