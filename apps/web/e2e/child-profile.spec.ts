import { expect, test } from "@playwright/test";

test.describe("Child Profiles and Parent Gate Modal (covers: AC-6, AC-7)", () => {
  test("parent gate keypad modal opens from top navigation and allows numeric input", async ({
    page,
  }) => {
    await page.goto("/");

    // Locate the Parents button in the top navigation
    const parentGateBtn = page.getByRole("link", {
      name: "Parent settings and accounts",
    });
    await expect(parentGateBtn).toBeVisible();
    await parentGateBtn.click();

    // Verify modal overlay opens
    const modalHeading = page.getByRole("heading", { name: "Parent Gate" });
    await expect(modalHeading).toBeVisible();

    // Verify accessible numeric keypad buttons 0 through 9 are rendered
    for (let i = 0; i <= 9; i++) {
      await expect(page.getByRole("button", { name: `Digit ${i}`, exact: true })).toBeVisible();
    }

    // Tap digits 1, 2, 3 (partial passcode)
    await page.getByRole("button", { name: "Digit 1", exact: true }).click();
    await page.getByRole("button", { name: "Digit 2", exact: true }).click();
    await page.getByRole("button", { name: "Digit 3", exact: true }).click();

    // Tap Clear button to reset entered digits
    const clearBtn = page.getByRole("button", { name: "Clear", exact: true });
    await expect(clearBtn).toBeVisible();
    await expect(clearBtn).toBeEnabled();
    await clearBtn.click();

    // Close button dismisses the modal
    const closeBtn = page.getByRole("button", { name: "Close parent gate" });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(modalHeading).not.toBeVisible();
  });

  test("unauthenticated access to /parent is guarded and redirects to sign in", async ({
    page,
  }) => {
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Parent Sign In" })).toBeVisible();
  });
});
