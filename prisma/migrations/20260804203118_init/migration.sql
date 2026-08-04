-- CreateEnum
CREATE TYPE "FlashcardLevel" AS ENUM ('Red', 'Orange', 'Pink', 'Yellow', 'LightBlue', 'Blue', 'Lime', 'Green', 'DarkGreen', 'Turquoise', 'Indigo', 'Purple');

-- CreateTable
CREATE TABLE "FlashcardPack" (
    "id" SERIAL NOT NULL,
    "level" "FlashcardLevel" NOT NULL,
    "type" INTEGER,

    CONSTRAINT "FlashcardPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashcardPair" (
    "id" SERIAL NOT NULL,
    "hebrew" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "packId" INTEGER NOT NULL,

    CONSTRAINT "FlashcardPair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlashcardPack_level_type_key" ON "FlashcardPack"("level", "type");

-- AddForeignKey
ALTER TABLE "FlashcardPair" ADD CONSTRAINT "FlashcardPair_packId_fkey" FOREIGN KEY ("packId") REFERENCES "FlashcardPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
