import { describe, expect, it } from "vitest";
import { app } from "../app";

describe("Saints API routes", () => {
  it("GET /api/saints/today returns saint of the day for date", async () => {
    // Oct 4 is St. Francis of Assisi feast day
    const res = await app.request("/api/saints/today?date=2026-10-04");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.saint).toBeDefined();
    expect(data.saint.name).toBe("Francis of Assisi");
    expect(data.saint.feastMonth).toBe(10);
    expect(data.saint.feastDay).toBe(4);
    expect(data.funFacts.length).toBeGreaterThan(0);
  });

  it("GET /api/saints/random returns a published saint", async () => {
    const res = await app.request("/api/saints/random");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.saint).toBeDefined();
    expect(data.saint.slug).toBeDefined();
    expect(data.saint.name).toBeDefined();
  });

  it("GET /api/saints lists all saints and supports patronage filtering", async () => {
    const resAll = await app.request("/api/saints");
    expect(resAll.status).toBe(200);
    const dataAll = await resAll.json();
    expect(dataAll.saints.length).toBeGreaterThanOrEqual(7);
    expect(dataAll.total).toBeGreaterThanOrEqual(7);
    expect(dataAll.patronages.length).toBeGreaterThan(0);

    const resAnimals = await app.request("/api/saints?patronage=animals");
    expect(resAnimals.status).toBe(200);
    const dataAnimals = await resAnimals.json();
    expect(dataAnimals.saints.length).toBeGreaterThanOrEqual(1);
    expect(dataAnimals.saints.some((s: { slug: string }) => s.slug === "francis-of-assisi")).toBe(
      true,
    );
  });

  it("GET /api/saints/:slug returns full details for valid slug and 404 for unknown", async () => {
    const res = await app.request("/api/saints/therese-of-lisieux");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.saint.name).toBe("Thérèse of Lisieux");
    expect(data.story).not.toBeNull();
    expect(data.story.title).toBe("The Little Flower's Secret of Love");
    expect(data.funFacts.length).toBeGreaterThanOrEqual(3);
    expect(data.places.length).toBeGreaterThanOrEqual(1);

    const notFound = await app.request("/api/saints/non-existent-saint");
    expect(notFound.status).toBe(404);
  });

  it("POST /api/saints/readings/complete records guest progress without server storage", async () => {
    const res = await app.request("/api/saints/readings/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId: "francis-of-assisi",
        idempotencyKey: "11111111-1111-4000-8000-000000000001",
        entityType: "saint",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(true);
    expect(data.starsAwarded).toBe(0);
  });
});
