CREATE TYPE "public"."activity_type" AS ENUM('daily_open', 'verse_read', 'story_read', 'saint_viewed', 'prayer_prayed', 'lesson_completed', 'quiz_completed', 'puzzle_completed');--> statement-breakpoint
CREATE TYPE "public"."age_band" AS ENUM('b3_7', 'b8_10', 'b11_15');--> statement-breakpoint
CREATE TYPE "public"."app_section" AS ENUM('bible', 'saints', 'catechism', 'quizzes', 'games', 'stories');--> statement-breakpoint
CREATE TYPE "public"."child_status" AS ENUM('active', 'graduated');--> statement-breakpoint
CREATE TYPE "public"."content_entity" AS ENUM('story', 'saint', 'lesson', 'course', 'quiz', 'puzzle', 'prayer', 'featured_verse', 'glossary_term', 'journey');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'submitted', 'approved', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."course_kind" AS ENUM('core_beliefs', 'prayers', 'mass_church_year', 'sacrament_prep');--> statement-breakpoint
CREATE TYPE "public"."ledger_currency" AS ENUM('star', 'coin');--> statement-breakpoint
CREATE TYPE "public"."liturgical_color" AS ENUM('green', 'purple', 'white', 'red', 'rose', 'gold');--> statement-breakpoint
CREATE TYPE "public"."mass_section" AS ENUM('introductory_rites', 'liturgy_of_the_word', 'liturgy_of_the_eucharist', 'concluding_rites');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'svg', 'audio');--> statement-breakpoint
CREATE TYPE "public"."parish_post_kind" AS ENUM('announcement', 'event');--> statement-breakpoint
CREATE TYPE "public"."parish_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."place_kind" AS ENUM('born', 'lived', 'died', 'visited');--> statement-breakpoint
CREATE TYPE "public"."prayer_category" AS ENUM('daily', 'mass', 'marian', 'saints', 'seasonal', 'other');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('started', 'completed');--> statement-breakpoint
CREATE TYPE "public"."puzzle_type" AS ENUM('word_search', 'matching', 'scramble', 'fill_blank', 'coloring');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'picture_choice', 'true_false', 'who_am_i');--> statement-breakpoint
CREATE TYPE "public"."reading_mode" AS ENUM('full', 'key_verses', 'stories');--> statement-breakpoint
CREATE TYPE "public"."review_decision" AS ENUM('approved', 'changes_requested', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."rosary_set" AS ENUM('joyful', 'luminous', 'sorrowful', 'glorious');--> statement-breakpoint
CREATE TYPE "public"."testament" AS ENUM('old', 'new');--> statement-breakpoint
CREATE TYPE "public"."topic_group" AS ENUM('virtue', 'sacrament', 'commandment', 'season', 'theme');--> statement-breakpoint
CREATE TYPE "public"."translation_level" AS ENUM('standard', 'easy');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('parent', 'contributor', 'reviewer', 'moderator', 'admin');--> statement-breakpoint
CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"nickname" text NOT NULL,
	"avatar" text NOT NULL,
	"birth_date" date NOT NULL,
	"pin_hash" text,
	"status" "child_status" DEFAULT 'active' NOT NULL,
	"graduated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"parish_id" uuid,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "households_owner_id_unique" UNIQUE("owner_id")
);
--> statement-breakpoint
CREATE TABLE "parish_admins" (
	"parish_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parish_admins_parish_id_profile_id_pk" PRIMARY KEY("parish_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "parish_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parish_id" uuid NOT NULL,
	"kind" "parish_post_kind" NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"location" text,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"submitted_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parish_posts_published_chk" CHECK (status <> 'published' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "parishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"city" text,
	"region" text,
	"country" text,
	"diocese" text,
	"status" "parish_status" DEFAULT 'pending' NOT NULL,
	"suggested_by" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parishes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "parishes_approved_chk" CHECK (status <> 'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" "user_role" DEFAULT 'parent' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "content_entity" NOT NULL,
	"entity_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"decision" "review_decision" NOT NULL,
	"notes" text,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_topics" (
	"entity_type" "content_entity" NOT NULL,
	"entity_id" uuid NOT NULL,
	"topic_id" integer NOT NULL,
	CONSTRAINT "content_topics_entity_type_entity_id_topic_id_pk" PRIMARY KEY("entity_type","entity_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "media_kind" NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"bytes" integer,
	"duration_ms" integer,
	"width" integer,
	"height" integer,
	"alt_text" text,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "topics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"topic_group" "topic_group" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon_asset_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bible_books" (
	"id" integer PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"testament" "testament" NOT NULL,
	"is_deuterocanonical" boolean DEFAULT false NOT NULL,
	"chapters" smallint NOT NULL,
	CONSTRAINT "bible_books_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "bible_translations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bible_translations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"level" "translation_level" NOT NULL,
	"license" text NOT NULL,
	"source_url" text,
	"attribution" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bible_translations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "bible_verses" (
	"translation_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"chapter" smallint NOT NULL,
	"verse" smallint NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "bible_verses_translation_id_book_id_chapter_verse_pk" PRIMARY KEY("translation_id","book_id","chapter","verse")
);
--> statement-breakpoint
CREATE TABLE "child_preferences" (
	"child_id" uuid PRIMARY KEY NOT NULL,
	"age_band_override" "age_band",
	"reading_mode" "reading_mode",
	"translation_id" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "featured_verses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" integer NOT NULL,
	"start_chapter" smallint NOT NULL,
	"start_verse" smallint NOT NULL,
	"end_chapter" smallint NOT NULL,
	"end_verse" smallint NOT NULL,
	"meaning" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "featured_verses_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "featured_verses_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "verse_of_the_day" (
	"day" date NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"featured_verse_id" uuid NOT NULL,
	"set_by" uuid,
	CONSTRAINT "verse_of_the_day_day_locale_pk" PRIMARY KEY("day","locale")
);
--> statement-breakpoint
CREATE TABLE "patronages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patronages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"icon_asset_id" uuid,
	CONSTRAINT "patronages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saint_fun_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"saint_id" uuid NOT NULL,
	"position" smallint DEFAULT 1 NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saint_of_the_day" (
	"day" date PRIMARY KEY NOT NULL,
	"saint_id" uuid NOT NULL,
	"set_by" uuid
);
--> statement-breakpoint
CREATE TABLE "saint_patronages" (
	"saint_id" uuid NOT NULL,
	"patronage_id" integer NOT NULL,
	CONSTRAINT "saint_patronages_saint_id_patronage_id_pk" PRIMARY KEY("saint_id","patronage_id")
);
--> statement-breakpoint
CREATE TABLE "saint_places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"saint_id" uuid NOT NULL,
	"kind" "place_kind" NOT NULL,
	"place_name" text NOT NULL,
	"country_code" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "saints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"tagline" text,
	"feast_month" smallint,
	"feast_day" smallint,
	"feast_note" text,
	"birth_year" integer,
	"death_year" integer,
	"era_label" text,
	"country_codes" text[] DEFAULT '{}'::text[] NOT NULL,
	"search_aliases" text[] DEFAULT '{}'::text[] NOT NULL,
	"prayer" text,
	"portrait_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "saints_slug_unique" UNIQUE("slug"),
	CONSTRAINT "saints_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "saints_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "catechism_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"kind" "course_kind" NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"cover_asset_id" uuid,
	"sacrament_id" integer,
	"position" smallint DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "catechism_courses_slug_unique" UNIQUE("slug"),
	CONSTRAINT "catechism_courses_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "catechism_courses_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "catechism_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"position" smallint NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"sacrament_id" integer,
	"season_id" integer,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "catechism_lessons_slug_unique" UNIQUE("slug"),
	CONSTRAINT "catechism_lessons_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "catechism_lessons_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	"pronunciation" text,
	"image_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "glossary_terms_slug_unique" UNIQUE("slug"),
	CONSTRAINT "glossary_terms_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "glossary_terms_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "lesson_panels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"caption" text NOT NULL,
	"illustration_asset_id" uuid,
	"audio_asset_id" uuid,
	"word_timings" jsonb
);
--> statement-breakpoint
CREATE TABLE "liturgical_seasons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "liturgical_seasons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" text NOT NULL,
	"name" text NOT NULL,
	"color" "liturgical_color" NOT NULL,
	"description" text,
	"icon_asset_id" uuid,
	CONSTRAINT "liturgical_seasons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "mass_parts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mass_parts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"section" "mass_section" NOT NULL,
	"position" smallint NOT NULL,
	"name" text NOT NULL,
	"what_happens" text NOT NULL,
	"what_we_say" text,
	"what_we_do" text,
	"image_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "mass_parts_position_unique" UNIQUE("position"),
	CONSTRAINT "mass_parts_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "mass_parts_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "prayers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category" "prayer_category" DEFAULT 'other' NOT NULL,
	"audio_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "prayers_slug_unique" UNIQUE("slug"),
	CONSTRAINT "prayers_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "prayers_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "rosary_mysteries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rosary_mysteries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"set" "rosary_set" NOT NULL,
	"position" smallint NOT NULL,
	"title" text NOT NULL,
	"scripture_ref" text,
	"reflection" text NOT NULL,
	"image_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "rosary_mysteries_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "rosary_mysteries_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "sacraments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sacraments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"position" smallint NOT NULL,
	"sign_text" text,
	"who_receives" text,
	"simple_explanation" text NOT NULL,
	"icon_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sacraments_slug_unique" UNIQUE("slug"),
	CONSTRAINT "sacraments_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "puzzle_links" (
	"puzzle_id" uuid NOT NULL,
	"entity_type" "content_entity" NOT NULL,
	"entity_id" uuid NOT NULL,
	CONSTRAINT "puzzle_links_puzzle_id_entity_type_entity_id_pk" PRIMARY KEY("puzzle_id","entity_type","entity_id")
);
--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"type" "puzzle_type" NOT NULL,
	"title" text NOT NULL,
	"instructions" text,
	"difficulty" smallint DEFAULT 1 NOT NULL,
	"cover_asset_id" uuid,
	"config" jsonb NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "puzzles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "puzzles_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "puzzles_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL)),
	CONSTRAINT "puzzles_difficulty_chk" CHECK (difficulty BETWEEN 1 AND 3)
);
--> statement-breakpoint
CREATE TABLE "quiz_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"text" text,
	"image_asset_id" uuid,
	"is_correct" boolean DEFAULT false NOT NULL,
	CONSTRAINT "quiz_options_content_chk" CHECK (text IS NOT NULL OR image_asset_id IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"type" "question_type" NOT NULL,
	"prompt" text NOT NULL,
	"image_asset_id" uuid,
	"hint" text,
	"explanation" text,
	"difficulty" smallint DEFAULT 1 NOT NULL,
	"subject_saint_id" uuid,
	"config" jsonb,
	CONSTRAINT "quiz_questions_difficulty_chk" CHECK (difficulty BETWEEN 1 AND 3)
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"cover_asset_id" uuid,
	"lesson_id" uuid,
	"pass_score" smallint DEFAULT 60 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "quizzes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "quizzes_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "quizzes_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"kind_id" integer NOT NULL,
	"cover_asset_id" uuid,
	"reading_minutes" smallint,
	"author" text,
	"bible_book_id" integer,
	"bible_start_chapter" smallint,
	"bible_start_verse" smallint,
	"bible_end_chapter" smallint,
	"bible_end_verse" smallint,
	"saint_id" uuid,
	"closing_prayer_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "stories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "stories_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "stories_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL)),
	CONSTRAINT "stories_bible_ref_chk" CHECK ((bible_book_id IS NULL AND bible_start_chapter IS NULL AND bible_start_verse IS NULL AND bible_end_chapter IS NULL AND bible_end_verse IS NULL)
        OR (bible_book_id IS NOT NULL AND bible_start_chapter IS NOT NULL AND bible_start_verse IS NOT NULL AND bible_end_chapter IS NOT NULL AND bible_end_verse IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "story_kinds" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "story_kinds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"icon_asset_id" uuid,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "story_kinds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "story_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"text" text NOT NULL,
	"illustration_asset_id" uuid,
	"audio_asset_id" uuid,
	"word_timings" jsonb
);
--> statement-breakpoint
CREATE TABLE "activity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"type" "activity_type" NOT NULL,
	"entity_type" "content_entity",
	"entity_id" uuid,
	"score" smallint,
	"idempotency_key" text NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "activity_events_score_chk" CHECK (score IS NULL OR score BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon_asset_id" uuid,
	"rule" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "badges_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "child_badges" (
	"child_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "child_badges_child_id_badge_id_pk" PRIMARY KEY("child_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE "child_progress" (
	"child_id" uuid NOT NULL,
	"entity_type" "content_entity" NOT NULL,
	"entity_id" uuid NOT NULL,
	"status" "progress_status" DEFAULT 'started' NOT NULL,
	"best_score" smallint,
	"attempts" integer DEFAULT 0 NOT NULL,
	"first_completed_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "child_progress_child_id_entity_type_entity_id_pk" PRIMARY KEY("child_id","entity_type","entity_id")
);
--> statement-breakpoint
CREATE TABLE "coin_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"currency" "ledger_currency" DEFAULT 'coin' NOT NULL,
	"amount" integer NOT NULL,
	"min_score" smallint,
	"first_time_only" boolean DEFAULT true NOT NULL,
	"daily_cap" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coin_rules_code_unique" UNIQUE("code"),
	CONSTRAINT "coin_rules_amount_chk" CHECK (amount > 0)
);
--> statement-breakpoint
CREATE TABLE "journey_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"entity_type" "content_entity" NOT NULL,
	"entity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"section" "app_section" NOT NULL,
	"cover_asset_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"published_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"min_age" smallint DEFAULT 3 NOT NULL,
	"max_age" smallint DEFAULT 15 NOT NULL,
	CONSTRAINT "journeys_slug_unique" UNIQUE("slug"),
	CONSTRAINT "journeys_age_range_chk" CHECK (min_age >= 3 AND max_age <= 15 AND min_age <= max_age),
	CONSTRAINT "journeys_published_chk" CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_by IS NOT NULL AND published_at IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"currency" "ledger_currency" NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"event_id" uuid,
	"rule_id" uuid,
	"entity_type" "content_entity",
	"entity_id" uuid,
	"challenge_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ledger_entries_amount_chk" CHECK (amount <> 0)
);
--> statement-breakpoint
CREATE TABLE "quiz_answers" (
	"attempt_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"option_id" uuid,
	"is_correct" boolean NOT NULL,
	"time_ms" integer,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_answers_attempt_id_question_id_pk" PRIMARY KEY("attempt_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"score" smallint,
	"correct_count" smallint,
	"total_count" smallint,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "streaks" (
	"child_id" uuid PRIMARY KEY NOT NULL,
	"current" integer DEFAULT 0 NOT NULL,
	"longest" integer DEFAULT 0 NOT NULL,
	"last_active_date" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_parish_id_parishes_id_fk" FOREIGN KEY ("parish_id") REFERENCES "public"."parishes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_admins" ADD CONSTRAINT "parish_admins_parish_id_parishes_id_fk" FOREIGN KEY ("parish_id") REFERENCES "public"."parishes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_admins" ADD CONSTRAINT "parish_admins_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_admins" ADD CONSTRAINT "parish_admins_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_posts" ADD CONSTRAINT "parish_posts_parish_id_parishes_id_fk" FOREIGN KEY ("parish_id") REFERENCES "public"."parishes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_posts" ADD CONSTRAINT "parish_posts_submitted_by_profiles_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parish_posts" ADD CONSTRAINT "parish_posts_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_suggested_by_profiles_id_fk" FOREIGN KEY ("suggested_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_reviews" ADD CONSTRAINT "content_reviews_reviewer_id_profiles_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_topics" ADD CONSTRAINT "content_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bible_verses" ADD CONSTRAINT "bible_verses_translation_id_bible_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."bible_translations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bible_verses" ADD CONSTRAINT "bible_verses_book_id_bible_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."bible_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_preferences" ADD CONSTRAINT "child_preferences_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_preferences" ADD CONSTRAINT "child_preferences_translation_id_bible_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."bible_translations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_verses" ADD CONSTRAINT "featured_verses_book_id_bible_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."bible_books"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_verses" ADD CONSTRAINT "featured_verses_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_verses" ADD CONSTRAINT "featured_verses_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_verses" ADD CONSTRAINT "featured_verses_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_of_the_day" ADD CONSTRAINT "verse_of_the_day_featured_verse_id_featured_verses_id_fk" FOREIGN KEY ("featured_verse_id") REFERENCES "public"."featured_verses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verse_of_the_day" ADD CONSTRAINT "verse_of_the_day_set_by_profiles_id_fk" FOREIGN KEY ("set_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patronages" ADD CONSTRAINT "patronages_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_fun_facts" ADD CONSTRAINT "saint_fun_facts_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_of_the_day" ADD CONSTRAINT "saint_of_the_day_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_of_the_day" ADD CONSTRAINT "saint_of_the_day_set_by_profiles_id_fk" FOREIGN KEY ("set_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_patronages" ADD CONSTRAINT "saint_patronages_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_patronages" ADD CONSTRAINT "saint_patronages_patronage_id_patronages_id_fk" FOREIGN KEY ("patronage_id") REFERENCES "public"."patronages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saint_places" ADD CONSTRAINT "saint_places_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saints" ADD CONSTRAINT "saints_portrait_asset_id_media_assets_id_fk" FOREIGN KEY ("portrait_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saints" ADD CONSTRAINT "saints_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saints" ADD CONSTRAINT "saints_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saints" ADD CONSTRAINT "saints_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD CONSTRAINT "catechism_courses_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD CONSTRAINT "catechism_courses_sacrament_id_sacraments_id_fk" FOREIGN KEY ("sacrament_id") REFERENCES "public"."sacraments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD CONSTRAINT "catechism_courses_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD CONSTRAINT "catechism_courses_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_courses" ADD CONSTRAINT "catechism_courses_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_course_id_catechism_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."catechism_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_sacrament_id_sacraments_id_fk" FOREIGN KEY ("sacrament_id") REFERENCES "public"."sacraments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_season_id_liturgical_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."liturgical_seasons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_lessons" ADD CONSTRAINT "catechism_lessons_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD CONSTRAINT "glossary_terms_image_asset_id_media_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD CONSTRAINT "glossary_terms_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD CONSTRAINT "glossary_terms_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD CONSTRAINT "glossary_terms_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_panels" ADD CONSTRAINT "lesson_panels_lesson_id_catechism_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."catechism_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_panels" ADD CONSTRAINT "lesson_panels_illustration_asset_id_media_assets_id_fk" FOREIGN KEY ("illustration_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_panels" ADD CONSTRAINT "lesson_panels_audio_asset_id_media_assets_id_fk" FOREIGN KEY ("audio_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liturgical_seasons" ADD CONSTRAINT "liturgical_seasons_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mass_parts" ADD CONSTRAINT "mass_parts_image_asset_id_media_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mass_parts" ADD CONSTRAINT "mass_parts_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mass_parts" ADD CONSTRAINT "mass_parts_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mass_parts" ADD CONSTRAINT "mass_parts_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayers" ADD CONSTRAINT "prayers_audio_asset_id_media_assets_id_fk" FOREIGN KEY ("audio_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayers" ADD CONSTRAINT "prayers_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayers" ADD CONSTRAINT "prayers_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayers" ADD CONSTRAINT "prayers_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rosary_mysteries" ADD CONSTRAINT "rosary_mysteries_image_asset_id_media_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rosary_mysteries" ADD CONSTRAINT "rosary_mysteries_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rosary_mysteries" ADD CONSTRAINT "rosary_mysteries_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rosary_mysteries" ADD CONSTRAINT "rosary_mysteries_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sacraments" ADD CONSTRAINT "sacraments_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sacraments" ADD CONSTRAINT "sacraments_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sacraments" ADD CONSTRAINT "sacraments_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sacraments" ADD CONSTRAINT "sacraments_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzle_links" ADD CONSTRAINT "puzzle_links_puzzle_id_puzzles_id_fk" FOREIGN KEY ("puzzle_id") REFERENCES "public"."puzzles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_image_asset_id_media_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_image_asset_id_media_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_subject_saint_id_saints_id_fk" FOREIGN KEY ("subject_saint_id") REFERENCES "public"."saints"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_catechism_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."catechism_lessons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_kind_id_story_kinds_id_fk" FOREIGN KEY ("kind_id") REFERENCES "public"."story_kinds"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_bible_book_id_bible_books_id_fk" FOREIGN KEY ("bible_book_id") REFERENCES "public"."bible_books"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_closing_prayer_id_prayers_id_fk" FOREIGN KEY ("closing_prayer_id") REFERENCES "public"."prayers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_kinds" ADD CONSTRAINT "story_kinds_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_pages" ADD CONSTRAINT "story_pages_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_pages" ADD CONSTRAINT "story_pages_illustration_asset_id_media_assets_id_fk" FOREIGN KEY ("illustration_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_pages" ADD CONSTRAINT "story_pages_audio_asset_id_media_assets_id_fk" FOREIGN KEY ("audio_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_icon_asset_id_media_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_badges" ADD CONSTRAINT "child_badges_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_badges" ADD CONSTRAINT "child_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_progress" ADD CONSTRAINT "child_progress_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_nodes" ADD CONSTRAINT "journey_nodes_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_cover_asset_id_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_published_by_profiles_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_event_id_activity_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."activity_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_rule_id_coin_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."coin_rules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_option_id_quiz_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."quiz_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "children_household_idx" ON "children" USING btree ("household_id");--> statement-breakpoint
CREATE UNIQUE INDEX "children_household_nickname_idx" ON "children" USING btree ("household_id","nickname");--> statement-breakpoint
CREATE INDEX "households_parish_idx" ON "households" USING btree ("parish_id");--> statement-breakpoint
CREATE INDEX "parish_posts_parish_status_idx" ON "parish_posts" USING btree ("parish_id","status");--> statement-breakpoint
CREATE INDEX "parishes_status_idx" ON "parishes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "content_reviews_entity_idx" ON "content_reviews" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "content_topics_topic_idx" ON "content_topics" USING btree ("topic_id","entity_type");--> statement-breakpoint
CREATE INDEX "featured_verses_ref_idx" ON "featured_verses" USING btree ("book_id","start_chapter","start_verse");--> statement-breakpoint
CREATE INDEX "saint_fun_facts_saint_idx" ON "saint_fun_facts" USING btree ("saint_id","position");--> statement-breakpoint
CREATE INDEX "saint_places_saint_idx" ON "saint_places" USING btree ("saint_id");--> statement-breakpoint
CREATE INDEX "saint_places_country_idx" ON "saint_places" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "saints_feast_idx" ON "saints" USING btree ("feast_month","feast_day");--> statement-breakpoint
CREATE INDEX "catechism_courses_kind_idx" ON "catechism_courses" USING btree ("kind","position");--> statement-breakpoint
CREATE UNIQUE INDEX "catechism_lessons_course_position_idx" ON "catechism_lessons" USING btree ("course_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_panels_lesson_position_idx" ON "lesson_panels" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "rosary_mysteries_set_position_idx" ON "rosary_mysteries" USING btree ("set","position");--> statement-breakpoint
CREATE INDEX "puzzle_links_entity_idx" ON "puzzle_links" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "puzzles_type_idx" ON "puzzles" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_options_question_position_idx" ON "quiz_options" USING btree ("question_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_questions_quiz_position_idx" ON "quiz_questions" USING btree ("quiz_id","position");--> statement-breakpoint
CREATE INDEX "quizzes_lesson_idx" ON "quizzes" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "stories_kind_idx" ON "stories" USING btree ("kind_id");--> statement-breakpoint
CREATE INDEX "stories_saint_idx" ON "stories" USING btree ("saint_id");--> statement-breakpoint
CREATE UNIQUE INDEX "story_pages_story_position_idx" ON "story_pages" USING btree ("story_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "activity_events_child_key_idx" ON "activity_events" USING btree ("child_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "activity_events_child_time_idx" ON "activity_events" USING btree ("child_id","occurred_at");--> statement-breakpoint
CREATE INDEX "activity_events_child_type_idx" ON "activity_events" USING btree ("child_id","type");--> statement-breakpoint
CREATE INDEX "child_progress_recent_idx" ON "child_progress" USING btree ("child_id","last_activity_at");--> statement-breakpoint
CREATE UNIQUE INDEX "journey_nodes_journey_position_idx" ON "journey_nodes" USING btree ("journey_id","position");--> statement-breakpoint
CREATE INDEX "journey_nodes_entity_idx" ON "journey_nodes" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_child_idx" ON "ledger_entries" USING btree ("child_id","currency","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ledger_entries_first_time_idx" ON "ledger_entries" USING btree ("child_id","rule_id","entity_type","entity_id") WHERE rule_id IS NOT NULL AND entity_id IS NOT NULL;--> statement-breakpoint
CREATE INDEX "quiz_answers_question_idx" ON "quiz_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_child_quiz_idx" ON "quiz_attempts" USING btree ("child_id","quiz_id");