import { worldDataStateActions } from "../stores/worldDataState";
import { ideStateActions } from "../stores/ideStore";
import { GameAction } from "./actionTypes";

export const resolveAction = (action: GameAction): void => {
  console.log("🎬 Resolving action:", action.type);

  switch (action.type) {
    case "ADD_ENTITY":
      console.log("➕ Adding entity:", action.payload.id);
      worldDataStateActions.addEntity(action.payload);
      break;

    case "REMOVE_ENTITY":
      console.log("➖ Removing entity:", action.payload);
      worldDataStateActions.removeEntity(action.payload);
      break;

    case "UPDATE_ENTITY":
      console.log("🔄 Updating entity:", action.payload.id);
      worldDataStateActions.updateEntity(
        action.payload.id,
        action.payload.updates
      );
      break;

    case "ADD_BEHAVIOR":
      console.log("🧠 Adding behavior to entity:", action.payload.entityId);
      worldDataStateActions.addBehaviorToEntity(
        action.payload.entityId,
        action.payload.behavior
      );
      break;

    case "REMOVE_BEHAVIOR":
      console.log("🗑️ Removing behavior from entity:", action.payload.entityId);
      worldDataStateActions.removeBehaviorFromEntity(
        action.payload.entityId,
        action.payload.behaviorType
      );
      break;

    case "UPDATE_BEHAVIOR":
      console.log("🔧 Updating behavior for entity:", action.payload.entityId);
      const entity = worldDataStateActions.getEntity(action.payload.entityId);
      if (entity) {
        const behaviorIndex = entity.behaviors.findIndex(
          (b) => b.type === action.payload.behaviorType
        );
        if (behaviorIndex !== -1) {
          const updatedBehavior = {
            ...entity.behaviors[behaviorIndex],
            ...action.payload.updates,
          };
          entity.behaviors[behaviorIndex] = updatedBehavior;
          worldDataStateActions.updateEntity(action.payload.entityId, {
            behaviors: [...entity.behaviors],
          });
        }
      }
      break;

    case "CLEAR_WORLD":
      console.log("🧹 Clearing the world");
      worldDataStateActions.clearWorld();
      break;

    case "SELECT_ENTITIES":
      console.log("🔍 Selecting entities:", action.payload.ids);
      ideStateActions.setSelectedEntityIds(action.payload.ids);
      break;

    case "DESELECT_ENTITIES":
      console.log("👋 Deselecting entities:", action.payload);
      ideStateActions.removeSelectedEntityIds(action.payload);
      break;

    case "CLEAR_SELECTION":
      console.log("🧹 Clearing entity selection");
      ideStateActions.clearSelection();
      break;

    default:
      console.error("❌ Unknown action type:", (action as GameAction).type);
  }
};
