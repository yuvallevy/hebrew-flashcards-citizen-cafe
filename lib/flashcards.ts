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
