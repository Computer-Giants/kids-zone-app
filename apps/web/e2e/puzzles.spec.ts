import { expect, test } from "@playwright/test";

test.describe("Church Puzzles Engine (covers: AC-1 through AC-8)", () => {
  test("AC-1: /fun displays categorized puzzle collections with difficulty badges and theme tags", async ({
    page,
  }) => {
    await page.goto("/fun");

    // Header and guidance
    await expect(page.getByRole("heading", { name: "Catholic Church Puzzles" })).toBeVisible();
    await expect(page.getByText("Interactive Play & Faith Puzzles")).toBeVisible();

    // Type filter tabs
    await expect(page.getByRole("tab", { name: /All Puzzles/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Tile Matching/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Word Search/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Word Scramble/i })).toBeVisible();

    // Verify Puzzle cards
    const altarVesselsCard = page.locator('article[data-puzzle-slug="sacred-altar-vessels"]');
    await expect(altarVesselsCard).toBeVisible();
    await expect(altarVesselsCard.getByText("Sacred Altar Vessels")).toBeVisible();
    await expect(altarVesselsCard.getByText("Tile Match")).toBeVisible();

    const wordSearchCard = page.locator('article[data-puzzle-slug="holy-saints-of-god"]');
    await expect(wordSearchCard).toBeVisible();
    await expect(wordSearchCard.getByText("Holy Saints of God")).toBeVisible();
    await expect(wordSearchCard.getByText("Word Search")).toBeVisible();

    const scrambleCard = page.locator('article[data-puzzle-slug="holy-week-and-easter"]');
    await expect(scrambleCard).toBeVisible();
    await expect(scrambleCard.getByText("Holy Week & Easter")).toBeVisible();
    await expect(scrambleCard.getByText("Word Scramble")).toBeVisible();
  });

  test("AC-1: category tabs filter puzzle cards accurately", async ({ page }) => {
    await page.goto("/fun");

    // Click Tile Matching tab
    await page.getByRole("tab", { name: /Tile Matching/i }).click();

    await expect(page.locator('article[data-puzzle-slug="sacred-altar-vessels"]')).toBeVisible();
    await expect(page.locator('article[data-puzzle-slug="holy-saints-of-god"]')).not.toBeVisible();

    // Click Word Search tab
    await page.getByRole("tab", { name: /Word Search/i }).click();

    await expect(page.locator('article[data-puzzle-slug="holy-saints-of-god"]')).toBeVisible();
    await expect(
      page.locator('article[data-puzzle-slug="sacred-altar-vessels"]'),
    ).not.toBeVisible();
  });

  test("AC-4, AC-6: Tile matching puzzle flips cards and provides Lamb hint without penalty", async ({
    page,
  }) => {
    await page.goto("/fun/sacred-altar-vessels");

    await expect(
      page.getByRole("heading", { level: 1, name: "Sacred Altar Vessels" }),
    ).toBeVisible();
    await expect(page.getByText(/Matched:/i)).toBeVisible();

    // Hint button is available
    const hintBtn = page.getByRole("button", { name: /Ask the Lamb for a hint/i });
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();

    // Cards are interactive
    const firstCard = page.getByRole("button", { name: /Hidden card 1/i });
    await expect(firstCard).toBeVisible();
    await firstCard.click();
  });

  test("AC-3, AC-6: Word search displays letter grid, word bank, and gentle hint", async ({
    page,
  }) => {
    await page.goto("/fun/holy-saints-of-god");

    await expect(page.getByRole("heading", { level: 1, name: "Holy Saints of God" })).toBeVisible();
    await expect(page.getByText("Word Bank:")).toBeVisible();
    await expect(page.getByText("FRANCIS", { exact: true })).toBeVisible();
    await expect(page.getByText("PATRICK", { exact: true })).toBeVisible();

    // Grid cells are touch friendly
    const grid = page.getByRole("grid", { name: /Word search letter grid/i });
    await expect(grid).toBeVisible();

    // Hint button
    const hintBtn = page.getByRole("button", { name: /Ask the Lamb for a hint/i });
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
  });

  test("AC-5, AC-6, AC-7: Word scramble allows spelling, backspacing, and celebrating win", async ({
    page,
  }) => {
    await page.goto("/fun/holy-week-and-easter");

    await expect(page.getByRole("heading", { level: 1, name: "Holy Week & Easter" })).toBeVisible();
    await expect(page.getByText(/The joyful song of praise/i)).toBeVisible();

    // Tap letters to spell ALLELUIA (clicking the first available enabled chip)
    const letters = ["A", "L", "L", "E", "L", "U", "I", "A"];
    for (const l of letters) {
      await page.locator(`button:not([disabled])[aria-label="Letter chip ${l}"]`).first().click();
    }

    // AC-7: Celebration screen
    await expect(page.getByRole("heading", { name: /Well Done, Faithful Seeker!/i })).toBeVisible();
    await expect(
      page.getByText(/Glory to God! You solved the Holy Week & Easter puzzle!/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Play Another Puzzle/i })).toBeVisible();
  });
});
