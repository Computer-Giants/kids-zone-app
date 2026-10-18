import { z } from "zod";

export const churchTourSceneQuerySchema = z.object({
  ageBand: z.enum(["b3_7", "b8_10", "b11_15"]).optional(),
});
export type ChurchTourSceneQuery = z.infer<typeof churchTourSceneQuerySchema>;

export const churchTourCompleteSchema = z.object({
  childId: z.string().uuid("Invalid child ID format").optional(),
  idempotencyKey: z.string().uuid("Invalid idempotency key format"),
  completedItemIds: z.array(z.string()).optional(),
});
export type ChurchTourCompleteInput = z.infer<typeof churchTourCompleteSchema>;

export const churchTourItemTapSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  sceneSlug: z.string().min(1, "Scene slug is required"),
});
export type ChurchTourItemTapInput = z.infer<typeof churchTourItemTapSchema>;
