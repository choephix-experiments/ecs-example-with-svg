import React from 'react';
import { Behavior, StageEntity, BehaviorProps } from '../types';

interface RenderCircleProps extends BehaviorProps {
  type: 'RenderCircle';
  radius?: number;
}

class RenderCircle implements Behavior<RenderCircleProps> {
  name = 'RenderCircle';
  private radius: number = 10;

  render(entity: StageEntity) {
    return (
      <circle
        cx={entity.x}
        cy={entity.y}
        r={this.radius * entity.scale}
        transform={`rotate(${entity.rotation} ${entity.x} ${entity.y})`}
      />
    );
  }

  applyProps(props: RenderCircleProps) {
    if (props.radius !== undefined) {
      this.radius = props.radius;
    }
  }
}

interface MovementBehaviorProps extends BehaviorProps {
  type: 'Movement';
  speed?: number;
}

class MovementBehavior implements Behavior<MovementBehaviorProps> {
  name = 'Movement';
  private speed: number = 0.5;

  update(entity: StageEntity, deltaTime: number) {
    entity.x += Math.sin(Date.now() * 0.001) * this.speed * deltaTime;
    entity.y += Math.cos(Date.now() * 0.001) * this.speed * deltaTime;
  }

  applyProps(props: MovementBehaviorProps) {
    if (props.speed !== undefined) {
      this.speed = props.speed;
    }
  }
}

interface FillColorProps extends BehaviorProps {
  type: 'FillColor';
  color: string;
}

class FillColor implements Behavior<FillColorProps> {
  name = 'FillColor';
  private color: string;

  constructor(color: string) {
    this.color = color;
  }

  render(_: StageEntity, content: React.ReactNode | null) {
    return <g fill={this.color}>{content}</g>;
  }

  applyProps(props: FillColorProps) {
    this.color = props.color;
  }
}

interface CustomBehaviorProps extends BehaviorProps {
  type: 'CustomBehavior';
  name: string;
  start?: string | (() => void);
  update?: string | ((entity: StageEntity, deltaTime: number) => void);
  destroy?: string | (() => void);
  render?: string | ((entity: StageEntity, currentContent: React.ReactNode | null) => React.ReactNode | null);
}

class CustomBehavior implements Behavior<CustomBehaviorProps> {
  name: string;
  start?: () => void;
  update?: (entity: StageEntity, deltaTime: number) => void;
  destroy?: () => void;
  render?: (entity: StageEntity, currentContent: React.ReactNode | null) => React.ReactNode | null;

  constructor(options: CustomBehaviorProps) {
    this.name = options.name || 'CustomBehavior';
    this.applyProps(options);
  }

  applyProps(props: CustomBehaviorProps) {
    this.name = props.name;
    const funcKeys = ['start', 'update', 'destroy', 'render'] as const;
    for (const key of funcKeys) {
      if (props[key]) {
        if (typeof props[key] === 'string') {
          this[key] = new Function(props[key] as string) as any;
        } else {
          this[key] = props[key] as any;
        }
      }
    }
  }
}

export const createBehavior = (props: BehaviorProps): Behavior<any> => {
  switch (props.type) {
    case 'RenderCircle':
      const renderCircle = new RenderCircle();
      renderCircle.applyProps(props as RenderCircleProps);
      return renderCircle;
    case 'Movement':
      const movement = new MovementBehavior();
      movement.applyProps(props as MovementBehaviorProps);
      return movement;
    case 'FillColor':
      const fillColor = new FillColor((props as FillColorProps).color);
      fillColor.applyProps(props as FillColorProps);
      return fillColor;
    case 'CustomBehavior':
      return new CustomBehavior(props as CustomBehaviorProps);
    default:
      throw new Error(`Unknown behavior type: ${props.type}`);
  }
};

export type { RenderCircleProps, MovementBehaviorProps, FillColorProps, CustomBehaviorProps };

export type AnyBehaviorProps = RenderCircleProps | MovementBehaviorProps | FillColorProps | CustomBehaviorProps;
export type AnyBehavior = RenderCircle | MovementBehavior | FillColor | CustomBehavior;
