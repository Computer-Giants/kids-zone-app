import { describe, expect, it } from "vitest";
import {
  getChurchTourSceneBySlug,
  getChurchTourScenes,
  getTotalChurchTourItemCount,
  SEED_CHURCH_TOUR_SCENES,
} from "./church-tour";

describe("Catholic Church Tour Interactive Scenes", () => {
  it("provides exactly 5 distinct illustrated scenes in logical walking order", () => {
    const scenes = getChurchTourScenes();
    expect(scenes).toHaveLength(5);
    expect(scenes.map((s) => s.slug)).toEqual([
      "narthex",
      "nave",
      "sanctuary",
      "altar",
      "sacristy",
    ]);
  });

  it("verifies order indexes are strictly sequential from 0 to 4", () => {
    const scenes = getChurchTourScenes();
    scenes.forEach((scene, index) => {
      expect(scene.orderIndex).toBe(index);
    });
  });

  it("ensures every hotspot has percentage coordinates between 0 and 100", () => {
    for (const scene of SEED_CHURCH_TOUR_SCENES) {
      for (const item of scene.items) {
        expect(item.xPercent).toBeGreaterThanOrEqual(0);
        expect(item.xPercent).toBeLessThanOrEqual(100);
        expect(item.yPercent).toBeGreaterThanOrEqual(0);
        expect(item.yPercent).toBeLessThanOrEqual(100);
      }
    }
  });

  it("ensures every sacred item provides 3 age band explanations and a Catholic reverence note", () => {
    for (const scene of SEED_CHURCH_TOUR_SCENES) {
      for (const item of scene.items) {
        expect(item.title.trim().length).toBeGreaterThan(0);
        expect(item.illustrationSvgKey.trim().length).toBeGreaterThan(0);
        expect(item.reverenceNote.trim().length).toBeGreaterThan(10);
        expect(item.simplifiedTextBand3_7.trim().length).toBeGreaterThan(10);
        expect(item.simplifiedTextBand8_10.trim().length).toBeGreaterThan(10);
        expect(item.simplifiedTextBand11_15.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it("finds scenes by slug case-insensitively and returns undefined for unknown slugs", () => {
    const altar = getChurchTourSceneBySlug("ALTAR");
    expect(altar).toBeDefined();
    expect(altar?.title).toBe("The High Altar & Tabernacle");

    const unknown = getChurchTourSceneBySlug("belfry");
    expect(unknown).toBeUndefined();
  });

  it("computes total items across all 5 scenes accurately", () => {
    const count = getTotalChurchTourItemCount();
    expect(count).toBe(14);
  });
});
