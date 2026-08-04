// Seed script for the flashcard database, used to populate a test database with initial data.
// This is a one-off script with a separate entry point, not connected to the main application.

import { PrismaClient } from "@prisma/client";
import { flashcardPacks } from "./data";

const prisma = new PrismaClient();

async function main() {
  // We're going to overwrite all old data - anything already in the DB can be considered stale
  console.log('Deleting all old flashcard packs...');
  await prisma.flashcardPack.deleteMany();
  console.log('Deleted all old flashcard packs');

  // Now we can seed the database with the new data
  console.log('Seeding new flashcard packs...');
  for (const pack of flashcardPacks) {
    await prisma.flashcardPack.create({
      data: {
        level: pack.level,
        type: pack.type,
        pairs: { create: pack.pairs },
      },
    });
    console.log(
      `Seeded flashcard pack: ${pack.level} level` +
        (pack.type !== null ? `, type ${pack.type}` : '')
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
