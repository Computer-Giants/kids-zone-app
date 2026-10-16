# 0010. Quizzes and Lamb Guide Feedback

**Date**: 2026-10-16
**Status**: Complete

## Summary

This specification defines the Catholic quiz engine and encouraging mascot feedback loop for Kid Zone. Designed for children aged 3 to 15, quizzes reinforce catechism lessons, Bible stories, and saint biographies through 4 question interactive challenges. In accordance with our core design rules, the quiz engine strictly rejects negative scoring, buzzer sounds, and red error indicators: wrong answers receive gentle guidance from the friendly lamb mascot, while correct answers and quiz completions celebrate spiritual growth with stars and cheerful animations.

## Context

Testing faith knowledge in childhood education should encourage curiosity and joy, never anxiety or shame. Traditional quiz applications feature jarring red cross marks, countdown timers, and negative feedback that discourage young learners. In Catholic pedagogy, learning is an encounter with divine love and wisdom.

Kid Zone addresses this through a positive feedback loop:

1. Four question sets ensure manageable attention spans without cognitive exhaustion.
2. The living lamb mascot guides the child with expressive moods (`encouraging` on mistakes, `celebrating` on success).
3. Incorrect answers are never styled in red or punished with deductions; the app gently explains the concept and invites another attempt.
4. Completing a quiz awards progress stars to every child who finishes, celebrating perseverance and learning.

## Requirements

**User stories**:

- As a Catholic child, I want to take fun quizzes about Bible stories and saints so that I can see how much I have learned.
- As a young learner (Little Lambs, 3 to 7), I want to see picture options and simple audio questions so that I can play before I read fluently.
- As an intermediate learner (Seekers, 8 to 10), I want hints and helpful explanations so that I understand why the answer is meaningful.
- As an older learner (Disciples, 11 to 15), I want challenging trivia and 'Who Am I?' saint clues that test my Catholic knowledge.
- As a parent, I want to ensure my child is never shamed or discouraged when they choose a wrong answer.
- As a guest explorer, I want to play quizzes and celebrate progress stored safely on my device.

**Acceptance criteria**:

- **AC-1**: Navigating to `/quizzes` presents curated quiz categories (Bible, Saints, Catechism, Church Seasons) with age band recommendations and star indicators.
- **AC-2**: Starting a quiz presents an interactive 4 question flow with tap targets of at least 48px, accessible option buttons, and a progress bar.
- **AC-3**: Question types adapt to age bands: picture choice and true/false for Little Lambs (3 to 7); multiple choice with hints for Seekers (8 to 10); multi clue 'Who Am I?' saint mysteries for Disciples (11 to 15).
- **AC-4**: An incorrect answer triggers gentle, encouraging lamb mascot feedback (`mood = 'encouraging'`) and comforting guidance, with zero red colors, zero negative scores, and zero shaming language.
- **AC-5**: A correct answer triggers celebratory lamb mascot feedback (`mood = 'happy'`), reveals the faith explanation note, and illuminates the primary orange action to proceed to the next question.
- **AC-6**: Completing all 4 questions triggers celebratory animations (`mood = 'celebrating'`) with sparkles and awards stars according to project rules.
- **AC-7**: Quiz completion records an idempotent event in `activity_events` for authenticated children, and updates local device storage for guest learners.
- **AC-8**: Quizzes linked to catechism lessons (`lesson_id`) provide two way navigation back to the lesson and update lesson completion indicators.

## Options considered

### Option 1: Four question positive reinforcement engine with lamb mascot states (Recommended)

Standardize on four question quizzes linked to lessons or standalone topics. Adapt question format by age band. Replace failure penalties with supportive lamb coaching. Award stars upon finish to reward completion and effort.

**Pros**:

- Fully respects the core project rule: "Don't shame a child. No red for wrong answers, no negative scores, no 'you failed'".
- Four question length matches short attention spans on mobile devices.
- Uses existing database tables in `packages/db/src/schema/fun.ts`.
- Deeply integrates with the animated lamb mascot component.

**Cons**:

- Does not rank children by competitive correctness percentages (intentional by design).

### Option 2: Timed competitive quiz mode with leaderboards

Implement a speed and accuracy countdown timer with rankings based on fast answers.

**Pros**:

- Appeals to competitive gamers.

**Cons**:

- Violates core project rules regarding child anxiety and leaderboard ranking (stars only, never competitive speed).
- Inaccessible for children with reading difficulties or young motor skills.

### Option 3: Infinite question trivia generator

Serve unlimited randomized questions from an uncurated pool until the child exits.

**Pros**:

- High content variety.

**Cons**:

- Lacks a sense of completion or clear milestones.
- Uncurated questions risk introducing unreviewed doctrinal ambiguity.

## Decision

**Chosen option**: Option 1: Four question positive reinforcement engine with lamb mascot states.

We will provide 4 question quizzes with age adapted formats, gentle lamb coaching on mistakes, faith explanations, and celebration stars upon completion.

**Implementation skills**: `drizzle-best-practices` (`packages/db`), `web-design-guidelines` (`packages/ui`)

## Rationale

Children learn best in safe, encouraging environments where mistakes are treated as natural steps toward understanding. The four question structure prevents fatigue, while the lamb mascot provides warm companionship. Adhering to warm colors (gold, orange, soft sand) and positive reinforcement aligns directly with Catholic formation values.

## Feature design

**Data model sketch**:

Uses existing database tables defined in `packages/db/src/schema/fun.ts`:

