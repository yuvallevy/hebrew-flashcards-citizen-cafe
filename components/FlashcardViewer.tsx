"use client";

import { useEffect, useState } from "react";
import type { FlashcardLevel, FlashcardPack, FlashcardPair } from "@prisma/client";
import { TIERS, shuffle, titleCase } from "@/lib/flashcards";

type PackWithPairs = FlashcardPack & { pairs: FlashcardPair[] };

type Selection = {
  tier: string | null;
  level: FlashcardLevel | null;
  type_: number | null;  // Not bare "type" to avoid conflicts with the reserved keyword "type" in TypeScript
};

export function FlashcardViewer({ packs }: { packs: PackWithPairs[] }) {
  const [selection, setSelection] = useState<Selection>({
    tier: null,
    level: null,
    type_: null,
  });
  const [shuffledPairs, setShuffledPairs] = useState<FlashcardPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const tier = selection.tier ? (TIERS.find((t) => t.name === selection.tier) ?? null) : null;
  const levelPacks = selection.level ? packs.filter((p) => p.level === selection.level) : [];
  const needsType = levelPacks.length > 1;
  const selectedPack = needsType
    ? (levelPacks.find((p) => p.type === selection.type_) ?? null)
    : (levelPacks[0] ?? null);

  // Shuffling here (rather than during render) keeps the server-rendered
  // and initial client-rendered HTML identical, avoiding a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Math.random() can't run during render without breaking SSR determinism.
    setShuffledPairs(selectedPack ? shuffle(selectedPack.pairs) : []);
  }, [selectedPack]);

  const currentPair = shuffledPairs[currentIndex] ?? null;

  function selectTier(name: string) {
    setSelection({ tier: name, level: null, type_: null });
    setCurrentIndex(0);
    setRevealed(false);
  }

  function selectLevel(level: FlashcardLevel) {
    setSelection((s) => ({ ...s, level, type_: null }));
    setCurrentIndex(0);
    setRevealed(false);
  }

  function selectType(type: number) {
    setSelection((s) => ({ ...s, type_: type }));
    setCurrentIndex(0);
    setRevealed(false);
  }

  function reshuffle() {
    setShuffledPairs(selectedPack ? shuffle(selectedPack.pairs) : []);
    setCurrentIndex(0);
    setRevealed(false);
  }

  function next() {
    if (shuffledPairs.length === 0) return;
    setCurrentIndex((i) => (i + 1) % shuffledPairs.length);
    setRevealed(false);
  }

  if (packs.length === 0) {
    return <p className="p-8">No flashcard packs found. Did you run the seed script?</p>;
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-8">
      <div className="flex gap-4">
        <select
          className="rounded border px-3 py-2"
          value={selection.tier ?? ""}
          onChange={(e) => selectTier(e.target.value)}
        >
          <option value="" disabled>
            Select a tier
          </option>
          {TIERS.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        {tier && (
          <select
            className="rounded border px-3 py-2"
            value={selection.level ?? ""}
            onChange={(e) => selectLevel(e.target.value as FlashcardLevel)}
          >
            <option value="" disabled>
              Select a level
            </option>
            {tier.levels.map((level) => (
              <option key={level} value={level}>
                {titleCase(level)}
              </option>
            ))}
          </select>
        )}

        {needsType && (
          <select
            className="rounded border px-3 py-2"
            value={selection.type_ ?? ""}
            onChange={(e) => selectType(Number(e.target.value))}
          >
            <option value="" disabled>
              Select a type
            </option>
            {levelPacks.map((pack) => (
              <option key={pack.type} value={pack.type ?? ""}>
                Type {pack.type}
              </option>
            ))}
          </select>
        )}
      </div>

      {currentPair && (
        <button
          className="flex h-48 w-80 flex-col items-center justify-center gap-2 rounded-lg border text-center text-2xl"
          onClick={() => setRevealed((r) => !r)}
        >
          <div lang="he" dir="rtl">{currentPair.hebrew}</div>
          {revealed && <div className="text-lg text-zinc-500">{currentPair.english}</div>}
        </button>
      )}

      {selectedPack && (
        <>
          <p className="text-sm text-zinc-500">
            {shuffledPairs.length === 0
              ? "No cards in this pack."
              : `${currentIndex + 1} / ${shuffledPairs.length}`}
          </p>

          <div className="flex gap-4">
            <button className="rounded border px-4 py-2" onClick={reshuffle}>
              Shuffle
            </button>
            <button className="rounded border px-4 py-2" onClick={next}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
