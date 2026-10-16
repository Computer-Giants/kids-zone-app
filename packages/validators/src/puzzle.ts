import { z } from "zod";

// ============================================================================
// 1. Word Search Schema
// ============================================================================

export const wordSearchWordSchema = z.object({
  word: z.string().min(2),
  hint: z.string().min(1),
  start: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  end: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
});
export type WordSearchWord = z.infer<typeof wordSearchWordSchema>;

export const wordSearchConfigSchema = z.object({
  grid: z.array(z.array(z.string().length(1))),
  words: z.array(wordSearchWordSchema).min(1),
});
export type WordSearchConfig = z.infer<typeof wordSearchConfigSchema>;

// ============================================================================
// 2. Tile Matching Schema
// ============================================================================

export const tileMatchingPairSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  matchId: z.string().min(1),
});
export type TileMatchingPair = z.infer<typeof tileMatchingPairSchema>;

export const tileMatchingConfigSchema = z.object({
  pairs: z.array(tileMatchingPairSchema).min(2),
});
export type TileMatchingConfig = z.infer<typeof tileMatchingConfigSchema>;

// ============================================================================
// 3. Word Scramble Schema
// ============================================================================

export const wordScrambleConfigSchema = z.object({
  scrambled: z.string().min(2),
  targetWord: z.string().min(2),
  clue: z.string().min(1),
  letterBank: z.array(z.string().length(1)).min(2),
  funFact: z.string().optional(),
});
export type WordScrambleConfig = z.infer<typeof wordScrambleConfigSchema>;

// ============================================================================
// Unified Puzzle Configuration
// ============================================================================

export const puzzleCompletionSchema = z.object({
  childId: z.string().uuid().optional(),
  puzzleId: z.string().min(1),
  idempotencyKey: z.string().uuid(),
});
export type PuzzleCompletionInput = z.infer<typeof puzzleCompletionSchema>;

export const puzzleQuerySchema = z.object({
  type: z.enum(["word_search", "matching", "scramble", "fill_blank"]).optional(),
  difficulty: z.coerce.number().int().min(1).max(3).optional(),
});
export type PuzzleQuery = z.infer<typeof puzzleQuerySchema>;
