import {
  BehaviorProps,
  ReadonlyDeep,
  StageEntityProps,
} from "../types/data-types";

// Define the structure for behavior resolvers
export type BehaviorResolver<T extends BehaviorProps = BehaviorProps> = {
  onTick?: (
    this: T,
    entity: StageEntityProps,
    deltaTime: number,
    totalTime: number
  ) => void;
  render?: (
    this: T,
    entity: ReadonlyDeep<StageEntityProps>,
    content: React.ReactNode | null
  ) => React.ReactNode | null;
  getBounds?: (
    this: T,
    entity: ReadonlyDeep<StageEntityProps>
  ) => { x: number; y: number; width: number; height: number } | undefined;
};
