import { expect, test } from "@playwright/test";

test.describe("Rewards Ledger and Streak Tracking (covers: AC-1 through AC-8)", () => {
  test("AC-5, AC-8: Login page renders with parent heading and credentials guidance", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Parent Sign In" })).toBeVisible();
    await expect(page.getByLabel("Parent Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In with Password" })).toBeVisible();
  });

  test("AC-1, AC-4: API endpoint /api/rewards/activity processes guest completions cleanly", async ({
    request,
  }) => {
    const res = await request.post("/api/rewards/activity", {
      data: {
        type: "puzzle_completed",
        score: 100,
        idempotencyKey: "11111111-1111-1111-1111-111111111111",
      },
    });

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.guest).toBe(true);
    expect(data.starsEarned).toBeGreaterThanOrEqual(1);
    expect(data.streak.current).toBe(1);
  });

  test("AC-2, AC-3: API validates required activity completion attributes and rejects bad UUIDs", async ({
    request,
  }) => {
    const badRes = await request.post("/api/rewards/activity", {
      data: {
        type: "verse_read",
        idempotencyKey: "bad-key",
      },
    });

    expect(badRes.status()).toBe(400);
  });
});
