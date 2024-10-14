import { proxy } from 'valtio';
import { worldDataState } from './worldDataState';
import { useSnapshot } from 'valtio';

interface IDEState {
  selectedEntityIds: string[];
}

const ideState = proxy<IDEState>({
  selectedEntityIds: [],
});

const ideStateActions = {
  setSelectedEntityIds: (ids: string[]) => {
    ideState.selectedEntityIds = ids;
  },
  toggleEntitySelection: (id: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      const index = ideState.selectedEntityIds.indexOf(id);
      if (index === -1) {
        ideState.selectedEntityIds.push(id);
      } else {
        ideState.selectedEntityIds.splice(index, 1);
      }
    } else {
      ideState.selectedEntityIds = [id];
    }
  },
  clearSelection: () => {
    ideState.selectedEntityIds = [];
  },
};

const useGetSelectedEntities = () => {
  const { selectedEntityIds } = useSnapshot(ideState);
  const { entities } = useSnapshot(worldDataState);
  
  return entities.filter(e => selectedEntityIds.includes(e.id));
};

export { ideStateActions, ideState, useGetSelectedEntities };
