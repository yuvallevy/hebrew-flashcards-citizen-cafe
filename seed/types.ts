import type { FlashcardLevel } from "@prisma/client";

type FlashcardType = 1 | 2 | 3 | 4 | 5 | 6;

type FlashcardPair = {
  hebrew: string;
  english: string;
};

export type FlashcardPack = {
  level: FlashcardLevel;
  type: FlashcardType | null;
  pairs: FlashcardPair[];
};
