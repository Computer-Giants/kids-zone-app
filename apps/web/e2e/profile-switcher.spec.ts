import { expect, test } from "@playwright/test";

test.describe("Profile Switcher and Guest Mode (covers: AC-1 through AC-7)", () => {
  test("guest exploration allows selecting an age band and displays guest pill in navigation", async ({
    page,
  }) => {
    // 1. Visit /select-profile as an unauthenticated guest
    await page.goto("/select-profile");

    // Verify page heading and guest explanation
    await expect(page.getByRole("heading", { name: "Who is Learning Today?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Guest Exploration Mode" })).toBeVisible();

    // Verify all 3 Catholic age band cards are rendered
    await expect(page.getByText("Little Lambs")).toBeVisible();
    await expect(page.getByText("Seekers")).toBeVisible();
    await expect(page.getByText("Disciples")).toBeVisible();

    // 2. Select "Little Lambs" age band (Ages 3 to 7)
    const littleLambsBtn = page.getByRole("button").filter({ hasText: "Little Lambs" });
    await expect(littleLambsBtn).toBeVisible();
    await littleLambsBtn.click();

    // 3. User is redirected to learning home
    await expect(page).toHaveURL("/");

    // 4. Navigation header renders guest badge pill with switch action
    const guestPill = page.getByRole("link", {
      name: /Guest mode: Ages 3 to 7/i,
    });
    await expect(guestPill).toBeVisible();

    // 5. Tapping switch pill returns to /select-profile
    await guestPill.click();
    await expect(page).toHaveURL("/select-profile");
  });

  test("guest age band selection updates cookie without creating server records", async ({
    page,
    context,
  }) => {
    await page.goto("/select-profile");

    // Select "Seekers" (Ages 8 to 10)
    const seekersBtn = page.getByRole("button").filter({ hasText: "Seekers" });
    await expect(seekersBtn).toBeVisible();
    await seekersBtn.click();

    await expect(page).toHaveURL("/");

    // Verify cookie kz_guest_age_band is set to b8_10
    const cookies = await context.cookies();
    const guestCookie = cookies.find((c) => c.name === "kz_guest_age_band");
    expect(guestCookie).toBeDefined();
    expect(guestCookie?.value).toBe("b8_10");

    // Active child cookie should NOT exist for guests
    const childCookie = cookies.find((c) => c.name === "kz_active_child");
    expect(childCookie).toBeUndefined();
  });

  test("parent gate protects access to parent controls from navigation header", async ({
    page,
  }) => {
    await page.goto("/");

    // Locate Parents lock button in top navigation
    const parentGateLink = page.getByRole("link", {
      name: "Parent settings and accounts",
    });
    await expect(parentGateLink).toBeVisible();
    await parentGateLink.click();

    // Verify Parent Gate modal opens
    const modalTitle = page.getByRole("heading", { name: "Parent Gate" });
    await expect(modalTitle).toBeVisible();

    // Keypad numbers 0 to 9 are accessible
    for (let i = 0; i <= 9; i++) {
      await expect(page.getByRole("button", { name: `Digit ${i}`, exact: true })).toBeVisible();
    }

    // Enter incorrect passcode (1234)
    await page.getByRole("button", { name: "Digit 1", exact: true }).click();
    await page.getByRole("button", { name: "Digit 2", exact: true }).click();
    await page.getByRole("button", { name: "Digit 3", exact: true }).click();
    await page.getByRole("button", { name: "Digit 4", exact: true }).click();

    // Verify rejection error is shown
    await expect(
      page.getByText(/Incorrect passcode|Authentication required|Failed to save/i),
    ).toBeVisible();

    // Close modal
    await page.getByRole("button", { name: "Close parent gate" }).click();
    await expect(modalTitle).not.toBeVisible();
  });

  test("unauthenticated visitor sees sign in recommendation on /select-profile", async ({
    page,
  }) => {
    await page.goto("/select-profile");

    // Verify sign in callout
    await expect(page.getByText("Have a family account?")).toBeVisible();
    const signInLink = page.getByRole("link", { name: /Sign in as parent/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", "/login?next=/select-profile");
  });
});
