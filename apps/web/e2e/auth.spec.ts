import { expect, test } from "@playwright/test";

test.describe("Parent Authentication and Route Protection", () => {
  test("unauthenticated visit to /parent redirects to /login?next=/parent", async ({ page }) => {
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/login\?next=(%2F|\/)parent/);
    await expect(page.getByRole("heading", { name: "Parent Sign In" })).toBeVisible();
  });

  test("login page renders with password and magic link tabs", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Parent Sign In" })).toBeVisible();

    // Password tab is default
    await expect(page.getByLabel("Parent Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In with Password" })).toBeVisible();

    // Switch to Magic Link tab
    await page.getByRole("button", { name: "Magic Link" }).click();
    await expect(page.getByRole("button", { name: "Send Magic Link" })).toBeVisible();
  });

  test("signup page renders with required fields and privacy note", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: "Create Parent Account" })).toBeVisible();
    await expect(page.getByLabel(/Email Address/)).toBeVisible();
    await expect(page.getByLabel(/Password/)).toBeVisible();
    await expect(page.getByText("Family Privacy Guarantee")).toBeVisible();
  });
});
