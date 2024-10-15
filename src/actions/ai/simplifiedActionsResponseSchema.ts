export const simplifiedActionsResponseSchema = {
  type: "object",
  properties: {
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          entityProps: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              rotation: { type: "number" },
              scale: { type: "number" },
              behaviors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    name: { type: "string" },
                  },
                  required: ["type"],
                },
              },
            },
            required: ["x", "y", "rotation", "scale", "behaviors"],
          },
          entityId: { type: "string" },
          updates: { type: "object" },
          behaviorProps: { type: "object" },
          behaviorType: { type: "string" },
          entityIds: { type: "array", items: { type: "string" } },
        },
        required: ["type"],
      },
    },
  },
  required: ["actions"],
};
