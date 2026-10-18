import { describe, expect, it } from "vitest";
import app from "../app";

describe("Church Tour API Routes", () => {
  it("GET /api/church-tour/scenes returns all 5 scenes with item counts", async () => {
    const res = await app.request("/api/church-tour/scenes");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.totalScenes).toBe(5);
    expect(data.scenes).toHaveLength(5);
    expect(data.totalItemCount).toBe(14);
    expect(data.scenes[0].slug).toBe("narthex");
    expect(data.scenes[4].slug).toBe("sacristy");
  });

  it("GET /api/church-tour/scenes/:slug returns scene detail with items and adjacent navigation", async () => {
    const res = await app.request("/api/church-tour/scenes/altar");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.scene).toBeDefined();
    expect(data.scene.slug).toBe("altar");
    expect(data.scene.title).toBe("The High Altar & Tabernacle");
    expect(data.scene.previousSceneSlug).toBe("sanctuary");
    expect(data.scene.nextSceneSlug).toBe("sacristy");
    expect(data.scene.items).toHaveLength(3);

    const tabernacle = data.scene.items.find(
      (i: { title: string }) => i.title === "The Tabernacle",
    );
    expect(tabernacle).toBeDefined();
    expect(tabernacle.xPercent).toBe(50);
    expect(tabernacle.yPercent).toBe(28);
    expect(tabernacle.reverenceNote).toContain("genuflection");
    expect(tabernacle.glossaryTerm).toEqual({
      slug: "tabernacle",
      term: "The Tabernacle",
    });
  });

  it("GET /api/church-tour/scenes/:slug returns 404 for nonexistent scene", async () => {
    const res = await app.request("/api/church-tour/scenes/crypt");
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Scene not found");
  });

  it("POST /api/church-tour/complete handles unauthenticated guest learner without errors", async () => {
    const res = await app.request("/api/church-tour/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idempotencyKey: "12345678-1234-4234-8234-123456789012",
        completedItemIds: ["item-0001-01", "item-0001-02"],
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(true);
    expect(data.starsAwarded).toBe(0);
  });

  it("POST /api/church-tour/complete awards 5 stars to authenticated child", async () => {
    const res = await app.request("/api/church-tour/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
        idempotencyKey: "99999999-8888-4777-8666-555555555555",
        completedItemIds: ["item-0001-01", "item-0004-02"],
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.guest).toBe(false);
    expect(data.starsAwarded).toBe(5);
  });
});
