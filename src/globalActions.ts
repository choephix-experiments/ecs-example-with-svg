import { worldDataStateActions } from './stores/worldDataState';
import { ideState } from './stores/ideStore';
import { BehaviorProps } from './types/data-types';

const addBehaviorToSelectedEntity = (behaviorProps: BehaviorProps) => {
  const selectedEntityId = ideState.selectedEntityId;
  if (selectedEntityId !== null) {
    worldDataStateActions.addBehaviorToEntity(selectedEntityId, behaviorProps);
    console.log(`Added behavior ${behaviorProps.type} to entity ${selectedEntityId}`);
  } else {
    console.warn('No entity selected. Please select an entity first.');
  }
};

// Assign the function to globalThis
Object.assign(globalThis, { addBehaviorToSelectedEntity });

// Export the function for potential use in other parts of the application
export { addBehaviorToSelectedEntity };
