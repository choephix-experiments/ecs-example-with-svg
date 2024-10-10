import { AnyBehaviorProps } from "./behaviors/behaviors";

export interface Entity {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: Behavior<AnyBehaviorProps>[];
}

export interface Behavior<T extends BehaviorProps> {
  name: string;
  start?: () => void;
  update?: (entity: Entity, deltaTime: number) => void;
  destroy?: () => void;
  render?: (
    entity: Entity,
    currentContent: React.ReactNode | null
  ) => React.ReactNode | null;
  applyProps: (props: T) => void;
}

export interface BehaviorProps {
  type: string;
}
