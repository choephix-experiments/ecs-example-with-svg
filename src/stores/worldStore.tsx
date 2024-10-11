import { proxy, subscribe } from 'valtio';
import { StageEntity } from '../types';
import { worldDataState, worldDataStateActions } from './worldDataState';

interface GameState {
  entities: StageEntity[];
  stage: {
    width: number;
    height: number;
  };
}

const worldState = proxy<GameState>({
  entities: [],
  stage: {
    width: 1000,
    height: 1000,
  },
});

const syncWorldState = () => {
  worldState.entities = worldDataState.entities.map(StageEntity.fromProps);
  worldState.stage = { ...worldDataState.stage };
};

subscribe(worldDataState, syncWorldState);

const updateEntities = (deltaTime: number) => {
  worldState.entities.forEach(entity => entity.update(deltaTime));
};

Object.assign(globalThis, { state: worldState, dataState: worldDataState });

export { worldState, worldDataStateActions, updateEntities };
