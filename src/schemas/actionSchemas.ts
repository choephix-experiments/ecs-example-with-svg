import { z } from "zod";
import { BuiltInBehaviorBlueprint } from "../behaviors/behaviors";
import { BehaviorProps, StageEntityProps } from "../types/data-types";

const StageEntityPropsSchema = z.object({
  uuid: z.string(),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  scale: z.number(),
  behaviors: z.array(z.object({
    uuid: z.string(),
    type: z.string(),
    name: z.string().optional(),
  })),
});

const BuiltInBehaviorBlueprintSchema = z.object({
  type: z.string(),
}).and(z.record(z.unknown()));

const ActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("addEntity"), entityProps: StageEntityPropsSchema }),
  z.object({ type: z.literal("removeEntity"), entityId: z.string() }),
  z.object({ type: z.literal("updateEntity"), entityId: z.string(), updates: StageEntityPropsSchema.partial() }),
  z.object({ type: z.literal("addBehavior"), entityId: z.string(), behaviorProps: BuiltInBehaviorBlueprintSchema }),
  z.object({ type: z.literal("removeBehavior"), entityId: z.string(), behaviorType: z.string() }),
  z.object({ type: z.literal("updateBehavior"), entityId: z.string(), behaviorType: z.string(), updates: z.object({
    uuid: z.string().optional(),
    type: z.string().optional(),
    name: z.string().optional(),
  }).and(z.record(z.unknown())) }),
  z.object({ type: z.literal("clearWorld") }),
  z.object({ type: z.literal("selectEntities"), entityIds: z.array(z.string()) }),
  z.object({ type: z.literal("deselectEntities"), entityIds: z.array(z.string()) }),
  z.object({ type: z.literal("clearSelection") }),
]);

export const ActionsResponseSchema = z.object({
  actions: z.array(ActionSchema),
});

export type ActionSchemaType = z.infer<typeof ActionSchema>;
export type ActionsResponseSchemaType = z.infer<typeof ActionsResponseSchema>;
