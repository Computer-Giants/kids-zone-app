import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Quizzes API routes", () => {
  it("GET /api/quizzes returns curated quizzes with category filter", async () => {
    const res = await app.request("/api/quizzes");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.quizzes.length).toBeGreaterThanOrEqual(4);
    expect(data.total).toBeGreaterThanOrEqual(4);

    const resBible = await app.request("/api/quizzes?category=bible");
    expect(resBible.status).toBe(200);
    const dataBible = await resBible.json();
    expect(dataBible.quizzes.length).toBeGreaterThanOrEqual(1);
    expect(dataBible.quizzes[0].category).toBe("bible");
  });

  it("GET /api/quizzes/:slug returns 4 questions with stripped isCorrect on options", async () => {
    const res = await app.request("/api/quizzes/creation-and-gods-animals");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.quiz.title).toBe("Creation & God's Beautiful World");
    expect(data.questions).toHaveLength(4);

    // Ensure isCorrect is not leaked to client in options
    for (const q of data.questions) {
      for (const opt of q.options) {
        expect(opt.isCorrect).toBeUndefined();
      }
    }
  });

  it("POST /api/quizzes/:slug/answer returns isCorrect=true and lambMood=happy on correct option", async () => {
    const res = await app.request("/api/quizzes/creation-and-gods-animals/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: "qq1a0001-0001-4000-8000-000000000001",
        optionId: "opt-1-1",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isCorrect).toBe(true);
    expect(data.lambMood).toBe("happy");
    expect(data.explanation).toContain("Let there be light");
  });

  it("POST /api/quizzes/:slug/answer returns isCorrect=false and lambMood=encouraging on mistake", async () => {
    const res = await app.request("/api/quizzes/creation-and-gods-animals/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: "qq1a0001-0001-4000-8000-000000000001",
        optionId: "opt-1-2",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isCorrect).toBe(false);
    expect(data.lambMood).toBe("encouraging");
    expect(data.explanation).toContain("Let there be light");
  });

  it("POST /api/quizzes/complete records guest progress safely without server storage", async () => {
    const res = await app.request("/api/quizzes/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: "creation-and-gods-animals",
        idempotencyKey: "22222222-2222-4000-8000-000000000002",
        score: 100,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(true);
    expect(data.starsAwarded).toBe(0);
  });
});
