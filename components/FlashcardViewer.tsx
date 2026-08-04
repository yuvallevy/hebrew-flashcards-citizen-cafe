"use client";

import { useEffect, useState } from "react";
import type { FlashcardLevel, FlashcardPack, FlashcardPair } from "@prisma/client";
import { LEVEL_COLORS, TIERS, shuffle, titleCase } from "@/lib/flashcards";
import { Select } from "@/components/Select";

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
    return (
      <p className="p-8 text-ink-muted">No flashcard packs found. Did you run the seed script?</p>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-surface-base p-8">
      <h1 className="font-brand text-3xl text-ink">Hebrew Flashcards</h1>

      <div className="flex flex-wrap justify-center gap-4">
        <Select
          value={selection.tier}
          onChange={selectTier}
          placeholder="Select a tier"
          options={TIERS.map((t) => ({ value: t.name, label: t.name }))}
        />

        {tier && (
          <Select
            value={selection.level}
            onChange={selectLevel}
            placeholder="Select a level"
            options={tier.levels.map((level) => ({
              value: level,
              label: titleCase(level),
              color: LEVEL_COLORS[level],
            }))}
          />
        )}

        {needsType && (
          <Select
            value={selection.type_}
            onChange={selectType}
            placeholder="Select a type"
            options={levelPacks.map((pack) => ({
              value: pack.type ?? 0,
              label: `Type ${pack.type}`,
            }))}
          />
        )}
      </div>

      {currentPair && (
        <button
          className="flex h-48 w-80 flex-col items-center justify-center gap-2 rounded-md rounded-br-signature border border-border-subtle bg-surface-raised text-center text-2xl transition hover:border-ink-muted hover:-translate-y-0.5"
          onClick={() => setRevealed((r) => !r)}
        >
          <div className="font-brand" lang="he" dir="rtl">
            {currentPair.hebrew}
          </div>
          {revealed && <div className="text-lg text-ink-muted">{currentPair.english}</div>}
        </button>
      )}

      {selectedPack && (
        <>
          <p className="text-sm text-ink-muted">
            {shuffledPairs.length === 0
              ? "No cards in this pack."
              : `${currentIndex + 1} / ${shuffledPairs.length}`}
          </p>

          <div className="flex gap-4">
            <button
              className="rounded-md border border-border-subtle px-4 py-2 font-medium text-ink transition hover:border-ink-muted"
              onClick={reshuffle}
            >
              Shuffle
            </button>
            <button
              className="rounded-md bg-brand-yellow px-4 py-2 font-medium text-brand-charcoal transition hover:brightness-95"
              onClick={next}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
