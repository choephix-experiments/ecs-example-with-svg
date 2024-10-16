import {
  StageEntityProps,
  ReadonlyDeep,
  BehaviorProps,
} from "../types/data-types";
import { BehaviorResolver } from "./BehaviorResolver.type";

export const builtInBehaviorResolversDictionary = {
  RenderCircle: {
    render() {
      return <circle r={this.radius ?? 10} />;
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
    onTick(entity, deltaTimeSeconds, totalTimeSeconds) {
      if (typeof this.onTick === "function") {
        return this.onTick.call(
          this,
          entity,
          deltaTimeSeconds,
          totalTimeSeconds
        );
      }

      if (typeof this.onTick === "string") {
        const func = new Function(
          "entity",
          "deltaTimeSeconds",
          "totalTimeSeconds",
          this.onTick
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
      const emoji = this.emoji ?? "🙂";
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

type BuiltInBehaviorsExtraPropsDictionary = {
  RenderCircle: { radius?: number };
  ChangeColor: { color?: string };
  SimplifyMesh: { sides?: number };
  CustomBehavior: {
    name: string;
    start?: string | (() => void);
    onTick?:
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

type BuiltInBehaviorsPropsDictionary = {
  [key in keyof BuiltInBehaviorsExtraPropsDictionary]: /******/
  BehaviorProps & BuiltInBehaviorsExtraPropsDictionary[key] & { type: key };
};

export type BuiltInBehaviorType = keyof BuiltInBehaviorsPropsDictionary;
export type BuiltInBehaviorProps<
  K extends BuiltInBehaviorType = BuiltInBehaviorType
> = BuiltInBehaviorsPropsDictionary[K];

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
