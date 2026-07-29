export const healthResponseSchema = {
  description: "Health check endpoint",
  tags: ["Health"],
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            status: { type: "string" },
            uptime: { type: "number" },
            timestamp: { type: "string" },
          },
        },
      },
    },
  },
};