export type Role = "parent" | "contributor" | "reviewer" | "moderator" | "admin";

export const ROLES: readonly Role[] = [
  "parent",
  "contributor",
  "reviewer",
  "moderator",
  "admin",
] as const;

/**
 * True when `role` is an admin (admin always passes) or matches `allowed`.
 * `allowed` can be a single Role or an array of Roles.
 */
export const hasRole = (role: Role | undefined, allowed: Role | readonly Role[]): boolean => {
  if (!role) return false;
  if (role === "admin") return true;
  if (Array.isArray(allowed)) {
    return allowed.includes(role);
  }
  return role === allowed;
};
