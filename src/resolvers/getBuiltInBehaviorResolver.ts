import { BehaviorProps } from "../types/data-types";
import { BehaviorResolver } from "./BehaviorResolver.type";
import { builtInBehaviorResolversDictionary } from "./builtInBehaviorResolversDictionary";

export function getBuiltInBehaviorResolver(
  behaviorProps: BehaviorProps & { onTick?: unknown; render?: unknown }
) {
  const type = behaviorProps.type;
  const resolver =
    builtInBehaviorResolversDictionary[
      type as keyof typeof builtInBehaviorResolversDictionary
    ];
  if (resolver) {
    return resolver as BehaviorResolver<typeof behaviorProps>;
  }

  //// Default to CustomBehavior if 'onTick' or 'render' are string
  if (
    typeof behaviorProps.onTick === "string" ||
    typeof behaviorProps.render === "string"
  ) {
    return builtInBehaviorResolversDictionary.CustomBehavior as BehaviorResolver<
      typeof behaviorProps
    >;
  }

  return null;
}
