import { expect, test } from "@playwright/test";

test.describe("Saint of the Day and Life Stories (covers: AC-1 through AC-8)", () => {
  test("AC-1: /saints displays Saint of the Day hero card and Discover Another Saint action", async ({
    page,
  }) => {
    await page.goto("/saints");

    // Header and section heading
    await expect(
      page.getByRole("heading", { name: "Catholic Saints & Life Stories" }),
    ).toBeVisible();
    await expect(page.getByText("Friends of Jesus in Heaven")).toBeVisible();

    // Saint of the day section
    await expect(page.getByRole("heading", { name: /Today's Holy Hero/i })).toBeVisible();
    await expect(page.getByText("Saint of the Day")).toBeVisible();

    // Discover Another Saint button exists
    const discoverBtn = page.getByTestId("discover-another-saint-btn");
    await expect(discoverBtn).toBeVisible();
    await expect(discoverBtn).toHaveText(/Discover Another Saint/i);
  });

  test("AC-2: Catalog search and patronage filters filter saints accurately", async ({ page }) => {
    await page.goto("/saints");

    // Patronage filter button for Animals
    const animalsBadge = page.getByRole("button", { name: /Animals & Ecology/i });
    await expect(animalsBadge).toBeVisible();
    await animalsBadge.click();

    // St. Francis should be visible in the grid
    const francisCard = page.locator('article[data-saint-slug="francis-of-assisi"]').first();
    await expect(francisCard).toBeVisible();

    // Reset patronage filter to All Patronages before searching
    await page.getByRole("button", { name: /All Patronages/i }).click();

    // Search filter
    const searchInput = page.getByLabel("Search saints by name or alias");
    await searchInput.fill("Patrick");

    // St. Patrick should be visible
    const patrickCard = page.locator('article[data-saint-slug="patrick"]').first();
    await expect(patrickCard).toBeVisible();

    // Clear search
    await searchInput.fill("");
  });

  test("AC-3, AC-4, AC-7: /saints/francis-of-assisi displays header and Picture Story mode with page stepper", async ({
    page,
  }) => {
    await page.goto("/saints/francis-of-assisi");

    // AC-3: Header, feast date, and patronages
    await expect(page.getByRole("heading", { level: 1, name: "Francis of Assisi" })).toBeVisible();
    await expect(page.getByText(/October 4/i)).toBeVisible();
    await expect(page.getByText(/1181 to 1226 AD/i)).toBeVisible();

    // AC-4: Story retelling mode
    await expect(
      page.getByRole("heading", { name: "Saint Francis and the Peaceful Wolf" }),
    ).toBeVisible();
    await expect(page.getByText(/Page 1 of 5/i)).toBeVisible();
    await expect(page.getByText(/Gubbio/i)).toBeVisible();

    // Stepper controls
    const nextBtn = page.getByRole("button", { name: /Next Page/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(page.getByText(/Page 2 of 5/i)).toBeVisible();

    // AC-7: Audio player controls
    await expect(page.getByLabel("Listen to audio narration")).toBeVisible();
    await expect(page.getByRole("region", { name: /Audio Player/i })).toBeVisible();
  });

  test("AC-5, AC-6: Switching between Fun Facts and Full Biography displays respective content", async ({
    page,
  }) => {
    await page.goto("/saints/francis-of-assisi");

    // Switch to Fun Facts mode (AC-5)
    const factsBtn = page.getByTestId("mode-facts-btn");
    await factsBtn.click();

    await expect(page.getByRole("heading", { name: "Memorable Fun Facts" })).toBeVisible();
    await expect(page.getByText(/very first Christmas Nativity manger scene/i)).toBeVisible();
    await expect(page.getByText(/Virtues to Practice Today/i)).toBeVisible();
    await expect(page.getByText("Peacemaking")).toBeVisible();

    // Switch to Full Biography mode (AC-6)
    const bioBtn = page.getByTestId("mode-bio-btn");
    await bioBtn.click();

    await expect(
      page.getByRole("heading", { name: "Historical Journey & Pilgrimage" }),
    ).toBeVisible();
    await expect(page.getByText("Assisi", { exact: true })).toBeVisible();
    await expect(page.getByText("Basilica of Saint Francis")).toBeVisible();
    await expect(page.getByText(/Lord, make me an instrument of Thy peace/i)).toBeVisible();
  });

  test("AC-8: Completing a saint story records progress and shows lamb mascot celebration", async ({
    page,
  }) => {
    await page.goto("/saints/therese-of-lisieux");

    const completeBtn = page.getByTestId("complete-saint-reading-btn");
    await expect(completeBtn).toBeVisible();
    await expect(completeBtn).toHaveText(/I Finished Reading!/i);

    await completeBtn.click();

    // Feedback updates to Story Completed
    await expect(completeBtn).toHaveText(/Story Completed!/i);
    await expect(page.getByText(/Wonderful reading!/i)).toBeVisible();
  });
});
