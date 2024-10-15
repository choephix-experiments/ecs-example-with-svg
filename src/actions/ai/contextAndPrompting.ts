import { ideState } from "../../stores/ideStore";
import { worldDataState } from "../../stores/worldDataState";

export const contextAndPrompting = {
  actionTypes: `
    { type: "addEntity", entityProps: { uuid: string, x: number, y: number, rotation: number, scale: number, behaviors: Array<{ uuid: string, type: string, name?: string }> } }
    { type: "removeEntity", entityId: string }
    { type: "updateEntity", entityId: string, updates: { x?: number, y?: number, rotation?: number, scale?: number, behaviors?: Array<{ uuid: string, type: string, name?: string }> } }
    { type: "addBehavior", entityId: string, behaviorProps: { type: string, name?: string, ... other behavior-specific properties } }
    { type: "removeBehavior", entityId: string, behaviorType: string }
    { type: "updateBehavior", entityId: string, behaviorType: string, updates: { name?: string, ... other behavior-specific properties } }
    { type: "clearWorld" }
    { type: "selectEntities", entityIds: string[] }
    { type: "deselectEntities", entityIds: string[] }
    { type: "clearSelection" }
  `,

  builtInBehaviors: `
    RenderCircle: { type: "RenderCircle", radius: number }
    ChangeColor: { type: "ChangeColor", color: string }
    SimplifyMesh: { type: "SimplifyMesh", sides: number }
    CustomBehavior: { 
      type: "CustomBehavior", 
      name: string, 
      update?: string | ((entity: StageEntityProps, deltaTime: number) => void),
      render?: string | ((entity: StageEntityProps, currentContent: React.ReactNode | null) => React.ReactNode | null),
      [extrakeys: string]: any
    }
    RenderEmoji: { type: "RenderEmoji", emoji: string, fontSize?: number }
  `,
};

export function buildContextString() {
  const stageWidth = worldDataState.stage.width;
  const stageHeight = worldDataState.stage.height;
  const stageBounds = `
    - top left corner: ${-stageWidth / 2}x${-stageHeight / 2}.
    - bottom right corner: ${stageWidth / 2}x${stageHeight / 2}.
`;

  const entitiesInWorld = worldDataState.entities
    .map(
      (entity) => `
      - ${entity.uuid}:
        - x: ${entity.x}
        - y: ${entity.y}
        - rotation: ${entity.rotation}
        - scale: ${entity.scale}
        - behaviors: ${JSON.stringify(entity.behaviors, null, 2)}
    `
    )
    .join("\n");

  const contextStr = `
    You are an AI assistant that generates actions for a game engine.
    You can add, remove, update entities, behaviors, and select/deselect entities.
    You can also clear the world, clear the selection, and generate actions based on user's request.

    An action resolver will parse your json response and execute the actions.

    Here are the action types you can use:
    ${contextAndPrompting.actionTypes}

    Here are the built-in behaviors you can use:
    ${contextAndPrompting.builtInBehaviors}

    Current state of the world:
    
    Stage bounds: ${stageBounds}

    Entities in the world: ${entitiesInWorld}

    Current selection (entity ids): ${ideState.selectedEntityIds.join(", ")}
`;

  return contextStr;
}
