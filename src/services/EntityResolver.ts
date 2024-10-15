import { getBehaviorResolver } from '../behaviors/behaviors';
import { BehaviorProps, ReadonlyDeep, StageEntityProps } from '../types/data-types';

export const EntityResolver = {
  update: (entity: StageEntityProps, deltaTime: number, totalTime: number) => {
    entity.behaviors.forEach(behavior => {
      const resolver = getBehaviorResolver(behavior);
      resolver?.update?.apply(behavior, [entity, deltaTime, totalTime]);
    });
  },

  render: (entity: ReadonlyDeep<StageEntityProps>) => {
    let content: React.ReactNode = null;
    entity.behaviors.forEach(behavior => {
      const resolver = getBehaviorResolver(behavior);
      content = resolver?.render?.apply(behavior, [entity, content]);
    });
    return content;
  },

  getBehavior: (entity: StageEntityProps, type: string): BehaviorProps | undefined => {
    return entity.behaviors.find(b => b.type === type);
  },
};
