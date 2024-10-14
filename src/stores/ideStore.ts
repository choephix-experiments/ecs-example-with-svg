import { proxy, useSnapshot } from 'valtio';
import { worldDataState } from './worldDataState';

interface IDEState {
  selectedEntityIds: string[];
}

const ideState = proxy<IDEState>({
  selectedEntityIds: [],
});

export const ideStateActions = {
  setSelectedEntityIds: (ids: string[]) => {
    ideState.selectedEntityIds = ids;
  },
  addSelectedEntityIds: (ids: string[]) => {
    const newIds = ids.filter(id => !ideState.selectedEntityIds.includes(id));
    ideState.selectedEntityIds.push(...newIds);
  },
  removeSelectedEntityIds: (ids: string[]) => {
    ideState.selectedEntityIds = ideState.selectedEntityIds.filter(id => !ids.includes(id));
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

export const useGetSelectedEntities = () => {
  const { selectedEntityIds } = useSnapshot(ideState);
  const { entities } = useSnapshot(worldDataState);
  
  return entities.filter(e => selectedEntityIds.includes(e.id));
};

export { ideState };
