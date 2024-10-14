import { worldDataStateActions } from "../stores/worldDataState";
import { ideStateActions } from "../stores/ideStore";
import { ActionProps } from "./actionTypes";

export const resolveAction = (action: ActionProps): void => {
  console.log("🎬 Resolving action:", action.type);

  switch (action.type) {
    case "addEntity": {
      console.log("➕ Adding entity:", action.entityProps.id);
      worldDataStateActions.addEntity(action.entityProps);
      break;
    }

    case "removeEntity": {
      console.log("➖ Removing entity:", action.entityId);
      worldDataStateActions.removeEntity(action.entityId);
      break;
    }

    case "updateEntity": {
      console.log("🔄 Updating entity:", action.entityId);
      const entity = worldDataStateActions.getEntity(action.entityId);
      if (!entity) throw new Error("Entity not found");

      Object.assign(entity, action.updates);
      break;
    }

    case "addBehavior": {
      console.log("🧠 Adding behavior to entity:", action.entityId);
      worldDataStateActions.addBehaviorToEntity(
        action.entityId,
        action.behaviorProps
      );
      break;
    }

    case "removeBehavior": {
      console.log("🗑️ Removing behavior from entity:", action.entityId);
      worldDataStateActions.removeBehaviorFromEntity(
        action.entityId,
        action.behaviorType
      );
      break;
    }

    case "updateBehavior": {
      console.log("🔧 Updating behavior for entity:", action.entityId);
      const entity = worldDataStateActions.getEntity(action.entityId);
      if (!entity) throw new Error("Entity not found");

      const behaviorIndex = entity.behaviors.findIndex(
        (b) => b.type === action.behaviorType
      );
      if (behaviorIndex < 0) throw new Error("Behavior not found");

      const updatedBehavior = {
        ...entity.behaviors[behaviorIndex],
        ...action.updates,
      };
      entity.behaviors[behaviorIndex] = updatedBehavior;
      worldDataStateActions.updateEntity(action.entityId, {
        behaviors: [...entity.behaviors],
      });
      break;
    }

    case "clearWorld": {
      console.log("🧹 Clearing the world");
      worldDataStateActions.clearWorld();
      break;
    }

    case "selectEntities": {
      console.log("🔍 Selecting entities:", action.entityIds);
      ideStateActions.setSelectedEntityIds(action.entityIds);
      break;
    }

    case "deselectEntities": {
      console.log("👋 Deselecting entities:", action.entityIds);
      ideStateActions.removeSelectedEntityIds(action.entityIds);
      break;
    }

    case "clearSelection": {
      console.log("🧹 Clearing entity selection");
      ideStateActions.clearSelection();
      break;
    }

    default: {
      console.error("❌ Unknown action type:", (action as ActionProps).type);
    }
  }
};
