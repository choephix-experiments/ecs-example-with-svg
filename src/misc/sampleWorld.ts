import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { StageEntityProps } from "../types/data-types";
import { findBehavior } from "../utils/findBehavior";

const emojiList = ["😊", "🚀", "🌈", "🎉", "🦄", "🍕", "🌟", "🐱", "🌺", "🎸"];

export function populateSampleWorld() {
  worldDataStateActions.clearWorld();

  const { width, height } = worldDataState.stage;

  const COUNT = 10;

  for (let i = 0; i < COUNT; i++) {
    const entity: StageEntityProps = {
      id: i,
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1,
      behaviors: [],
    };
    worldDataStateActions.addEntity(entity);
    worldDataStateActions.addBehaviorToEntity(i, {
      type: "RenderCircle",
      radius: 10 + Math.random() * 40,
    });

    // Add SimplifyMesh behavior to some entities
    if (i % 3 === 0) {
      worldDataStateActions.addBehaviorToEntity(i, {
        type: "SimplifyMesh",
        sides: 6,
      });
    }

    // Add RenderEmoji behavior to every second entity
    if (i % 2 === 0) {
      const circle = findBehavior(entity, "RenderCircle");

      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];
      worldDataStateActions.addBehaviorToEntity(i, {
        type: "RenderEmoji",
        emoji: randomEmoji,
        fontSize: circle?.radius ?? 20, // You can adjust this or make it random if you prefer
      });
    } else {
      worldDataStateActions.addBehaviorToEntity(i, {
        type: "ChangeColor",
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      });
    }
  }

  // Log the creation of the sample world
  console.log("🌍 Sample world populated with entities and emojis");
}
