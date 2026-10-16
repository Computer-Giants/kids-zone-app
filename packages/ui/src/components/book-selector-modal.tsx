"use client";

import * as React from "react";
import { X, Search, Sparkles, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";

export interface BookItem {
  id: number;
  code: string;
  name: string;
  testament: "old" | "new";
  isDeuterocanonical: boolean;
  chapters: number;
  section?: string;
}

export interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: readonly BookItem[];
  currentBookCode?: string;
  onSelectBook: (book: BookItem) => void;
}

type FilterTab = "all" | "old" | "deutero" | "new";

export function BookSelectorModal({
  isOpen,
  onClose,
  books,
  currentBookCode,
  onSelectBook,
}: BookSelectorModalProps) {
  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState<FilterTab>("all");

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (tab === "old") return b.testament === "old";
    if (tab === "new") return b.testament === "new";
    if (tab === "deutero") return b.isDeuterocanonical;
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-selector-title"
      className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
    >
      <div className="border-sand-border bg-sand-light bg-cream shadow-card-hover relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border-2 p-5 sm:p-8">
        {/* Header */}
        <div className="border-sand-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-tint text-blue-deep flex h-10 w-10 items-center justify-center rounded-2xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="book-selector-title"
                className="font-heading text-ink text-xl font-black sm:text-2xl"
              >
                Catholic Bible Books
              </h2>
              <p className="font-body text-ink-soft text-xs sm:text-sm">
                Explore all 73 holy books in the Catholic canon
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close book selector"
            className="bg-sand text-ink hover:bg-sand-border focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-2xl transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-4">
          <div className="relative flex items-center">
            <Search className="text-ink-soft absolute left-3.5 h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books (e.g. Genesis, Tobit, Matthew)..."
              className="border-sand-border font-body text-ink placeholder:text-ink-soft/70 focus-accessible w-full rounded-2xl border-2 bg-white py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 pt-3" role="tablist">
          {[
            { id: "all", label: "All Books (73)" },
            { id: "old", label: "Old Testament (46)" },
            { id: "deutero", label: "Deuterocanonical (7)" },
            { id: "new", label: "New Testament (27)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id as FilterTab)}
              className={cn(
                "font-heading focus-accessible min-h-[40px] rounded-xl px-3.5 py-1.5 text-xs font-black transition-all",
                tab === item.id
                  ? "bg-blue-deep shadow-sticker-blue text-white"
                  : "bg-sand text-ink-soft hover:bg-sand-border hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="mt-2 min-h-[260px] flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {filteredBooks.map((book) => {
              const isSelected = book.code.toLowerCase() === currentBookCode?.toLowerCase();
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => {
                    onSelectBook(book);
                    onClose();
                  }}
                  className={cn(
                    "focus-accessible flex min-h-[64px] flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-all active:scale-95",
                    isSelected
                      ? "border-blue-deep bg-blue-tint/60 text-blue-deep font-black"
                      : "border-sand-border hover:bg-sand/40 text-ink bg-white",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="font-heading truncate text-sm font-extrabold">
                      {book.name}
                    </span>
                    {book.isDeuterocanonical && (
                      <span
                        title="Catholic Deuterocanonical Book"
                        className="bg-yellow-tint text-yellow-deep inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>DC</span>
                      </span>
                    )}
                  </div>
                  <span className="font-body text-ink-soft text-[11px]">
                    {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-ink-soft flex flex-col items-center justify-center py-12 text-center">
              <p className="font-heading text-base font-bold">
                No books found matching &ldquo;{search}&rdquo;
              </p>
              <p className="font-body mt-1 text-xs">Try searching for Genesis, Tobit, or Matthew</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
