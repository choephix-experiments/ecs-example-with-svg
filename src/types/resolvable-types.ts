export type Resolvable = {
  render: () => void;
  onTick: (
    deltaTimeSeconds: number,
    totalTimeSeconds: number,
  ) => void;
  getBounds: () => { x: number; y: number; width: number; height: number };
}