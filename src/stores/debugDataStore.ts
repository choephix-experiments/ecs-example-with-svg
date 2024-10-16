import { proxy } from "valtio";

interface DebugDataState {
  values: Record<string, string | number | object>;
}

export const debugDataState = proxy<DebugDataState>({
  values: {},
});

export const debugDataActions = {
  setValue: (key: string, value: any) => {
    debugDataState.values[key] = value;
    console.log(`🐛 Debug data updated: ${key}`, value);
  },
  clearValue: (key: string) => {
    delete debugDataState.values[key];
    console.log(`🧹 Debug data cleared: ${key}`);
  },
  clearAll: () => {
    debugDataState.values = {};
    console.log("🧼 All debug data cleared");
  },
};
