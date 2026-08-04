import { prisma } from "@/lib/prisma";
import { FlashcardViewer } from "@/components/FlashcardViewer";

export default async function Home() {
  const packs = await prisma.flashcardPack.findMany({
    include: { pairs: true },
    orderBy: { id: "asc" },
  });

  return <FlashcardViewer packs={packs} />;
}
