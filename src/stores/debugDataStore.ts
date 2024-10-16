import { proxy } from "valtio";

interface DebugDataState {
  values: Record<string, string | number | object>;
}

export const debugDataState = proxy<DebugDataState>({
  values: {},
});
