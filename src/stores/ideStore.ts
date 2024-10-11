import { proxy } from 'valtio';
import { worldState } from './worldState';

interface IDEState {
  selectedEntityId: number | null;
}

const ideState = proxy<IDEState>({
  selectedEntityId: null,
});

const ideStateActions = {
  setSelectedEntityId: (id: number | null) => {
    ideState.selectedEntityId = id;
  },
  getSelectedEntity: () => {
    return worldState.entities.find(e => e.id === ideState.selectedEntityId);
  },
};

export { ideStateActions, ideState };
