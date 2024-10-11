import { AnyBehaviorProps, createBehavior } from "./behaviors/behaviors";
import { StageEntityProps } from "./stores/worldDataState";

export class StageEntity {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: Behavior[];

  constructor(props: StageEntityProps) {
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.rotation = props.rotation;
    this.scale = props.scale;
    this.behaviors = props.behaviors.map(createBehavior);
  }

  static fromProps(props: StageEntityProps): StageEntity {
    return new StageEntity(props);
  }

  toProps(): StageEntityProps {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scale: this.scale,
      behaviors: this.behaviors.map(b => ({ type: b.name, ...b } as AnyBehaviorProps)),
    };
  }

  update(deltaTime: number) {
    this.behaviors.forEach(behavior => {
      if (behavior.update) {
        behavior.update(this, deltaTime);
      }
    });
  }
}

export interface Behavior<T extends BehaviorProps = BehaviorProps> {
  name: string;
  start?: () => void;
  update?: (entity: StageEntity, deltaTime: number) => void;
  destroy?: () => void;
  render?: (
    entity: StageEntity,
    currentContent: React.ReactNode | null
  ) => React.ReactNode | null;
  applyProps: (props: T) => void;
}

export interface BehaviorProps {
  type: string;
}
