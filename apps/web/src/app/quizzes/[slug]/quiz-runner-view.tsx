"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SeedQuiz } from "@kidzone/db";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  HelpCircle,
  House,
  type LambMood,
  MascotLamb,
  QuizOptionButton,
  RotateCcw,
  Sparkles,
} from "@kidzone/ui";
import type { LearnerSession } from "@/lib/child-session";
import { markGuestItemComplete } from "@kidzone/utils";

export interface QuizRunnerViewProps {
  quiz: SeedQuiz;
  session: LearnerSession;
}

export function QuizRunnerView({ quiz, session }: QuizRunnerViewProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = React.useState(false);
  const [answerResult, setAnswerResult] = React.useState<{
    isCorrect: boolean;
    explanation: string;
    lambMood: LambMood;
  } | null>(null);
  const [showHint, setShowHint] = React.useState(false);

  // Win and completion state
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [starsAwarded, setStarsAwarded] = React.useState<number | null>(null);
  const [isSubmittingCompletion, setIsSubmittingCompletion] = React.useState(false);

  const currentQuestion = quiz.questions[currentIndex]!;
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  // Mascot dynamic guidance mood
  const currentLambMood: LambMood = React.useMemo(() => {
    if (isCompleted) return "celebrating";
    if (answerResult) return answerResult.lambMood;
    return "happy";
  }, [isCompleted, answerResult]);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const localOpt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const correct = Boolean(localOpt?.isCorrect);
    const lambMood: LambMood = correct ? "happy" : "encouraging";

    setAnswerResult({
      isCorrect: correct,
      explanation: currentQuestion.explanation,
      lambMood,
    });
    setIsAnswerSubmitted(true);

    try {
      fetch(`/api/quizzes/${quiz.slug}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        }),
      }).catch(() => {});
    } catch {
      // Ignored
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleCompleteQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setAnswerResult(null);
      setShowHint(false);
    }
  };

  const handleCompleteQuiz = async () => {
    if (isSubmittingCompletion) return;
    setIsSubmittingCompletion(true);

    const childId = session && !session.isGuest ? session.id : undefined;
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${quiz.slug}-${Date.now()}`;

    if (!childId) {
      // Guest mode
      if (typeof window !== "undefined") {
        markGuestItemComplete(`quiz-${quiz.slug}`);
      }
      setStarsAwarded(0);
      setIsCompleted(true);
      setIsSubmittingCompletion(false);
      return;
    }

    try {
      const res = await fetch("/api/quizzes/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.slug,
          childId,
          idempotencyKey,
          score: 100,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStarsAwarded(data.starsAwarded ?? 2);
      } else {
        setStarsAwarded(2);
      }
    } catch {
      setStarsAwarded(2);
    }

    setIsCompleted(true);
    setIsSubmittingCompletion(false);
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswerResult(null);
    setShowHint(false);
    setIsCompleted(false);
    setStarsAwarded(null);
  };

  // AC-6: Win and completion celebration screen
  if (isCompleted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-8 px-4 py-12 text-center">
        <div className="bg-yellow-tint border-yellow shadow-sticker-yellow rounded-full border-2 p-4">
          <MascotLamb size="lg" mood="celebrating" />
        </div>

        <div className="space-y-3">
          <div className="bg-green-tint font-heading text-green-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Quiz Complete!</span>
          </div>

          <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
            Splendid Work!
          </h1>

          <p className="font-body text-ink/80 max-w-md text-base font-medium leading-relaxed sm:text-lg">
            {session && !session.isGuest
              ? `Hooray, ${session.nickname}! You finished all 4 questions and earned ${starsAwarded ?? 2} golden stars for your journey.`
              : "Hooray! You completed all 4 questions. Your quiz progress has been safely saved on this device!"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={handleRestartQuiz}
            className="bg-sand font-heading text-ink hover:bg-sand-border focus-accessible border-sand-border inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-sm font-black transition-all sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/quizzes")}
            className="bg-orange font-heading hover:bg-orange-deep focus-accessible shadow-sticker-orange inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white transition-all sm:w-auto"
          >
            <span>More Quizzes</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* AC-8: Return to catechism lesson if linked */}
        {quiz.lessonSlug && (
          <Link
            href={`/catechism/${quiz.lessonSlug}`}
            className="font-heading text-blue-deep inline-flex items-center gap-2 pt-2 text-xs font-bold hover:underline"
          >
            <BookOpen className="h-4 w-4" />
            <span>Return to Catechism Lesson</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
      {/* Navigation and Top Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <Link
          href="/quizzes"
          className="bg-sand font-heading text-ink hover:bg-sand-border focus-accessible border-sand-border inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Quizzes</span>
        </Link>

        <Link
          href="/"
          className="bg-sand text-ink/70 hover:text-ink focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-3 py-2 transition-all"
          aria-label="Return to home screen"
        >
          <House className="h-4 w-4" />
        </Link>
      </nav>

      {/* AC-2: Question Progress Header */}
      <header className="border-sand-border shadow-card-rest space-y-4 rounded-3xl border-2 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-heading text-orange-deep text-xs font-black uppercase tracking-wider">
              {quiz.title}
            </span>
            <h2 className="font-heading text-ink text-lg font-black sm:text-xl">
              Question {currentIndex + 1} of {quiz.questions.length}
            </h2>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2" aria-label="Progress bar">
            {quiz.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-orange w-8"
                    : idx < currentIndex
                      ? "bg-green w-3"
                      : "bg-sand-border w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* AC-2, AC-3: Question Card */}
      <main className="border-sand-border shadow-card-rest space-y-6 rounded-3xl border-2 bg-white p-6 sm:p-8">
        {/* Prompt */}
        <div className="space-y-2">
          <h1 className="font-heading text-ink text-xl font-black leading-snug sm:text-2xl">
            {currentQuestion.prompt}
          </h1>

          {/* AC-3: Disciples Who Am I Clues List */}
          {currentQuestion.type === "who_am_i" && currentQuestion.clues && (
            <div className="bg-sand/40 border-sand-border mt-3 space-y-2 rounded-2xl border p-4">
              <span className="font-heading text-blue-deep flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mystery Clues</span>
              </span>
              <ul className="font-body text-ink list-inside list-disc space-y-1 text-sm font-medium">
                {currentQuestion.clues.map((clue, idx) => (
                  <li key={idx}>{clue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Optional Hint Button */}
        {currentQuestion.hint && !showHint && !isAnswerSubmitted && (
          <div>
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="bg-sand font-heading text-ink/75 hover:bg-sand-border hover:text-ink inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all"
            >
              <HelpCircle className="text-blue-deep h-3.5 w-3.5" />
              <span>Need a friendly hint?</span>
            </button>
          </div>
        )}

        {showHint && currentQuestion.hint && (
          <div className="bg-yellow-tint/40 border-yellow/60 space-y-1 rounded-2xl border p-4">
            <span className="font-heading text-yellow-deep text-xs font-black uppercase tracking-wider">
              Helpful Hint
            </span>
            <p className="font-body text-ink text-sm font-medium">{currentQuestion.hint}</p>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3" role="radiogroup" aria-label="Question choices">
          {currentQuestion.options.map((option) => (
            <QuizOptionButton
              key={option.id}
              id={option.id}
              position={option.position}
              text={option.text}
              isSelected={selectedOptionId === option.id}
              isCorrect={
                isAnswerSubmitted && answerResult
                  ? (option.isCorrect ??
                    (selectedOptionId === option.id ? answerResult.isCorrect : null))
                  : null
              }
              showResult={isAnswerSubmitted}
              disabled={isAnswerSubmitted}
              onClick={() => handleSelectOption(option.id)}
            />
          ))}
        </div>

        {/* AC-4, AC-5: Educational Explanation & Lamb Feedback */}
        {isAnswerSubmitted && answerResult && (
          <div
            className={`space-y-3 rounded-2xl border-2 p-5 transition-all ${
              answerResult.isCorrect
                ? "bg-green-tint/50 border-green/60"
                : "bg-sand/60 border-yellow/60"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 pt-0.5">
                <MascotLamb size="sm" mood={currentLambMood} />
              </div>
              <div className="space-y-1">
                <span className="font-heading text-ink/70 text-xs font-black uppercase tracking-wider">
                  {answerResult.isCorrect ? "Wonderful!" : "Keep learning, little lamb!"}
                </span>
                <p className="font-body text-ink text-sm font-medium leading-relaxed sm:text-base">
                  {answerResult.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Check Answer or Next Question */}
        <div className="flex justify-end pt-4">
          {!isAnswerSubmitted ? (
            <button
              type="button"
              data-testid="submit-answer-btn"
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="bg-orange font-heading hover:bg-orange-deep focus-accessible shadow-sticker-orange inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Check Answer</span>
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              data-testid="next-question-btn"
              onClick={handleNextQuestion}
              className="bg-orange font-heading hover:bg-orange-deep focus-accessible shadow-sticker-orange inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white transition-all active:scale-95"
            >
              <span>{isLastQuestion ? "Celebrate Completion!" : "Next Question"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
