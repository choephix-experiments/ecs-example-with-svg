export interface StageEntityProps {
  uuid: string;
  name?: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: BehaviorProps[];
}

export type EntityBlueprint = Omit<StageEntityProps, "uuid">;

export interface WorldDataState {
  entities: StageEntityProps[];
  stage: {
    width: number;
    height: number;
  };
}

export interface BehaviorProps {
  uuid: string;
  name?: string;
  type: string;
}

///////////////

export type ReadonlyDeep<T> = T extends (infer R)[]
  ? ReadonlyArray<ReadonlyDeep<R>>
  : T extends object
    ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> }
    : T;
