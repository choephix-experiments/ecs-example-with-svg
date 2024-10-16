import { ReadonlyDeep, StageEntityProps } from "../types/data-types";
import { getBuiltInBehaviorResolver } from "./getBuiltInBehaviorResolver";

export const entityResolver = {
  onTick: (entity: StageEntityProps, deltaTime: number, totalTime: number) => {
    for (const behavior of entity.behaviors ?? []) {
      const resolver = getBuiltInBehaviorResolver(behavior);
      resolver?.onTick?.apply(behavior, [entity, deltaTime, totalTime]);
    }
  },

  render: (entity: ReadonlyDeep<StageEntityProps>) => {
    let content: React.ReactNode = null;
    for (const behavior of entity.behaviors ?? []) {
      const resolver = getBuiltInBehaviorResolver(behavior);
      content = resolver?.render?.apply(behavior, [entity, content]);
    }
    return content;
  },
};
