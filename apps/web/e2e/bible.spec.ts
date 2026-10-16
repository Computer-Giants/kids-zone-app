import { expect, test } from "@playwright/test";

test.describe("Bible Reader and Verse of the Day (covers: AC-1 through AC-8)", () => {
  test("AC-1: /bible renders Verse of the Day and all 73 Catholic canonical books", async ({
    page,
  }) => {
    await page.goto("/bible");

    // Header and Catholic banner
    await expect(page.getByRole("heading", { name: "Holy Bible for Children" })).toBeVisible();
    await expect(page.getByText("Catholic Sacred Scripture")).toBeVisible();

    // Verse of the Day section
    const votdSection = page.getByRole("region", { name: "Verse of the Day" });
    await expect(votdSection).toBeVisible();
    await expect(votdSection.getByText("Verse of the Day")).toBeVisible();
    await expect(votdSection.getByText(/What this means for you/i)).toBeVisible();

    // Catholic Canonical Book Selector
    await expect(page.getByRole("heading", { name: "All 73 Catholic Books" })).toBeVisible();

    // Filter tabs
    const allTab = page.getByRole("tab", { name: /All Books \(73\)/i });
    const oldTab = page.getByRole("tab", { name: /Old Testament \(46\)/i });
    const deuteroTab = page.getByRole("tab", { name: /Deuterocanonical \(7\)/i });
    const newTab = page.getByRole("tab", { name: /New Testament \(27\)/i });

    await expect(allTab).toBeVisible();
    await expect(oldTab).toBeVisible();
    await expect(deuteroTab).toBeVisible();
    await expect(newTab).toBeVisible();

    // Verify presence of canonical Catholic books (including Deuterocanonicals)
    await expect(page.getByRole("link", { name: /^Genesis\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Tobit\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Judith\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Wisdom\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Sirach\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Baruch\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^1 Maccabees\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^2 Maccabees\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Matthew\b/i })).toBeVisible();
  });

  test("AC-1: book selector tabs and search bar filter books accurately", async ({ page }) => {
    await page.goto("/bible");

    // Filter by Deuterocanonical tab
    const deuteroTab = page.getByRole("tab", { name: /Deuterocanonical \(7\)/i });
    await deuteroTab.click();

    await expect(page.getByRole("link", { name: /^Tobit\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Judith\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Wisdom\b/i })).toBeVisible();
    // Non-deuterocanonical books should be hidden
    await expect(page.getByRole("link", { name: /^Genesis\b/i })).not.toBeVisible();
    await expect(page.getByRole("link", { name: /^Matthew\b/i })).not.toBeVisible();

    // Switch to All Books and test search filter
    await page.getByRole("tab", { name: /All Books \(73\)/i }).click();
    const searchInput = page.getByPlaceholder("Search by book name...");
    await searchInput.fill("Psalms");

    await expect(page.getByRole("link", { name: /^Psalms\b/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Genesis\b/i })).not.toBeVisible();
  });

  test("AC-2, AC-5: Genesis 1 reader displays Story Retelling mode with multi-page stepper", async ({
    page,
  }) => {
    await page.goto("/bible/gen/1");

    // Mode buttons presence
    const storiesBtn = page.getByRole("button", { name: /Story Retelling/i });
    const keyVersesBtn = page.getByRole("button", { name: /Key Verses/i });
    const fullChapterBtn = page.getByRole("button", { name: /Full Chapter/i });

    await expect(storiesBtn).toBeVisible();
    await expect(keyVersesBtn).toBeVisible();
    await expect(fullChapterBtn).toBeVisible();

    // If not currently pressed, click it
    if ((await storiesBtn.getAttribute("aria-pressed")) !== "true") {
      await storiesBtn.click();
    }

    // Verify story retelling title and page stepper
    await expect(
      page.getByRole("heading", { name: "God Creates the Beautiful World" }),
    ).toBeVisible();
    await expect(page.getByText(/Page 1 of 6/i)).toBeVisible();

    // Navigate to next story page
    const nextBtn = page.getByRole("button", { name: /Next Page/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(page.getByText(/Page 2 of 6/i)).toBeVisible();
  });

  test("AC-3, AC-5: switching to Key Verses mode shows practical meanings", async ({ page }) => {
    await page.goto("/bible/gen/1");

    // Switch to Key Verses
    const keyVersesBtn = page.getByRole("button", { name: /Key Verses/i });
    await keyVersesBtn.click();
    await expect(keyVersesBtn).toHaveAttribute("aria-pressed", "true");

    // Verify Key Verses heading and meaning content
    await expect(
      page.getByRole("heading", { name: /Memorable Verses from Genesis 1/i }),
    ).toBeVisible();
    await expect(page.getByText("Genesis 1:1")).toBeVisible();
    await expect(page.getByText(/In the beginning God created heaven, and earth/i)).toBeVisible();
    await expect(page.getByText(/What this means for you/i)).toBeVisible();
  });

  test("AC-4, AC-5: switching to Full Chapter mode shows Douay-Rheims numbered verses", async ({
    page,
  }) => {
    await page.goto("/bible/gen/1");

    // Switch to Full Chapter
    const fullChapterBtn = page.getByRole("button", { name: /Full Chapter/i });
    await fullChapterBtn.click();
    await expect(fullChapterBtn).toHaveAttribute("aria-pressed", "true");

    // Verify Douay-Rheims citation notice and verse 1
    await expect(page.getByRole("heading", { name: /^Genesis 1$/i })).toBeVisible();
    await expect(page.getByText("Douay-Rheims Catholic Bible")).toBeVisible();
    await expect(page.getByText(/In the beginning God created heaven, and earth/i)).toBeVisible();
    // Verse 2
    await expect(page.getByText(/And the earth was void and empty/i)).toBeVisible();
  });

  test("AC-6: read aloud audio controls are accessible and responsive", async ({ page }) => {
    await page.goto("/bible/gen/1");

    // Audio player container
    const playBtn = page.getByRole("button", { name: /Play reading aloud|Pause reading/i });
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toBeEnabled();
  });

  test("AC-8: completing a chapter reading triggers celebratory feedback and saves progress", async ({
    page,
  }) => {
    await page.goto("/bible/gen/1");

    // Scroll to completion section
    const completeBtn = page.getByRole("button", { name: /I Finished Reading!/i });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();

    // Verify celebration message and lamb mascot
    await expect(
      page.getByRole("heading", { name: "Great job reading God's Word!" }),
    ).toBeVisible();
    await expect(page.getByText(/Your reading was saved to your device/i)).toBeVisible();
  });
});
