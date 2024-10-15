import YAML from "yaml";

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
  `,

  builtInBehaviors: `
    RenderCircle: { type: "RenderCircle", radius: number }
    ChangeColor: { type: "ChangeColor", color: string }
    SimplifyMesh: { type: "SimplifyMesh", sides: number }
    CustomBehavior: { 
      type: "CustomBehavior", 
      name: string, 
      update?: string, // stringified function of type \`(entity, deltaTime) => void\`
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

  const entitiesInWorld = "\n" + YAML.stringify(worldDataState.entities, {});

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

    Entities in the world: 
    ${entitiesInWorld}

    Current selection (entity ids): [${ideState.selectedEntityIds.join(", ")}]

    ----

    Example 1:
    User: "Add a red circle to the world."
    Assistant: 
    { 
      "actions": [
        { 
          "type": "addEntity", 
          "entityProps": { 
            "x": 0, "y": 0, "rotation": 0, "scale": 1, "behaviors": [{ "type": "RenderCircle", "radius": 10, "color": "red" }] 
          }
        }
      ] 
    }

    Example 2:
    User: "Select the blue circle and make it bigger and darker."
    Assistant:
    { 
      "actions": [
        { "type": "selectEntities", "entityIds": ["<uuid of blue circle>"] },
        { "type": "updateEntity", "entityId": "blue-circle", "updates": { "scale": <entity's current scale x 2> } },
        { "type": "updateBehavior", "entityId": "blue-circle", "behaviorType": "RenderCircle", "updates": { "color": "<a darker shade of blue>" } }
      ] 
    }

    Example 3:
    User: "Make the heart pulse."
    Assistant:
    { 
      "actions": [
        {
          "type": "addBehavior", 
          "entityId": "<uuid of the entity with heart emoji>", 
          "behaviorProps": { 
            "type": "CustomBehavior", 
            "name": "Pulse",
            "pulseSpeed": 1.1,
            "pulseAmplitude": 0.1,
            "update": "entity.scale = <current scale> + Math.sin(deltaTime * this.pulseSpeed) * this.pulseAmplitude;"
          } 
        }
      ] 
    }
  `;

  return contextStr;
}
