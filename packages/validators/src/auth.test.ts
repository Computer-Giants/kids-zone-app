import { describe, expect, it } from "vitest";
import { magicLinkSchema, parentSignInSchema, parentSignUpSchema } from "./index";

describe("parentSignUpSchema (covers: AC-1)", () => {
  it("accepts valid parent registration input", () => {
    const valid = {
      email: "Parent@Example.com",
      password: "securePassword1",
      fullName: "Mary Joseph",
      timezone: "America/New_York",
    };
    const res = parentSignUpSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.email).toBe("parent@example.com");
      expect(res.data.fullName).toBe("Mary Joseph");
      expect(res.data.timezone).toBe("America/New_York");
    }
  });

  it("accepts registration without full name and defaults timezone to UTC", () => {
    const minimal = {
      email: "parent@test.com",
      password: "validSecret2",
    };
    const res = parentSignUpSchema.safeParse(minimal);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.timezone).toBe("UTC");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const invalid = {
      email: "parent@test.com",
      password: "short1",
    };
    const res = parentSignUpSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects password without numbers", () => {
    const invalid = {
      email: "parent@test.com",
      password: "noNumbersHere",
    };
    const res = parentSignUpSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects invalid email address format", () => {
    const invalid = {
      email: "not-an-email",
      password: "securePassword1",
    };
    const res = parentSignUpSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("parentSignInSchema (covers: AC-3)", () => {
  it("accepts valid credentials", () => {
    const valid = {
      email: "PARENT@TEST.COM",
      password: "anyNonEmptyPassword",
    };
    const res = parentSignInSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.email).toBe("parent@test.com");
    }
  });

  it("rejects empty password", () => {
    const invalid = {
      email: "parent@test.com",
      password: "",
    };
    const res = parentSignInSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("magicLinkSchema (covers: AC-4)", () => {
  it("accepts valid email for magic link", () => {
    const valid = {
      email: "parent@example.com",
    };
    const res = magicLinkSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const invalid = {
      email: "invalid-email-address",
    };
    const res = magicLinkSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});
