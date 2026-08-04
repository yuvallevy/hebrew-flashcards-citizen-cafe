"use client";

import { useEffect, useRef, useState } from "react";

type Option<T extends string | number> = {
  value: T;
  label: string;
  color?: string;
};

export function Select<T extends string | number>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: T | null;
  onChange: (value: T) => void;
  options: Option<T>[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openList() {
    const currentIndex = options.findIndex((o) => o.value === value);
    setActiveIndex(Math.max(0, currentIndex));
    setOpen(true);
  }

  function select(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex min-w-40 cursor-pointer items-center justify-between gap-2 rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-left text-ink transition hover:border-ink-muted"
        onClick={() => (open ? setOpen(false) : openList())}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {selected?.color && (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: selected.color }}
            />
          )}
          <span className={selected ? "" : "text-ink-muted"}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <span aria-hidden className="text-ink-muted">
          ▾
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-10 mt-1 max-h-64 w-full min-w-40 overflow-auto rounded-md border border-border-subtle bg-surface-raised py-1 shadow-lg outline-none"
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 ${
                index === activeIndex ? "bg-surface-base" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(index)}
            >
              {option.color && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
