import { runSnippetWithEasyBreezyContext } from "../ai/with-code-snippet/handleGeneratedCodeSnippet";
import {
  BehaviorProps,
  ReadonlyDeep,
  StageEntityProps,
} from "../types/data-types";
import { BehaviorResolver } from "./BehaviorResolver.type";

export const builtInBehaviorResolversDictionary = {
  RenderCircle: {
    render() {
      return <circle r={this.radius ?? 10} />;
    },
    getBounds(entity) {
      const radius = (this.radius ?? 10) * entity.scale;
      return {
        x: entity.x - radius,
        y: entity.y - radius,
        width: radius * 2,
        height: radius * 2,
      };
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
    onTick(entity, deltaTimeSeconds, totalTimeSeconds) {;
      if (typeof this.onTick === "function") {
        return this.onTick.call(
          this,
          entity,
          deltaTimeSeconds,
          totalTimeSeconds
        );
      }

      if (typeof this.onTick === "string") {
        const snippet = this.onTick;
        runSnippetWithEasyBreezyContext(this, snippet, {
          entity,
          deltaTimeSeconds,
          totalTimeSeconds,
        });
      }
    },
    render(entity, content) {
      if (typeof this.render === "function") {
        return this.render.call(this, entity, content);
      }

      if (typeof this.render === "string") {
        const snippet = `return (${this.render})`;
        runSnippetWithEasyBreezyContext(this, snippet, {
          entity,
          content,
        });
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
    getBounds(entity) {
      const fontSize = ~~(this.fontSize || 40) * entity.scale;
      return {
        x: entity.x - fontSize / 2,
        y: entity.y - fontSize / 2,
        width: fontSize,
        height: fontSize,
      };
    },
  },
  RenderRectangle: {
    render() {
      const width = this.width ?? 20;
      const height = this.height ?? 20;
      return <rect width={width} height={height} />;
    },
    getBounds(entity) {
      const width = (this.width ?? 20) * entity.scale;
      const height = (this.height ?? 20) * entity.scale;
      return {
        x: entity.x - width / 2,
        y: entity.y - height / 2,
        width,
        height,
      };
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
  RenderRectangle: { width?: number; height?: number };
};

type BuiltInBehaviorsPropsDictionary = {
  [key in keyof BuiltInBehaviorsExtraPropsDictionary /******/]: BehaviorProps &
    BuiltInBehaviorsExtraPropsDictionary[key] & { type: key };
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
