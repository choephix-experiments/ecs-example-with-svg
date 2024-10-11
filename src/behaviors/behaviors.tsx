import React from "react";
import {
  BehaviorProps,
  ReadonlyDeep,
  StageEntityProps,
} from "../types/data-types";

type BuiltInBehaviorsExtraPropsDictionary = {
  RenderCircle: { radius?: number };
  FillColor: { color?: string };
  SimplifyMesh: { sides?: number };
};
type BuiltInBehaviorsPropsDictionary = {
  [key in keyof BuiltInBehaviorsExtraPropsDictionary]: {
    type: key;
  } & BuiltInBehaviorsExtraPropsDictionary[key];
};
export type BuiltInBehaviorsProps =
  BuiltInBehaviorsPropsDictionary[keyof BuiltInBehaviorsPropsDictionary];

// Define the structure for behavior resolvers
export type BehaviorResolver<T extends BehaviorProps = BehaviorProps> = {
  update?: (this: T, entity: StageEntityProps, deltaTime: number) => void;
  render?: (
    this: T,
    entity: ReadonlyDeep<StageEntityProps>,
    content: React.ReactNode | null
  ) => React.ReactNode | null;
};

// Global dictionary of behavior resolvers
export const behaviorResolvers = {
  RenderCircle: {
    render(entity) {
      return (
        <circle
          cx={entity.x}
          cy={entity.y}
          r={this.radius! * entity.scale}
          transform={`rotate(${entity.rotation} ${entity.x} ${entity.y})`}
        />
      );
    },
  },
  FillColor: {
    render(entity, content) {
      const color =
        (entity.behaviors.find((b) => b.type === "FillColor") as any)?.color ||
        "black";
      return <g fill={color}>{content}</g>;
    },
  },
  SimplifyMesh: {
    render(entity) {
      const sides =
        (entity.behaviors.find((b) => b.type === "SimplifyMesh") as any)
          ?.sides || 6;
      const radius =
        (entity.behaviors.find((b) => b.type === "RenderCircle") as any)
          ?.radius || 10;
      const color =
        (entity.behaviors.find((b) => b.type === "FillColor") as any)?.color ||
        "black";
      const points = generatePolygonPoints(entity.x, entity.y, radius, sides);
      return <polygon points={points} fill={color} />;
    },
  },
} as {
  [key in keyof BuiltInBehaviorsPropsDictionary]: BehaviorResolver<
    BuiltInBehaviorsPropsDictionary[key]
  >;
};

// Helper function for SimplifyMesh
function generatePolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number
): string {
  let points = "";
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points += `${x},${y} `;
  }
  return points.trim();
}
