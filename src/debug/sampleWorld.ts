import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { findEntityBehaviorByType } from "../utils/finders";

const emojiList = ["😊", "🚀", "🌈", "🎉", "🦄", "🍕", "🌟", "🐱", "🌺", "🎸"];
const colorList = [
  "dodgerblue",
  "hotpink",
  "gold",
  "lime",
  "purple",
  "teal",
  "tomato",
];

// const randomId = () => Math.random().toString(36).substring(2, 15);
// const forCount = (count: number) => Array.from({ length: count }, (_, i) => i);
function* iterateTimes(count: number) {
  for (let i = 0; i < count; i++) {
    yield i;
  }
}

export function populateSampleWorld() {
  worldDataStateActions.clearWorld();

  const { width, height } = worldDataState.stage;

  const COUNT = 10;

  function createCircleWithRandomRadius() {
    const entity = worldDataStateActions.addEntity({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1,
      behaviors: [],
    });
    worldDataStateActions.addBehaviorToEntity(entity.uuid, {
      type: "RenderCircle",
      radius: 10 + Math.random() * 40,
    });
    return entity;
  }

  function createCircleWithRandomScale() {
    const entity = worldDataStateActions.addEntity({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1 + Math.random() * 4,
      behaviors: [],
    });
    worldDataStateActions.addBehaviorToEntity(entity.uuid, {
      type: "RenderCircle",
      radius: 10,
    });
    return entity;
  }

  const useRandomScale = false;
  for (const index of iterateTimes(COUNT)) {
    const entity = useRandomScale
      ? createCircleWithRandomScale()
      : createCircleWithRandomRadius();

    entity.name = "circle";

    // Add SimplifyMesh behavior to some entities
    if (index % 3 === 0) {
      worldDataStateActions.addBehaviorToEntity(entity.uuid, {
        type: "SimplifyMesh",
        sides: 6,
      });
      entity.name = "simplified " + entity.name;
    }

    // Add RenderEmoji behavior to every second entity
    if (index % 2 === 0) {
      const circle = findEntityBehaviorByType(entity, "RenderCircle");
      const fontSizeMultiplier = 1.33;
      const fontSize = fontSizeMultiplier * (circle?.radius ?? 20);
      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];

      worldDataStateActions.addBehaviorToEntity(entity.uuid, {
        type: "RenderEmoji",
        emoji: randomEmoji,
        fontSize: fontSize,
      });

      entity.name = entity.name + " with " + randomEmoji;
    } else {
      const color = colorList[Math.floor(Math.random() * colorList.length)];
      worldDataStateActions.addBehaviorToEntity(entity.uuid, {
        type: "ChangeColor",
        // color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        color,
      });
      entity.name = color + " " + entity.name;
    }
  }

  // Log the creation of the sample world
  console.log("🌍 Sample world populated with entities and emojis");
}
