import { FillColor, RenderCircle } from '../behaviors/behaviors';
import { worldStateActions, worldState } from '../stores/worldStore';

export function populateSampleWorld() {
  worldStateActions.clearWorld();
  const { width, height } = worldState.stage;

  for (let i = 0; i < 20; i++) {
    worldStateActions.addEntity({
      id: i,
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      behaviors: [RenderCircle, FillColor(`hsl(${Math.random() * 360}, 70%, 50%)`)],
    });
  }
}
