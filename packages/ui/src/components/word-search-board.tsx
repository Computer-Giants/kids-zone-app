"use client";

import * as React from "react";
import { Check, HelpCircle, RotateCcw } from "lucide-react";
import { cn } from "../lib/utils";

export interface WordSearchWordData {
  word: string;
  hint: string;
  start: [number, number];
  end: [number, number];
}

export interface WordSearchConfigData {
  grid: string[][];
  words: WordSearchWordData[];
}

export interface WordSearchBoardProps {
  config: WordSearchConfigData;
  onComplete: () => void;
  className?: string;
}

interface Coordinate {
  row: number;
  col: number;
}

export function WordSearchBoard({ config, onComplete, className }: WordSearchBoardProps) {
  const { grid, words } = config;

  const [foundWords, setFoundWords] = React.useState<string[]>([]);
  const [selectedStart, setSelectedStart] = React.useState<Coordinate | null>(null);
  const [selectedEnd, setSelectedEnd] = React.useState<Coordinate | null>(null);
  const [hintedCoord, setHintedCoord] = React.useState<Coordinate | null>(null);

  // Compute all cells that are part of already-found words
  const foundCells = React.useMemo(() => {
    const cells = new Set<string>();

    for (const wordObj of words) {
      if (foundWords.includes(wordObj.word)) {
        const [startRow, startCol] = wordObj.start;
        const [endRow, endCol] = wordObj.end;

        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);
        const length = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol)) + 1;

        for (let i = 0; i < length; i++) {
          cells.add(`${startRow + i * rowStep},${startCol + i * colStep}`);
        }
      }
    }

    return cells;
  }, [foundWords, words]);

  // Compute cells currently selected between selectedStart and selectedEnd
  const activeSelectionCells = React.useMemo(() => {
    if (!selectedStart) return new Set<string>();
    if (!selectedEnd) return new Set<string>([`${selectedStart.row},${selectedStart.col}`]);

    const cells = new Set<string>();
    const rowDiff = selectedEnd.row - selectedStart.row;
    const colDiff = selectedEnd.col - selectedStart.col;

    // Check if horizontal, vertical, or 45-degree diagonal
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);

    if (isHorizontal || isVertical || isDiagonal) {
      const rowStep = Math.sign(rowDiff);
      const colStep = Math.sign(colDiff);
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

      for (let i = 0; i < steps; i++) {
        cells.add(`${selectedStart.row + i * rowStep},${selectedStart.col + i * colStep}`);
      }
    } else {
      cells.add(`${selectedStart.row},${selectedStart.col}`);
      cells.add(`${selectedEnd.row},${selectedEnd.col}`);
    }

    return cells;
  }, [selectedStart, selectedEnd]);

  // Handle cell tap
  const handleCellClick = (row: number, col: number) => {
    setHintedCoord(null);

    if (!selectedStart) {
      setSelectedStart({ row, col });
      setSelectedEnd(null);
      return;
    }

    // Second tap establishes the word path
    const start = selectedStart;
    const end = { row, col };

    // Check if this matches any target word
    const matchedWord = checkWordMatch(start, end, words, grid);

    if (matchedWord && !foundWords.includes(matchedWord)) {
      const updated = [...foundWords, matchedWord];
      setFoundWords(updated);
      setSelectedStart(null);
      setSelectedEnd(null);

      if (updated.length === words.length) {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    } else {
      // Toggle or reset selection
      if (start.row === row && start.col === col) {
        setSelectedStart(null);
        setSelectedEnd(null);
      } else {
        setSelectedStart({ row, col });
        setSelectedEnd(null);
      }
    }
  };

  // AC-6: Gentle Lamb Hint (illuminates the start coordinate of an unfound word)
  const handleAskHint = () => {
    const unfound = words.filter((w: WordSearchWordData) => !foundWords.includes(w.word));
    if (unfound.length > 0) {
      const target = unfound[0]!;
      setHintedCoord({ row: target.start[0], col: target.start[1] });

      setTimeout(() => {
        setHintedCoord(null);
      }, 2500);
    }
  };

  const handleReset = () => {
    setFoundWords([]);
    setSelectedStart(null);
    setSelectedEnd(null);
    setHintedCoord(null);
  };

  const allFound = foundWords.length === words.length && words.length > 0;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Top Controls */}
      <div className="flex w-full max-w-md items-center justify-between gap-3 px-2">
        <div className="bg-sand border-sand-border font-heading text-ink-soft rounded-full border px-4 py-1.5 text-xs font-bold sm:text-sm">
          Words found: <span className="text-ink font-extrabold">{foundWords.length}</span> /{" "}
          {words.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAskHint}
            disabled={allFound}
            className="bg-yellow-tint border-yellow-deep text-yellow-deep font-heading hover:bg-yellow-tint/80 focus-accessible shadow-sticker-yellow inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border px-3.5 py-1.5 text-xs font-black transition-all active:scale-95 disabled:opacity-50"
            aria-label="Ask the Lamb for a hint"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Lamb for</span> Hint
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-sand border-sand-border text-ink-soft hover:text-ink focus-accessible inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
            aria-label="Restart word search"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Word Bank */}
      <div className="border-sand-border bg-sand/60 flex w-full max-w-md flex-wrap items-center justify-center gap-2 rounded-2xl border p-3">
        <span className="font-heading text-ink-soft text-xs font-extrabold uppercase tracking-wide">
          Word Bank:
        </span>
        {words.map((w: WordSearchWordData) => {
          const isDone = foundWords.includes(w.word);
          return (
            <span
              key={w.word}
              className={cn(
                "font-heading inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all",
                isDone
                  ? "bg-green-tint text-green-deep border-green border line-through"
                  : "text-ink border-sand-border border bg-white",
              )}
            >
              {isDone && <Check className="h-3 w-3 stroke-[3]" />}
              <span>{w.word}</span>
            </span>
          );
        })}
      </div>

      {/* Grid of Letters */}
      <div
        className="border-sand-border shadow-card-rest inline-block rounded-3xl border-2 bg-white p-3 sm:p-4"
        role="grid"
        aria-label="Word search letter grid"
      >
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {grid.map((rowArr: string[], rowIndex: number) => (
            <div key={`row-${rowIndex}`} className="flex gap-1 sm:gap-1.5" role="row">
              {rowArr.map((letter: string, colIndex: number) => {
                const cellKey = `${rowIndex},${colIndex}`;
                const isFound = foundCells.has(cellKey);
                const isSelected = activeSelectionCells.has(cellKey);
                const isHint = hintedCoord?.row === rowIndex && hintedCoord?.col === colIndex;

                return (
                  <button
                    key={`cell-${cellKey}`}
                    type="button"
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={cn(
                      "font-heading focus-accessible flex h-10 w-10 select-none items-center justify-center rounded-xl text-base font-black transition-all active:scale-95 sm:h-11 sm:w-11 sm:text-lg",
                      // Found word cell
                      isFound && "bg-green-tint text-green-deep scale-[0.98] font-black",
                      // Selected cell
                      !isFound && isSelected && "bg-blue shadow-sticker-blue scale-105 text-white",
                      // Hint cell
                      !isFound &&
                        !isSelected &&
                        isHint &&
                        "bg-yellow-tint text-yellow-deep animate-bounce ring-2 ring-yellow-400 ring-offset-2",
                      // Normal idle cell
                      !isFound && !isSelected && !isHint && "bg-sand/40 text-ink hover:bg-sand",
                    )}
                    aria-label={`Letter ${letter} at row ${rowIndex + 1}, column ${colIndex + 1}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="font-body text-ink-soft text-center text-xs font-medium">
        Tip: Tap the first letter of a word, then tap the last letter to find it!
      </p>
    </div>
  );
}

// Check if selected start and end match any word in configuration
function checkWordMatch(
  start: Coordinate,
  end: Coordinate,
  words: WordSearchWordData[],
  grid: string[][],
): string | null {
  for (const w of words) {
    const [wStartRow, wStartCol] = w.start;
    const [wEndRow, wEndCol] = w.end;

    // Check forward match
    if (
      start.row === wStartRow &&
      start.col === wStartCol &&
      end.row === wEndRow &&
      end.col === wEndCol
    ) {
      return w.word;
    }

    // Check reverse match (child tapped last letter then first letter)
    if (
      start.row === wEndRow &&
      start.col === wEndCol &&
      end.row === wStartRow &&
      end.col === wStartCol
    ) {
      return w.word;
    }
  }

  return null;
}
