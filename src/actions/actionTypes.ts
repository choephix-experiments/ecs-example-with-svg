import { BehaviorProps, StageEntityProps } from "../types/data-types";

export type ActionType =
  | "ADD_ENTITY"
  | "REMOVE_ENTITY"
  | "UPDATE_ENTITY"
  | "ADD_BEHAVIOR"
  | "REMOVE_BEHAVIOR"
  | "UPDATE_BEHAVIOR"
  | "CLEAR_WORLD";

export interface Action {
  type: ActionType;
  payload: any;
}

export interface AddEntityAction extends Action {
  type: "ADD_ENTITY";
  payload: StageEntityProps;
}

export interface RemoveEntityAction extends Action {
  type: "REMOVE_ENTITY";
  payload: string; // entity id
}

export interface UpdateEntityAction extends Action {
  type: "UPDATE_ENTITY";
  payload: {
    id: string;
    updates: Partial<StageEntityProps>;
  };
}

export interface AddBehaviorAction extends Action {
  type: "ADD_BEHAVIOR";
  payload: {
    entityId: string;
    behavior: BehaviorProps;
  };
}

export interface RemoveBehaviorAction extends Action {
  type: "REMOVE_BEHAVIOR";
  payload: {
    entityId: string;
    behaviorType: string;
  };
}

export interface UpdateBehaviorAction extends Action {
  type: "UPDATE_BEHAVIOR";
  payload: {
    entityId: string;
    behaviorType: string;
    updates: Partial<BehaviorProps>;
  };
}

export interface ClearWorldAction extends Action {
  type: "CLEAR_WORLD";
}

export type GameAction =
  | AddEntityAction
  | RemoveEntityAction
  | UpdateEntityAction
  | AddBehaviorAction
  | RemoveBehaviorAction
  | UpdateBehaviorAction
  | ClearWorldAction;
