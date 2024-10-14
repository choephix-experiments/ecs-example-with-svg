import {
  worldDataState,
  worldDataStateActions,
} from "../stores/worldDataState";
import { StageEntityProps } from "../types/data-types";
import { findBehavior } from "../utils/findBehavior";

const emojiList = ["😊", "🚀", "🌈", "🎉", "🦄", "🍕", "🌟", "🐱", "🌺", "🎸"];

const randomId = () => Math.random().toString(36).substring(2, 15);
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
    const entity: StageEntityProps = {
      id: randomId(),
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1,
      behaviors: [],
    };
    worldDataStateActions.addEntity(entity);
    worldDataStateActions.addBehaviorToEntity(entity.id, {
      type: "RenderCircle",
      radius: 10 + Math.random() * 40,
    });
    return entity;
  }

  function createCircleWithRandomScale() {
    const entity: StageEntityProps = {
      id: randomId(),
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 1 + Math.random() * 4,
      behaviors: [],
    };
    worldDataStateActions.addEntity(entity);
    worldDataStateActions.addBehaviorToEntity(entity.id, {
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

    // Add SimplifyMesh behavior to some entities
    if (index % 3 === 0) {
      worldDataStateActions.addBehaviorToEntity(entity.id, {
        type: "SimplifyMesh",
        sides: 6,
      });
    }

    // Add RenderEmoji behavior to every second entity
    if (index % 2 === 0) {
      const circle = findBehavior(entity, "RenderCircle");
      const fontSizeMultiplier = 1.33;
      const fontSize = fontSizeMultiplier * (circle?.radius ?? 20);
      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];

      worldDataStateActions.addBehaviorToEntity(entity.id, {
        type: "RenderEmoji",
        emoji: randomEmoji,
        fontSize: fontSize,
      });
    } else {
      worldDataStateActions.addBehaviorToEntity(entity.id, {
        type: "ChangeColor",
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      });
    }
  }

  // Log the creation of the sample world
  console.log("🌍 Sample world populated with entities and emojis");
}
