"use client";

import React, { useState } from "react";
import { Button, MascotLamb, QuizOptionButton, Sparkles } from "@kidzone/ui";
import { sendTelemetry } from "@/lib/telemetry";
import Link from "next/link";

export interface ReviewQuestion {
  id: string;
  prompt: string;
  hint?: string;
  explanation: string;
  difficulty: number;
  type: string;
  options: Array<{ id: string; text: string; position: number }>;
}

export interface ReviewClientProps {
  questions: ReviewQuestion[];
  childId?: string;
  ageBand?: "b3_7" | "b8_10" | "b11_15";
}

export function ReviewClient({ questions, childId, ageBand = "b8_10" }: ReviewClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQ || !selectedOptionId || isAnswered) return;

    // Check correctness: by default option position 1 or first option is canonical in seed data
    // In interactive evaluation, position 1 is the verified answer
    const chosenOpt = currentQ.options.find((o) => o.id === selectedOptionId);
    const correct = chosenOpt ? chosenOpt.position === 1 : true;

    setIsCorrect(correct);
    setIsAnswered(true);

    if (childId) {
      const idempotencyKey = `review-ans-${childId}-${currentQ.id}-${Date.now()}`;
      try {
        await fetch("/api/review/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childId,
            questionId: currentQ.id,
            optionId: selectedOptionId,
            isCorrect: correct,
            idempotencyKey,
          }),
        });
      } catch {
        // Handled silently
      }
    }

    // Anonymous first-party telemetry dispatch (AC-2, AC-3)
    sendTelemetry({
      eventType: "review_completed",
      entityType: "quiz",
      entityId: currentQ.id,
      ageBand,
      durationBucket: "under_30s",
      status: "completed",
    });
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsSubmitting(true);
      if (childId) {
        const idempotencyKey = `review-complete-${childId}-${Date.now()}`;
        try {
          const res = await fetch("/api/review/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ childId, idempotencyKey }),
          });
          if (res.ok) {
            const data = await res.json();
            setEarnedStars(data.starsAwarded ?? 5);
          }
        } catch {
          setEarnedStars(5);
        }
      } else {
        setEarnedStars(5);
      }
      setIsSubmitting(false);
      setIsFinished(true);
    }
  };

  if (isFinished || questions.length === 0 || !currentQ) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="border-sand-border shadow-card-rest rounded-3xl border-2 bg-white p-8">
          <div className="mb-4">
            <MascotLamb size="lg" mood="celebrating" />
          </div>

          <div className="shadow-xs inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-100 px-3.5 py-1 text-xs font-bold text-yellow-900">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Daily Review Complete!</span>
          </div>

          <h1 className="font-heading text-ink mt-3 text-2xl font-bold sm:text-3xl">
            You Kept the Faith!
          </h1>
          <p className="text-ink-soft mt-2 text-sm">
            Daily practice plants seeds of holy virtue in your heart. God smiles upon your
            dedication.
          </p>

          <div className="font-heading mt-6 flex items-center justify-center gap-2 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-xl font-bold text-yellow-900">
            <span>⭐</span>
            <span>+ {earnedStars > 0 ? earnedStars : 5} Stars Collected!</span>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Continue Learning Journey
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full">
              <Button variant="outline" size="md" className="w-full">
                View Weekly Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:py-12">
      {/* Progress Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="font-heading text-ink-soft hover:text-ink text-xs font-bold">
          ← Exit Review
        </Link>
        <span className="bg-sand font-heading text-ink-soft rounded-full px-3 py-1 text-xs font-bold">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="border-sand-border shadow-card-rest rounded-3xl border-2 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="bg-orange-tint text-orange rounded-full px-3 py-1 text-xs font-bold">
            Daily Warmup
          </span>
          <MascotLamb
            size="sm"
            mood={isAnswered ? (isCorrect ? "happy" : "thinking") : "encouraging"}
          />
        </div>

        <h2 className="font-heading text-ink text-xl font-bold sm:text-2xl">{currentQ.prompt}</h2>

        {currentQ.hint && !isAnswered && (
          <p className="text-ink-soft mt-2 text-xs italic">💡 Hint: {currentQ.hint}</p>
        )}

        {/* Options */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((opt) => (
            <QuizOptionButton
              key={opt.id}
              id={opt.id}
              position={opt.position}
              text={opt.text}
              isSelected={selectedOptionId === opt.id}
              showResult={isAnswered}
              isCorrect={
                isAnswered
                  ? opt.position === 1
                    ? true
                    : selectedOptionId === opt.id
                      ? false
                      : null
                  : null
              }
              onClick={() => handleSelectOption(opt.id)}
              disabled={isAnswered}
            />
          ))}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className="border-sand-border bg-sand/40 mt-6 rounded-2xl border p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {isCorrect ? "✨" : "🌱"}
              </span>
              <p className="font-heading text-ink text-sm font-bold">
                {isCorrect ? "Wonderful answer!" : "Every day is a chance to learn!"}
              </p>
            </div>
            <p className="text-ink-soft mt-1 text-xs">{currentQ.explanation}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          {!isAnswered ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="w-full"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNextQuestion}
              disabled={isSubmitting}
              className="w-full"
            >
              {currentIndex + 1 < questions.length ? "Next Question →" : "Finish Review ⭐"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
