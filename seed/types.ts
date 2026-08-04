import type { FlashcardLevel, Prisma } from "@prisma/client";

export type FlashcardPack = {
  level: FlashcardLevel;
  type: number | null;
  pairs: Prisma.FlashcardPairCreateManyPackInput[];
};
