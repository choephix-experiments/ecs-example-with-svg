import { CustomBehavior, FillColor, MovementBehavior, RenderCircle } from "../behaviors/behaviors";
import { actions, state } from "../stores/worldStore";

export function populateSampleWorld() {
  actions.clearWorld();
  const { width, height } = state.stage;

  for (let i = 0; i < 20; i++) {
    actions.addEntity({
      id: i,
      x: (Math.random() - .5) * width,
      y: (Math.random() - .5) * height,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      behaviors: [
        RenderCircle,
        // MovementBehavior,
        FillColor(`hsl(${Math.random() * 360}, 70%, 50%)`),
        // CustomBehavior({
        //   name: 'CustomRotation',
        //   update: `
        //     entity.rotation += deltaTime * 50;
        //     if (entity.rotation > 360) {
        //       entity.rotation -= 360;
        //     }
        //   `,
        // }),
      ],
    });
  }
}
