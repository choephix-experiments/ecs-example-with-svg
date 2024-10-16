import React from "react";
import {
  BehaviorProps,
  ReadonlyDeep,
  StageEntityProps,
} from "../types/data-types";

type BuiltInBehaviorsExtraPropsDictionary = {
  RenderCircle: { radius?: number };
  ChangeColor: { color?: string };
  SimplifyMesh: { sides?: number };
  CustomBehavior: {
    name: string;
    start?: string | (() => void);
    update?:
      | string
      | ((
          entity: StageEntityProps,
          deltaTime: number,
          totalTime: number
        ) => void);
    render?:
      | string
      | ((
          entity: ReadonlyDeep<StageEntityProps>,
          currentContent: React.ReactNode | null
        ) => React.ReactNode | null);
    destroy?: string | (() => void);
    [key: string]: unknown;
  };
  RenderEmoji: { emoji: string; fontSize?: number };
};

export type BuiltInBehaviorsPropsDictionary = {
  [key in keyof BuiltInBehaviorsExtraPropsDictionary]: {
    uuid: string;
    type: key;
  } & BuiltInBehaviorsExtraPropsDictionary[key];
};

export type BuiltInBehaviorProps =
  BuiltInBehaviorsPropsDictionary[keyof BuiltInBehaviorsPropsDictionary];

export type BuiltInBehaviorBlueprint = Omit<
  BuiltInBehaviorsPropsDictionary[keyof BuiltInBehaviorsPropsDictionary],
  "uuid"
>;

// Define the structure for behavior resolvers
export type BehaviorResolver<T extends BehaviorProps = BehaviorProps> = {
  update?: (
    this: T,
    entity: StageEntityProps,
    deltaTime: number,
    totalTime: number
  ) => void;
  render?: (
    this: T,
    entity: ReadonlyDeep<StageEntityProps>,
    content: React.ReactNode | null
  ) => React.ReactNode | null;
};

// Global dictionary of behavior resolvers
const behaviorResolvers = {
  RenderCircle: {
    render() {
      return <circle r={this.radius!} />;
    },
  },
  ChangeColor: {
    render(_, content) {
      const color = this.color || "white";
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
        (entity.behaviors.find((b) => b.type === "ChangeColor") as any)
          ?.color || undefined;
      const points = generatePolygonPoints(radius, sides);
      return <polygon points={points} fill={color} />;
    },
  },
  CustomBehavior: {
    update(entity, deltaTimeSeconds, totalTimeSeconds) {
      if (typeof this.update === "function") {
        return this.update.call(
          this,
          entity,
          deltaTimeSeconds,
          totalTimeSeconds
        );
      }

      if (typeof this.update === "string") {
        const func = new Function(
          "entity",
          "deltaTimeSeconds",
          "totalTimeSeconds",
          this.update
        );
        func.call(this, entity, deltaTimeSeconds, totalTimeSeconds);
      }
    },
    render(entity, content) {
      if (typeof this.render === "function") {
        return this.render.call(this, entity, content);
      }

      if (typeof this.render === "string") {
        const funcStr = `return (${this.render})`;
        const func = new Function("entity", "content", funcStr);
        return func.call(this, entity, content);
      }

      return content;
    },
  },
  RenderEmoji: {
    render(_, content) {
      const emoji = this.emoji;
      const fontSize = ~~(this.fontSize || 40);
      return (
        <>
          {content}
          <text
            fontSize={fontSize}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ userSelect: "none" }}
            y="-2"
          >
            {emoji}
          </text>
        </>
      );
    },
  },
} as {
  [key in keyof BuiltInBehaviorsPropsDictionary]: BehaviorResolver<
    BuiltInBehaviorsPropsDictionary[key]
  >;
};

export function getBehaviorResolver(
  behaviorProps: BehaviorProps & { update?: unknown; render?: unknown }
) {
  const type = behaviorProps.type;
  const resolver = behaviorResolvers[type as keyof typeof behaviorResolvers];
  if (resolver) {
    return resolver as BehaviorResolver<typeof behaviorProps>;
  }

  //// Default to CustomBehavior if 'update' or 'render' are string
  if (
    typeof behaviorProps.update === "string" ||
    typeof behaviorProps.render === "string"
  ) {
    return behaviorResolvers.CustomBehavior as BehaviorResolver<
      typeof behaviorProps
    >;
  }

  return null;
}

// Helper function for SimplifyMesh
function generatePolygonPoints(radius: number, sides: number): string {
  let points = "";
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points += `${x},${y} `;
  }
  return points.trim();
}
