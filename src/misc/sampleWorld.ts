import { CustomBehavior, FillColor, MovementBehavior, RenderCircle } from "../behaviors/behaviors";
import { actions } from "../stores/worldStore";

export function populateSampleWorld() {
  actions.clearWorld();
  for (let i = 0; i < 20; i++) {
    actions.addEntity({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
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
