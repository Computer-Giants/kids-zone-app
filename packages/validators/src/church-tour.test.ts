import { describe, expect, it } from "vitest";
import {
  churchTourCompleteSchema,
  churchTourItemTapSchema,
  churchTourSceneQuerySchema,
} from "./church-tour";

describe("Church Tour Validators", () => {
  it("validates valid complete payload for authenticated child", () => {
    const valid = {
      childId: "11111111-1111-4111-8111-111111111111",
      idempotencyKey: "22222222-2222-4222-8222-222222222222",
      completedItemIds: ["item-01", "item-02"],
    };
    const parsed = churchTourCompleteSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("validates complete payload for guest learner (optional childId)", () => {
    const guest = {
      idempotencyKey: "22222222-2222-4222-8222-222222222222",
    };
    const parsed = churchTourCompleteSchema.safeParse(guest);
    expect(parsed.success).toBe(true);
  });

  it("fails when idempotencyKey is missing or not a uuid", () => {
    const invalid = {
      childId: "11111111-1111-4111-8111-111111111111",
      idempotencyKey: "not-a-uuid",
    };
    const parsed = churchTourCompleteSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("validates scene query with valid age bands", () => {
    expect(churchTourSceneQuerySchema.safeParse({ ageBand: "b3_7" }).success).toBe(true);
    expect(churchTourSceneQuerySchema.safeParse({ ageBand: "b8_10" }).success).toBe(true);
    expect(churchTourSceneQuerySchema.safeParse({ ageBand: "b11_15" }).success).toBe(true);
    expect(churchTourSceneQuerySchema.safeParse({ ageBand: "adult" }).success).toBe(false);
    expect(churchTourSceneQuerySchema.safeParse({}).success).toBe(true);
  });

  it("validates item tap payload", () => {
    expect(
      churchTourItemTapSchema.safeParse({
        itemId: "item-0001-01",
        sceneSlug: "narthex",
      }).success,
    ).toBe(true);

    expect(
      churchTourItemTapSchema.safeParse({
        itemId: "",
        sceneSlug: "narthex",
      }).success,
    ).toBe(false);
  });
});
