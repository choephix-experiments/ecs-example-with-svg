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
