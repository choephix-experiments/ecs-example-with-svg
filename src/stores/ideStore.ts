import { proxy } from 'valtio';
import { worldDataState } from './worldDataState';
import { useSnapshot } from 'valtio';

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
};

const useGetSelectedEntity = () => {
  const { selectedEntityId } = useSnapshot(ideState);
  const { entities } = useSnapshot(worldDataState);
  
  return entities.find(e => e.id === selectedEntityId) || null;
};

export { ideStateActions, ideState, useGetSelectedEntity };
