import { worldDataStateActions } from "../stores/worldDataState";
import { ideStateActions } from "../stores/ideStore";
import { ActionProps } from "./actionTypes";

type ActionResolver<T extends ActionProps['type']> = (action: Extract<ActionProps, { type: T }>) => void;

const actionResolvers: {
  [K in ActionProps['type']]: ActionResolver<K>
} = {
  addEntity: (action) => {
    console.log("➕ Adding entity:", action.entityProps.uuid);
    worldDataStateActions.addEntity(action.entityProps);
  },

  removeEntity: (action) => {
    console.log("➖ Removing entity:", action.entityId);
    worldDataStateActions.removeEntity(action.entityId);
  },

  updateEntity: (action) => {
    console.log("🔄 Updating entity:", action.entityId);
    const entity = worldDataStateActions.getEntity(action.entityId);
    if (!entity) throw new Error("Entity not found");
    Object.assign(entity, action.updates);
  },

  addBehavior: (action) => {
    console.log("🧠 Adding behavior to entity:", action.entityId);
    worldDataStateActions.addBehaviorToEntity(action.entityId, action.behaviorProps);
  },

  removeBehavior: (action) => {
    console.log("🗑️ Removing behavior from entity:", action.entityId);
    worldDataStateActions.removeBehaviorFromEntity(action.entityId, action.behaviorType);
  },

  updateBehavior: (action) => {
    console.log("🔧 Updating behavior for entity:", action.entityId);
    const entity = worldDataStateActions.getEntity(action.entityId);
    if (!entity) throw new Error("Entity not found");

    const behaviorIndex = entity.behaviors.findIndex((b) => b.type === action.behaviorType);
    if (behaviorIndex < 0) throw new Error("Behavior not found");

    const updatedBehavior = { ...entity.behaviors[behaviorIndex], ...action.updates };
    entity.behaviors[behaviorIndex] = updatedBehavior;
    worldDataStateActions.updateEntity(action.entityId, { behaviors: [...entity.behaviors] });
  },

  clearWorld: () => {
    console.log("🧹 Clearing the world");
    worldDataStateActions.clearWorld();
  },

  selectEntities: (action) => {
    console.log("🔍 Selecting entities:", action.entityIds);
    ideStateActions.setSelectedEntityIds(action.entityIds);
  },

  deselectEntities: (action) => {
    console.log("👋 Deselecting entities:", action.entityIds);
    ideStateActions.removeSelectedEntityIds(action.entityIds);
  },

  clearSelection: () => {
    console.log("🧹 Clearing entity selection");
    ideStateActions.clearSelection();
  },
};

export const resolveAction = (action: ActionProps): void => {
  console.log("🎬 Resolving action:", action.type);

  try {
    const resolver = actionResolvers[action.type];
    if (resolver) {
      resolver(action as any);
    } else {
      console.error("❌ Unknown action type:", action.type);
    }
  } catch (error) {
    console.error(`❌ Error resolving action ${action.type}:`, error);
  }
};
