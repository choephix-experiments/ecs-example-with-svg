import { BuiltInBehaviorsProps } from "./behaviors/behaviors";
import { ideState } from "./stores/ideStore";
import { worldDataStateActions } from "./stores/worldDataState";

const God = {
  addBehaviorToSelectedEntity: (behaviorProps: BuiltInBehaviorsProps) => {
    const selectedEntityId = ideState.selectedEntityId;
    if (selectedEntityId !== null) {
      worldDataStateActions.addBehaviorToEntity(
        selectedEntityId,
        behaviorProps
      );
      console.log(
        `🎭 Added behavior ${behaviorProps.type} to entity ${selectedEntityId}`
      );
    } else {
      console.warn("⚠️ No entity selected. Please select an entity first.");
    }
  },

  makePulse: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Pulse",
      update: `
        entity.scale = 1 + Math.sin(Date.now() * 0.005) * 0.5;
      `,
    });
    console.log("🔄 Added pulse animation to selected entity");
  },

  makeSpin: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Spin",
      update: `
        entity.rotation += 4 * deltaTime;
      `,
    });
    console.log("🌀 Added spin animation to selected entity");
  },

  makeOrbit: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Orbit",
      update: `
        const radius = 100;
        const speed = 0.001;
        entity.x = Math.cos(Date.now() * speed) * radius;
        entity.y = Math.sin(Date.now() * speed) * radius;
      `,
    });
    console.log("🪐 Added orbit animation to selected entity");
  },

  makeBounce: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Bounce",
      update: `
        entity.y = Math.abs(Math.sin(Date.now() * 0.005)) * 100;
      `,
    });
    console.log("🏀 Added bounce animation to selected entity");
  },

  makeWiggle: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Wiggle",
      update: `
        entity.rotation = Math.sin(Date.now() * 0.01) * 15;
      `,
    });
    console.log("〰️ Added wiggle animation to selected entity");
  },

  makeFade: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Fade",
      update: `
        entity.opacity = (Math.sin(Date.now() * 0.003) + 1) / 2;
      `,
    });
    console.log("👻 Added fade animation to selected entity");
  },

  makeZigZag: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "ZigZag",
      update: `
        entity.x += Math.sin(Date.now() * 0.01) * 2;
        entity.y += 0.5;
        if (entity.y > 300) entity.y = -300;
      `,
    });
    console.log("⚡ Added zig-zag animation to selected entity");
  },

  makeGrow: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Grow",
      update: `
        entity.scale = Math.min(entity.scale * 1.01, 3);
      `,
    });
    console.log("🌱 Added grow animation to selected entity");
  },

  makeShrink: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Shrink",
      update: `
        entity.scale = Math.max(entity.scale * 0.99, 0.1);
      `,
    });
    console.log("🔍 Added shrink animation to selected entity");
  },

  makeShake: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "Shake",
      update: `
        entity.x += (Math.random() - 0.5) * 4;
        entity.y += (Math.random() - 0.5) * 4;
      `,
    });
    console.log("🤝 Added shake animation to selected entity");
  },

  makeColorCycle: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "ColorCycle",
      update: `
        const hue = (Date.now() * 0.1) % 360;
        entity.color = \`hsl(\${hue}, 100%, 50%)\`;
      `,
    });
    console.log("🌈 Added color cycle animation to selected entity");
  },

  makePingPong: () => {
    God.addBehaviorToSelectedEntity({
      type: "CustomBehavior",
      name: "PingPong",
      update: `
        entity.x = Math.sin(Date.now() * 0.003) * 200;
      `,
    });
    console.log("🏓 Added ping-pong animation to selected entity");
  },
};

// Assign the God object to globalThis
Object.assign(globalThis, { God });

// Export the God object for potential use in other parts of the application
export { God };
