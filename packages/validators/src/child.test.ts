import { describe, expect, it } from "vitest";
import {
  containsBlockedTerm,
  createChildSchema,
  normalizeLeetspeak,
  parentPasscodeSchema,
  updateChildSchema,
} from "./index";

describe("Catholic and Child Safe Filter (covers: AC-2)", () => {
  it("normalizes leetspeak and special symbols", () => {
    expect(normalizeLeetspeak("P0p3")).toBe("pope");
    expect(normalizeLeetspeak("S@t@n")).toBe("satan");
    expect(normalizeLeetspeak("d_3_m_0_n")).toBe("demon");
  });

  it("identifies blocked administrative titles", () => {
    expect(containsBlockedTerm("admin")).toBe(true);
    expect(containsBlockedTerm("Priest_John")).toBe(true);
    expect(containsBlockedTerm("Moderator")).toBe(true);
    expect(containsBlockedTerm("OfficialKidZone")).toBe(true);
  });

  it("identifies dark or inappropriate terms", () => {
    expect(containsBlockedTerm("Lucifer")).toBe(true);
    expect(containsBlockedTerm("DemonBoy")).toBe(true);
    expect(containsBlockedTerm("bad_word_bitch")).toBe(true);
  });

  it("approves healthy Catholic and children nicknames", () => {
    expect(containsBlockedTerm("LittleLamb")).toBe(false);
    expect(containsBlockedTerm("David_King")).toBe(false);
    expect(containsBlockedTerm("MaryGrace")).toBe(false);
    expect(containsBlockedTerm("Therese Rose")).toBe(false);
    expect(containsBlockedTerm("Sammy")).toBe(false);
    expect(containsBlockedTerm("Michelle")).toBe(false);
    expect(containsBlockedTerm("Shelley")).toBe(false);
    expect(containsBlockedTerm("Mitchell")).toBe(false);
  });
});

describe("createChildSchema (covers: AC-1, AC-2, AC-5)", () => {
  it("accepts valid child creation payload without PIN", () => {
    const valid = {
      nickname: "David",
      avatar: "lamb",
      birthDate: "2018-05-12",
    };
    const res = createChildSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("accepts valid child creation payload with 4-digit PIN", () => {
    const valid = {
      nickname: "Esther",
      avatar: "dove",
      birthDate: "2015-08-20",
      pin: "1234",
    };
    const res = createChildSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.pin).toBe("1234");
    }
  });

  it("rejects inappropriate nicknames", () => {
    const invalid = {
      nickname: "DemonBoy",
      avatar: "lion",
      birthDate: "2018-01-01",
    };
    const res = createChildSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toContain("inappropriate words");
    }
  });

  it("rejects non-4-digit PINs", () => {
    const invalid = {
      nickname: "Grace",
      avatar: "star",
      birthDate: "2017-02-14",
      pin: "123", // 3 digits
    };
    const res = createChildSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects children younger than 2 years old", () => {
    const now = new Date();
    const futureDate = `${now.getFullYear()}-12-31`;
    const res = createChildSchema.safeParse({
      nickname: "Baby",
      avatar: "bell",
      birthDate: futureDate,
    });
    expect(res.success).toBe(false);
  });

  it("rejects children older than 15 years old", () => {
    const res = createChildSchema.safeParse({
      nickname: "AdultTeen",
      avatar: "flame",
      birthDate: "2005-01-01",
    });
    expect(res.success).toBe(false);
  });

  it("validates updateChildSchema with valid fields", () => {
    const res = updateChildSchema.safeParse({
      childId: "123e4567-e89b-12d3-a456-426614174000",
      nickname: "NewGrace",
      avatar: "dove",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.nickname).toBe("NewGrace");
      expect(res.data.avatar).toBe("dove");
    }
  });
});

describe("parentPasscodeSchema (covers: AC-6, AC-7)", () => {
  it("accepts valid 4-digit passcodes", () => {
    expect(parentPasscodeSchema.safeParse("0000").success).toBe(true);
    expect(parentPasscodeSchema.safeParse("9876").success).toBe(true);
  });

  it("rejects letters, symbols, or wrong length", () => {
    expect(parentPasscodeSchema.safeParse("123").success).toBe(false);
    expect(parentPasscodeSchema.safeParse("12345").success).toBe(false);
    expect(parentPasscodeSchema.safeParse("abcd").success).toBe(false);
  });
});
