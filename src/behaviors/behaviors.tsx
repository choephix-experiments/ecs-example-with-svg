import { Behavior } from '../types';

interface CustomBehaviorOptions {
  name: string;
  start?: string | Behavior['start'];
  update?: string | Behavior['update'];
  destroy?: string | Behavior['destroy'];
  render?: string | Behavior['render'];
}

export const RenderCircle: Behavior = {
  name: 'RenderCircle',
  render: entity => {
    return (
      <circle
        cx={entity.x}
        cy={entity.y}
        r={10 * entity.scale}
        transform={`rotate(${entity.rotation} ${entity.x} ${entity.y})`}
      />
    );
  },
};

export const MovementBehavior: Behavior = {
  name: 'Movement',
  update: (entity, deltaTime) => {
    entity.x += Math.sin(Date.now() * 0.001) * 0.5 * deltaTime;
    entity.y += Math.cos(Date.now() * 0.001) * 0.5 * deltaTime;
  },
};

export const FillColor: (color: string) => Behavior = (color: string) => ({
  name: 'FillColor',
  render: (_, content) => {
    return <g fill={color}>{content}</g>;
  },
});

export const CustomBehavior = (options: CustomBehaviorOptions): Behavior => {
  const behavior: Behavior = {
    name: options.name || 'CustomBehavior',
  };

  const funcKeys = ['start', 'update', 'destroy', 'render'] as const;
  for (const key of funcKeys) {
    if (options[key]) {
      if (typeof options[key] === 'string') {
        behavior[key] = new Function(options[key]) as () => any;
      } else {
        behavior[key] = options[key] as () => any;
      }
    }
  }

  return behavior;
};
