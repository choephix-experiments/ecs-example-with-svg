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
