import { proxy, subscribe } from 'valtio';
import { createBehavior } from '../behaviors/behaviors';
import { StageEntity } from '../types';
import { StageEntityProps, worldDataState, worldDataStateActions } from './worldDataState';

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
  // Sync stage properties
  if (worldState.stage.width !== worldDataState.stage.width || 
      worldState.stage.height !== worldDataState.stage.height) {
    worldState.stage = { ...worldDataState.stage };
  }

  // Sync entities
  const newEntities: StageEntity[] = [];
  for (let i = 0; i < worldDataState.entities.length; i++) {
    const dataEntity = worldDataState.entities[i];
    let stageEntity = worldState.entities[i];

    if (!stageEntity) {
      // New entity, create it
      stageEntity = new StageEntity(dataEntity);
      newEntities.push(stageEntity);
    } else if (stageEntity.id !== dataEntity.id) {
      // Entity at this index has changed, create a new one
      stageEntity = new StageEntity(dataEntity);
      newEntities.push(stageEntity);
    } else {
      // Update existing entity
      updateEntityProps(stageEntity, dataEntity);
      newEntities.push(stageEntity);
    }
  }

  worldState.entities = newEntities;
};

const updateEntityProps = (stageEntity: StageEntity, dataEntity: StageEntityProps) => {
  // Update basic properties
  stageEntity.x = dataEntity.x;
  stageEntity.y = dataEntity.y;
  stageEntity.rotation = dataEntity.rotation;
  stageEntity.scale = dataEntity.scale;

  // Update behaviors
  const newBehaviors = [];
  for (let i = 0; i < dataEntity.behaviors.length; i++) {
    const dataBehavior = dataEntity.behaviors[i];
    let stageBehavior = stageEntity.behaviors[i];

    if (!stageBehavior || stageBehavior.name !== dataBehavior.type) {
      // New or changed behavior, create it
      stageBehavior = createBehavior(dataBehavior);
      newBehaviors.push(stageBehavior);
    } else {
      // Update existing behavior
      stageBehavior.applyProps(dataBehavior);
      newBehaviors.push(stageBehavior);
    }
  }

  stageEntity.behaviors = newBehaviors;
};

subscribe(worldDataState, syncWorldState);

const updateEntities = (deltaTime: number) => {
  worldState.entities.forEach(entity => entity.update(deltaTime));
};

Object.assign(globalThis, { state: worldState, dataState: worldDataState });

export { updateEntities, worldDataStateActions, worldState };

