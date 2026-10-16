CREATE TYPE "public"."attempt_kind" AS ENUM('quiz', 'random', 'review');--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'review_completed';--> statement-breakpoint
ALTER TYPE "public"."activity_type" ADD VALUE 'random_quiz_completed';--> statement-breakpoint
CREATE TABLE "filter_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term" text NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"severity" smallint DEFAULT 2 NOT NULL,
	"category" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_weekly" (
	"week_start" date NOT NULL,
	"child_id" uuid NOT NULL,
	"age_band" "age_band" NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "leaderboard_weekly_week_start_child_id_pk" PRIMARY KEY("week_start","child_id")
);
--> statement-breakpoint
CREATE TABLE "review_items" (
	"child_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"interval_days" smallint DEFAULT 1 NOT NULL,
	"correct_streak" smallint DEFAULT 0 NOT NULL,
	"last_answered_at" timestamp with time zone,
	CONSTRAINT "review_items_child_id_question_id_pk" PRIMARY KEY("child_id","question_id")
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ALTER COLUMN "quiz_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "children" ADD COLUMN "show_on_leaderboard" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_verses" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "saints" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "mass_parts" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "prayers" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "rosary_mysteries" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "sacraments" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "puzzles" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "source_note" text;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD COLUMN "kind" "attempt_kind" DEFAULT 'quiz' NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard_weekly" ADD CONSTRAINT "leaderboard_weekly_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "filter_terms_term_locale_idx" ON "filter_terms" USING btree ("term","locale");--> statement-breakpoint
CREATE INDEX "leaderboard_weekly_rank_idx" ON "leaderboard_weekly" USING btree ("week_start","age_band","stars");--> statement-breakpoint
CREATE INDEX "review_items_due_idx" ON "review_items" USING btree ("child_id","due_at");--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_chk" CHECK (kind <> 'quiz' OR quiz_id IS NOT NULL);