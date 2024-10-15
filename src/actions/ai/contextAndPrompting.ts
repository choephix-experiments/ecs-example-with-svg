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
    /**
     * Renders a circular shape for the entity.
     * @property {string} type - Always "RenderCircle"
     * @property {number} radius - The radius of the circle
     */
    RenderCircle: { type: "RenderCircle", radius: number }

    /**
     * Changes the color of the entity.
     * @property {string} type - Always "ChangeColor"
     * @property {string} color - The new color to apply (e.g., "red", "#FF0000")
     */
    ChangeColor: { type: "ChangeColor", color: string }

    /**
     * Simplifies the mesh of the entity to a polygon with specified number of sides.
     * @property {string} type - Always "SimplifyMesh"
     * @property {number} sides - The number of sides for the simplified polygon
     */
    SimplifyMesh: { type: "SimplifyMesh", sides: number }

    /**
     * Allows for custom behavior implementation.
     * @property {string} type - Always "CustomBehavior"
     * @property {string} name - A unique name for this custom behavior
     * @property {string} [update] - Optional. A stringified function to be executed each frame
     * Type: \`(entity, deltaTime, totalTime) => void\`, where time is in seconds.
     * @property {any} [extrakeys] - Any additional properties specific to this custom behavior
     */
    CustomBehavior: { 
      type: "CustomBehavior", 
      name: string, 
      update?: string,
      [extrakeys: string]: any
    }

    /**
     * Renders an emoji as the visual representation of the entity.
     * @property {string} type - Always "RenderEmoji"
     * @property {string} emoji - The emoji character to render
     * @property {number} [fontSize] - Optional. The font size of the emoji
     */
    RenderEmoji: { type: "RenderEmoji", emoji: string, fontSize?: number }
  `,

  examples: `
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
            "update": "entity.scale = <the original scale value> + Math.sin(totalTime * this.pulseSpeed) * this.pulseAmplitude;"
          } 
        }
      ] 
    }

    Example 4:
    User: "Make the star orbit around the center."
    Assistant:
    {
      "actions": [
        {
          "type": "addBehavior",
          "entityId": "<uuid of the star entity>",
          "behaviorProps": {
            "type": "CustomBehavior",
            "name": "Orbit",
            "radius": 100,
            "speed": 0.001,
            "update": "entity.x = Math.cos(totalTime * this.speed) * this.radius; entity.y = Math.sin(totalTime * this.speed) * this.radius;"
          }
        }
      ]
    }

    Example 5:
    User: "Add a colorful square that cycles through colors."
    Assistant:
    {
      "actions": [
        {
          "type": "addEntity",
          "entityProps": {
            "x": 0, "y": 0, "rotation": 0, "scale": 1,
            "behaviors": [
              { "type": "SimplifyMesh", "sides": 4 },
              {
                "type": "CustomBehavior",
                "name": "ColorCycle",
                "cycleSpeed": 0.1,
                "update": "const hue = (totalTime * this.cycleSpeed) % 360; entity.color = \`hsl(\${hue}, 100%, 50%)\`;"
              }
            ]
          }
        }
      ]
    }

    Example 6:
    User: "Create a bouncing ball."
    Assistant:
    {
      "actions": [
        {
          "type": "addEntity",
          "entityProps": {
            "x": 0, "y": 0, "rotation": 0, "scale": 1,
            "behaviors": [
              { "type": "RenderCircle", "radius": 20 },
              {
                "type": "CustomBehavior",
                "name": "Bounce",
                "bounceHeight": 100,
                "bounceSpeed": 0.005,
                "update": "entity.y = Math.abs(Math.sin(totalTime * this.bounceSpeed)) * this.bounceHeight;"
              }
            ]
          }
        }
      ]
    }

    Example 7:
    User: "Add a shaking emoji."
    Assistant:
    {
      "actions": [
        {
          "type": "addEntity",
          "entityProps": {
            "x": 0, "y": 0, "rotation": 0, "scale": 1,
            "behaviors": [
              { "type": "RenderEmoji", "emoji": "🤪", "fontSize": 40 },
              {
                "type": "CustomBehavior",
                "name": "Shake",
                "intensity": 4,
                "update": "entity.x += (Math.random() - 0.5) * this.intensity; entity.y += (Math.random() - 0.5) * this.intensity;"
              }
            ]
          }
        }
      ]
    }
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
    ${contextAndPrompting.examples}
  `;

  return contextStr;
}
