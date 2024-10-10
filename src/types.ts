export interface Entity {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: Behavior[];
}

export interface Behavior {
  name: string;
  start?: () => void;
  update?: (entity: Entity, deltaTime: number) => void;
  destroy?: () => void;
  render?: (
    entity: Entity,
    currentContent: React.ReactNode | null
  ) => React.ReactNode | null;
}

type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U>
    ? readonly ReadonlyDeep<U>[]
    : T[P] extends Readonly<infer U>
    ? ReadonlyDeep<U>
    : T[P];
};
