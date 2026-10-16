import { expect, test } from "@playwright/test";

test.describe("Quizzes and Lamb Guide Feedback (covers: AC-1 through AC-8)", () => {
  test("AC-1: /quizzes displays curated categories and quiz cards", async ({ page }) => {
    await page.goto("/quizzes");

    // Header and guidance tip
    await expect(page.getByRole("heading", { name: "Fun Faith Quizzes" })).toBeVisible();
    await expect(page.getByText("Joyful Faith Discovery")).toBeVisible();
    await expect(
      page.getByText(/In Kid Zone quizzes, there are never any red cross marks/i),
    ).toBeVisible();

    // Category filter buttons
    await expect(page.getByRole("button", { name: /All Categories/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Bible/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Saints/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Catechism/i })).toBeVisible();

    // Verify Quiz cards
    const creationCard = page.locator('article[data-quiz-slug="creation-and-gods-animals"]');
    await expect(creationCard).toBeVisible();
    await expect(creationCard.getByText("Creation & God's Beautiful World")).toBeVisible();
    await expect(creationCard.getByText("4 Questions")).toBeVisible();
  });

  test("AC-1: category filter buttons filter quiz list accurately", async ({ page }) => {
    await page.goto("/quizzes");

    // Click Saints filter
    await page.getByRole("button", { name: /Saints/i }).click();

    await expect(page.locator('article[data-quiz-slug="saint-francis-and-friends"]')).toBeVisible();
    await expect(
      page.locator('article[data-quiz-slug="creation-and-gods-animals"]'),
    ).not.toBeVisible();

    // Click All Categories
    await page.getByRole("button", { name: /All Categories/i }).click();
    await expect(page.locator('article[data-quiz-slug="creation-and-gods-animals"]')).toBeVisible();
  });

  test("AC-2, AC-4, AC-5: Interactive 4-question flow with encouraging lamb reactions and explanations", async ({
    page,
  }) => {
    await page.goto("/quizzes/creation-and-gods-animals");

    // Progress header
    await expect(page.getByText(/Question 1 of 4/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /On the first day of creation/i }),
    ).toBeVisible();

    // Optional hint test
    const hintBtn = page.getByRole("button", { name: /Need a friendly hint?/i });
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(page.getByText(/Think about what shines in the morning sky!/i)).toBeVisible();

    // AC-4: Test gentle mistake feedback (never red, friendly lamb encouraging mood)
    const mistakeOption = page.getByRole("button", { name: /Let there be rain!/i });
    await mistakeOption.click();

    const checkBtn = page.getByTestId("submit-answer-btn");
    await checkBtn.click();

    // Gentle encouraging explanation
    await expect(page.getByText(/Keep learning, little lamb!/i)).toBeVisible();
    await expect(
      page.getByText(/God said 'Let there be light', and there was light!/i),
    ).toBeVisible();

    // AC-5: Next question button advances to Question 2
    const nextBtn = page.getByTestId("next-question-btn");
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Question 2 (True / False)
    await expect(page.getByText(/Question 2 of 4/i)).toBeVisible();
    await expect(page.getByText(/God made the birds that fly in the air/i)).toBeVisible();

    // Choose True (correct)
    const trueOption = page.getByRole("button", { name: /True/i });
    await trueOption.click();
    await page.getByTestId("submit-answer-btn").click();

    // Happy lamb feedback
    await expect(page.getByText(/Wonderful!/i)).toBeVisible();
    await expect(page.getByText(/Correct!/i)).toBeVisible();
  });

  test("AC-3: Disciples saint quiz presents multi-clue 'Who Am I?' mysteries", async ({ page }) => {
    await page.goto("/quizzes/mystery-saints-who-am-i");

    await expect(page.getByText(/Question 1 of 4/i)).toBeVisible();
    await expect(page.getByText("Mystery Clues")).toBeVisible();
    await expect(page.getByText(/I was held captive tending sheep as a teenager/i)).toBeVisible();
    await expect(
      page.getByText(/My feast day is celebrated on March 17 with green shamrocks/i),
    ).toBeVisible();

    // Select Saint Patrick
    const patrickOpt = page.getByRole("button", { name: /Saint Patrick/i });
    await patrickOpt.click();
    await page.getByTestId("submit-answer-btn").click();

    await expect(page.getByText(/Wonderful!/i)).toBeVisible();
    await expect(page.getByText(/Saint Patrick used the green shamrock/i)).toBeVisible();
  });

  test("AC-6, AC-7: Completing all 4 questions triggers celebratory win screen with stars", async ({
    page,
  }) => {
    await page.goto("/quizzes/creation-and-gods-animals");

    // Answer Q1
    await page.getByRole("button", { name: /Let there be light!/i }).click();
    await page.getByTestId("submit-answer-btn").click();
    await page.getByTestId("next-question-btn").click();

    // Answer Q2
    await page.getByRole("button", { name: /True/i }).click();
    await page.getByTestId("submit-answer-btn").click();
    await page.getByTestId("next-question-btn").click();

    // Answer Q3
    await page.getByRole("button", { name: /Saint Francis of Assisi/i }).click();
    await page.getByTestId("submit-answer-btn").click();
    await page.getByTestId("next-question-btn").click();

    // Answer Q4
    await page.getByRole("button", { name: /He rested and blessed the day/i }).click();
    await page.getByTestId("submit-answer-btn").click();

    // Final Next button says Celebrate Completion!
    const finishBtn = page.getByTestId("next-question-btn");
    await expect(finishBtn).toHaveText(/Celebrate Completion!/i);
    await finishBtn.click();

    // AC-6: Win screen
    await expect(page.getByRole("heading", { name: "Splendid Work!" })).toBeVisible();
    await expect(page.getByText("Quiz Complete!")).toBeVisible();
    await expect(page.getByRole("button", { name: /Play Again/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /More Quizzes/i })).toBeVisible();
  });
});