- `quizzes`: `id` (UUID PK), `slug` (text unique), `title` (text), `description` (text), `coverAssetId` (UUID FK), `lessonId` (UUID FK opt), `passScore` (smallint default 60), `...contentMeta()`.
- `quiz_questions`: `id` (UUID PK), `quizId` (UUID FK), `position` (smallint), `type` (questionType enum: multiple_choice, true_false, who_am_i, picture_select), `prompt` (text), `imageAssetId` (UUID FK opt), `hint` (text opt), `explanation` (text), `difficulty` (smallint 1 to 3), `subjectSaintId` (UUID FK opt), `config` (jsonb opt).
- `quiz_options`: `id` (UUID PK), `questionId` (UUID FK), `position` (smallint), `text` (text opt), `imageAssetId` (UUID FK opt), `isCorrect` (boolean).

**API surface**:

| Endpoint                  | Method | Key inputs                                                           | Key outputs                                                                            | Auth             | Key errors                               |
| ------------------------- | ------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------- |
| /api/quizzes              | GET    | ageBand: string (opt), lessonId: string (opt)                        | quizzes: Array of Quiz                                                                 | public           | 500 server error                         |
| /api/quizzes/:slug        | GET    | slug: string                                                         | quiz: Quiz, questions: Array of Questions with Options (isCorrect hidden until answer) | public           | 404 quiz not found                       |
| /api/quizzes/:slug/answer | POST   | questionId: string, optionId: string                                 | isCorrect: boolean, explanation: string, lambMood: string                              | public           | 400 invalid question                     |
| /api/quizzes/complete     | POST   | quizId: string, idempotencyKey: string (UUID), childId: string (opt) | status: string, starsAwarded: integer, guest: boolean                                  | optional session | 400 invalid payload, 409 duplicate event |

**Value sourcing**:

| Action               | Value produced / displayed       | Source                                                                                              |
| -------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| Load quiz list       | Categorized quiz cards           | Query `quizzes` where `status = 'published'` joining cover assets                                   |
| Load quiz questions  | 4 questions and shuffled options | Query `quiz_questions` and `quiz_options` where `quiz_id = quiz.id` ordered by `position`           |
| Answer evaluation    | Correctness flag and explanation | Query `quiz_options.is_correct` and `quiz_questions.explanation`                                    |
| Mascot mood reaction | Encouraging vs celebrating mood  | Determined by answer correctness (`encouraging` on false, `happy` on true, `celebrating` on finish) |
| Award quiz stars     | Stars balance increase           | Append row to `activity_events` with type `quiz_completed` using client idempotency key             |

**Key invariants**:

- Nothing published reaches a child unless a reviewer approved it: all quizzes and questions must have `status = 'published'` in contentMeta.
- No question option or UI element may ever render red or sound a buzzer on incorrect answers.
- Quizzes contain exactly 4 questions per session to respect child developmental focus.
- Options must shuffle to prevent mechanical position memorization.
- Guest children earn device stored stars with zero server records.

**Security model**:

- Public read access for all `published` quizzes, questions, and options.
- The `is_correct` field is evaluated on the server or obfuscated until the child taps an option to prevent client inspection tampering.
- Completion mutations require valid child session cookies or local device acknowledgment.

**Configuration required**:

None. Uses existing Supabase Postgres connection and `@kidzone/ui` tokens.

**Critical test scenarios**:

- Happy path: Child opens `/quizzes`, selects 'Creation & God's Animals', answers 4 questions, views encouraging lamb feedback on mistakes and happy feedback on correct answers, and celebrates completion with stars, verifying **AC-1**, **AC-2**, **AC-4**, **AC-5**, **AC-6**.
- Age band tailoring: Little Lambs profile views picture choice questions; Disciples profile views 'Who Am I?' saint clues, verifying **AC-3**.
- Non shaming feedback: Selecting an incorrect option displays friendly sand and amber guidance with zero red styles, verifying **AC-4**.
- Lesson linking: Completing a lesson recap quiz links back to the catechism lesson view, verifying **AC-8**.

## Build plan

1. Seed initial catechism, Scripture, and saint quizzes with 4 questions each in `packages/db`, satisfies **AC-1**, **AC-3**.
2. Implement typed Hono API endpoints for quiz listing, question fetching, answer evaluation, and completion in `apps/api/src/routes/quizzes.ts`, satisfies **AC-1**, **AC-2**.
3. Create QuizCard, QuizOptionButton, and QuizFeedbackModal components in `packages/ui`, satisfies **AC-2**, **AC-4**, **AC-5**.
4. Build `/quizzes` catalog and `/quizzes/[slug]` interactive quiz runner in `apps/web` with animated lamb mascot reactions and celebratory win screen, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-5**, **AC-6**.
5. Implement lesson return links and progress synchronization for authenticated and guest learners, satisfies **AC-7**, **AC-8**.

## Consequences

**Positive**:

- Children test and reinforce their Catholic faith knowledge in a joyful, supportive environment.
- Mascot reactions deepen emotional connection with the guide lamb.
- Strict anti-shaming architecture protects sensitive and neurodivergent children.

**Negative / tradeoffs**:

- Requires authoring thoughtful explanations for every question to make mistakes educational.

**Neutral**:

- New quizzes can be continuously linked to newly authored catechism lessons.

## Follow-up

- [ ] Submit seed quiz question prompts and doctrinal explanations for priest review before publishing.
