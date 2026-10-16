/**
 * Catholic and Child Safe Nickname Filter
 * Enforces appropriate naming for child profiles visible on leaderboards and group views.
 * Evaluates terms in memory without external third party API calls.
 */

const BLOCKED_TERMS = new Set([
  // Reserved administrative & staff titles
  "admin",
  "administrator",
  "moderator",
  "mod",
  "system",
  "support",
  "staff",
  "priest",
  "bishop",
  "pope",
  "cardinal",
  "pastor",
  "kidzone",
  "official",

  // Inappropriate, demonic & dark references
  "satan",
  "devil",
  "lucifer",
  "demon",
  "beelzebub",
  "hell",
  "witch",
  "antichrist",

  // Vulgarities, profanities & crude slurs
  "fuck",
  "shit",
  "bitch",
  "ass",
  "asshole",
  "bastard",
  "damn",
  "crap",
  "dick",
  "pussy",
  "cock",
  "slut",
  "whore",
  "fag",
  "nigger",
  "nigga",
  "cunt",
  "twat",
  "wank",
  "nude",
  "porn",
  "sex",
  "sexy",
  "kill",
  "die",
  "hate",
]);

// Terms that should only match as whole words/tokens, not arbitrary substrings
const TOKEN_ONLY_TERMS = new Set([
  "hell",
  "pope",
  "pastor",
  "admin",
  "mod",
  "staff",
  "system",
  "die",
  "hate",
  "kill",
  "damn",
  "crap",
]);

// Known Catholic and family names that contain substrings resembling blocked words
const SAFE_NICKNAMES = new Set([
  "michelle",
  "mitchell",
  "shelley",
  "hellen",
  "helena",
  "cassandra",
]);

/**
 * Normalizes text to detect obfuscated or leetspeak words.
 * Example: "P0p3" -> "pope", "S@t@n" -> "satan"
 */
export function normalizeLeetspeak(input: string): string {
  return input
    .toLowerCase()
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/!/g, "i")
    .replace(/3/g, "e")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Checks whether a nickname contains blocked, reserved, or inappropriate terms.
 */
export function containsBlockedTerm(nickname: string): boolean {
  if (!nickname) {
    return false;
  }

  const normalized = normalizeLeetspeak(nickname);

  // Exact allowlist match for recognized traditional names
  if (SAFE_NICKNAMES.has(normalized)) {
    return false;
  }

  // Exact match check on normalized string
  if (BLOCKED_TERMS.has(normalized)) {
    return true;
  }

  // Split into tokens handling camelCase ("DemonBoy" -> "Demon Boy"), underscores, and hyphens
  const splitWords = nickname
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[\s_-]+/);

  for (const word of splitWords) {
    const cleanWord = normalizeLeetspeak(word);
    if (BLOCKED_TERMS.has(cleanWord)) {
      return true;
    }
  }

  // Substring check only for severe terms (excluding token-only terms like "hell")
  for (const term of BLOCKED_TERMS) {
    if (term.length >= 4 && !TOKEN_ONLY_TERMS.has(term) && normalized.includes(term)) {
      return true;
    }
  }

  return false;
}
