/**
 * Web Crypto utilities for 4-digit PINs and Parent Passcodes.
 * Implements PBKDF2 with 100,000 iterations of SHA-256 and constant-time comparison.
 */

export async function hashPin(pin: string, salt = "kidzone-child-pin-salt-v1"): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin.trim()),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashParentPasscode(passcode: string): Promise<string> {
  return hashPin(passcode, "kidzone-parent-passcode-salt-v1");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyPasscode(entered: string, storedHash: string): Promise<boolean> {
  const hash = await hashParentPasscode(entered);
  return timingSafeEqual(hash, storedHash);
}

export async function verifyChildPin(entered: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(entered);
  return timingSafeEqual(hash, storedHash);
}
