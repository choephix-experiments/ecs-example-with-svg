export interface StageEntityProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  behaviors: BehaviorProps[];
}

export interface WorldDataState {
  entities: StageEntityProps[];
  stage: {
    width: number;
    height: number;
  };
}

export interface BehaviorProps {
  type: string;
}
