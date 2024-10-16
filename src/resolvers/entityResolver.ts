import { ReadonlyDeep, StageEntityProps } from "../types/data-types";
import { getBuiltInBehaviorResolver } from "./getBuiltInBehaviorResolver";

export const entityResolver = {
  onTick: (entity: StageEntityProps, deltaTime: number, totalTime: number) => {
    entity.behaviors.forEach((behavior) => {
      const resolver = getBuiltInBehaviorResolver(behavior);
      resolver?.onTick?.apply(behavior, [entity, deltaTime, totalTime]);
    });
  },

  render: (entity: ReadonlyDeep<StageEntityProps>) => {
    let content: React.ReactNode = null;
    entity.behaviors.forEach((behavior) => {
      const resolver = getBuiltInBehaviorResolver(behavior);
      content = resolver?.render?.apply(behavior, [entity, content]);
    });
    return content;
  },
};
