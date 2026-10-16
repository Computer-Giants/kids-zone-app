import { describe, expect, it } from "vitest";
import {
  calculateAgeBand,
  calculateExactAge,
  clearGuestProgress,
  deriveAgeBand,
  formatAgeBand,
  getGuestProgress,
  isChildGraduated,
  isGuestItemComplete,
  markGuestItemComplete,
  slugify,
  toMinorUnits,
} from "./index";

describe("utils", () => {
  it("converts to minor units", () => expect(toMinorUnits(1500.5)).toBe(150050));
  it("slugifies", () => expect(slugify("Hello, World!")).toBe("hello-world"));
});

describe("calculateAgeBand (covers: AC-3)", () => {
  const refDate = new Date("2026-10-15T00:00:00Z");

  it("calculates exact age correctly considering month and day", () => {
    // Exactly 7 years old
    expect(calculateExactAge("2019-10-15", refDate)).toBe(7);
    // 7 years and 364 days (birthday tomorrow) -> 6 years old
    expect(calculateExactAge("2019-10-16", refDate)).toBe(6);
    // 8 years old
    expect(calculateExactAge("2018-10-15", refDate)).toBe(8);
  });

  it("maps ages 2 through 7 to b3_7", () => {
    // 2 years old
    expect(calculateAgeBand("2024-05-01", refDate)).toBe("b3_7");
    // 5 years old
    expect(calculateAgeBand("2021-06-10", refDate)).toBe("b3_7");
    // Exactly 7 years old
    expect(calculateAgeBand("2019-10-15", refDate)).toBe("b3_7");
  });

  it("maps ages 8 through 10 to b8_10", () => {
    // 8 years old
    expect(calculateAgeBand("2018-10-15", refDate)).toBe("b8_10");
    // 9 years old
    expect(calculateAgeBand("2017-04-12", refDate)).toBe("b8_10");
    // Exactly 10 years old
    expect(calculateAgeBand("2016-10-15", refDate)).toBe("b8_10");
  });

  it("maps ages 11 through 15 to b11_15", () => {
    // 11 years old
    expect(calculateAgeBand("2015-10-15", refDate)).toBe("b11_15");
    // 13 years old
    expect(calculateAgeBand("2013-01-20", refDate)).toBe("b11_15");
    // 15 years old
    expect(calculateAgeBand("2011-10-15", refDate)).toBe("b11_15");
  });

  it("identifies graduated teenagers at 16+", () => {
    // 15 years old -> not graduated
    expect(isChildGraduated("2011-10-15", refDate)).toBe(false);
    // 16 years old -> graduated
    expect(isChildGraduated("2010-10-15", refDate)).toBe(true);
    // 18 years old -> graduated
    expect(isChildGraduated("2008-01-01", refDate)).toBe(true);
  });

  it("formats age band labels nicely", () => {
    expect(formatAgeBand("b3_7")).toBe("Ages 3 to 7");
    expect(formatAgeBand("b8_10")).toBe("Ages 8 to 10");
    expect(formatAgeBand("b11_15")).toBe("Ages 11 to 15");
  });

  it("exports deriveAgeBand identical to calculateAgeBand", () => {
    expect(deriveAgeBand("2021-06-10", refDate)).toBe("b3_7");
  });
});

describe("guest progress storage helpers", () => {
  function createMockStorage(): Storage {
    const map = new Map<string, string>();
    return {
      getItem: (key: string) => map.get(key) ?? null,
      setItem: (key: string, value: string) => {
        map.set(key, value);
      },
      removeItem: (key: string) => {
        map.delete(key);
      },
      clear: () => {
        map.clear();
      },
      key: (i: number) => Array.from(map.keys())[i] ?? null,
      get length() {
        return map.size;
      },
    };
  }

  it("reads empty progress map initially", () => {
    const storage = createMockStorage();
    expect(getGuestProgress(storage)).toEqual({});
    expect(isGuestItemComplete("story-creation", storage)).toBe(false);
  });

  it("records item completion and retains on device", () => {
    const storage = createMockStorage();
    markGuestItemComplete("story-creation", storage);
    expect(isGuestItemComplete("story-creation", storage)).toBe(true);
    expect(isGuestItemComplete("story-noah", storage)).toBe(false);

    const progress = getGuestProgress(storage);
    expect(progress["story-creation"]).toBeDefined();
    expect(typeof progress["story-creation"]?.completedAt).toBe("string");
  });

  it("clears guest progress correctly", () => {
    const storage = createMockStorage();
    markGuestItemComplete("story-creation", storage);
    clearGuestProgress(storage);
    expect(isGuestItemComplete("story-creation", storage)).toBe(false);
  });
});
