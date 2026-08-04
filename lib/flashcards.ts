import type { FlashcardLevel } from "@prisma/client";

/**
 * Defines the three tiers of flashcards and their associated levels.
 * Each tier has a name and an array of levels, which are strings representing the difficulty or stage of the flashcards.
 */
export const TIERS: { name: string; levels: FlashcardLevel[] }[] = [
  { name: "Foundations", levels: ["Red", "Orange", "Pink", "Yellow"] },
  { name: "Flow", levels: ["LightBlue", "Blue", "Lime", "Green"] },
  { name: "Freedom", levels: ["DarkGreen", "Turquoise", "Indigo", "Purple"] },
];

/**
 * Swatch color shown next to each level in the level picker.
 */
export const LEVEL_COLORS: Record<FlashcardLevel, string> = {
  Red: "rgb(239, 68, 68)",
  Orange: "rgb(249, 115, 22)",
  Pink: "rgb(236, 72, 153)",
  Yellow: "rgb(234, 179, 8)",
  LightBlue: "rgb(125, 211, 252)",
  Blue: "rgb(59, 130, 246)",
  Lime: "rgb(132, 204, 22)",
  Green: "rgb(34, 197, 94)",
  DarkGreen: "rgb(22, 101, 52)",
  Turquoise: "rgb(13, 148, 136)",
  Indigo: "rgb(99, 102, 241)",
  Purple: "rgb(168, 85, 247)",
};

/**
 * Formats a PascalCase string in Title Case.
 * Used for displaying flashcard levels in a more friendly format.
 */
export function titleCase(level: string): string {
  return level.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * Returns the given array rearranged in a random order,
 * using the Fisher-Yates shuffle algorithm.
 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
