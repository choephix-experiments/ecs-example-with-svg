import {
  StageEntityProps,
  BehaviorProps,
  ReadonlyDeep,
} from "../types/data-types";
import { BehaviorResolver, behaviorResolvers } from "../behaviors/behaviors";

export const EntityResolver = {
  update: (entity: StageEntityProps, deltaTime: number) => {
    entity.behaviors.forEach((behavior) => {
      const resolverKey = behavior.type as keyof typeof behaviorResolvers;
      const resolver = behaviorResolvers[resolverKey] as BehaviorResolver<typeof behavior>;
      resolver?.update?.apply(behavior, [entity, deltaTime]);
    });
  },

  render: (entity: ReadonlyDeep<StageEntityProps>) => {
    let content: React.ReactNode = null;
    entity.behaviors.forEach((behavior) => {
      const resolverKey = behavior.type as keyof typeof behaviorResolvers;
      const resolver = behaviorResolvers[resolverKey] as BehaviorResolver<typeof behavior>;
      content = resolver?.render?.apply(behavior, [entity, content]);
    });
    return content;
  },

  getBehavior: (
    entity: StageEntityProps,
    type: string
  ): BehaviorProps | undefined => {
    return entity.behaviors.find((b) => b.type === type);
  },
};
