-- Kid Zone Row Level Security Policies
-- Ensures child privacy, household data isolation, and published content visibility

-- 1. Household and Child Profile Policies
CREATE POLICY "households_owner_select" ON public.households
  FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "households_owner_insert" ON public.households
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "households_owner_update" ON public.households
  FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "households_owner_delete" ON public.households
  FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "children_household_select" ON public.children
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.households WHERE households.id = children.household_id AND households.owner_id = auth.uid()));
CREATE POLICY "children_household_insert" ON public.children
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.households WHERE households.id = children.household_id AND households.owner_id = auth.uid()));
CREATE POLICY "children_household_update" ON public.children
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.households WHERE households.id = children.household_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.households WHERE households.id = children.household_id AND households.owner_id = auth.uid()));
CREATE POLICY "children_household_delete" ON public.children
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.households WHERE households.id = children.household_id AND households.owner_id = auth.uid()));

CREATE POLICY "child_preferences_household_select" ON public.child_preferences
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_preferences.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "child_preferences_household_insert" ON public.child_preferences
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_preferences.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "child_preferences_household_update" ON public.child_preferences
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_preferences.child_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_preferences.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "streaks_household_select" ON public.streaks
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = streaks.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "streaks_household_insert" ON public.streaks
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = streaks.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "streaks_household_update" ON public.streaks
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = streaks.child_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = streaks.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "child_badges_household_select" ON public.child_badges
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_badges.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "child_badges_household_insert" ON public.child_badges
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_badges.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "child_progress_household_select" ON public.child_progress
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_progress.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "child_progress_household_insert" ON public.child_progress
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_progress.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "child_progress_household_update" ON public.child_progress
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_progress.child_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = child_progress.child_id AND households.owner_id = auth.uid()));

-- 2. Append-Only Progress and Ledger Policies (No updates or deletes)
CREATE POLICY "activity_events_household_select" ON public.activity_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = activity_events.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "activity_events_household_insert" ON public.activity_events
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = activity_events.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "ledger_entries_household_select" ON public.ledger_entries
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = ledger_entries.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "ledger_entries_household_insert" ON public.ledger_entries
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = ledger_entries.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "quiz_attempts_household_select" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = quiz_attempts.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "quiz_attempts_household_insert" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = quiz_attempts.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "quiz_attempts_household_update" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = quiz_attempts.child_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = quiz_attempts.child_id AND households.owner_id = auth.uid()));

CREATE POLICY "quiz_answers_household_select" ON public.quiz_answers
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quiz_attempts JOIN public.children ON children.id = quiz_attempts.child_id JOIN public.households ON households.id = children.household_id WHERE quiz_attempts.id = quiz_answers.attempt_id AND households.owner_id = auth.uid()));
CREATE POLICY "quiz_answers_household_insert" ON public.quiz_answers
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.quiz_attempts JOIN public.children ON children.id = quiz_attempts.child_id JOIN public.households ON households.id = children.household_id WHERE quiz_attempts.id = quiz_answers.attempt_id AND households.owner_id = auth.uid()));

CREATE POLICY "review_items_household_select" ON public.review_items
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = review_items.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "review_items_household_insert" ON public.review_items
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = review_items.child_id AND households.owner_id = auth.uid()));
CREATE POLICY "review_items_household_update" ON public.review_items
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = review_items.child_id AND households.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.children JOIN public.households ON households.id = children.household_id WHERE children.id = review_items.child_id AND households.owner_id = auth.uid()));

-- 3. Published Content Read Policies (Accessible to children and guests)
CREATE POLICY "saints_published_select" ON public.saints
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "stories_published_select" ON public.stories
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "story_pages_published_select" ON public.story_pages
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.stories WHERE stories.id = story_pages.story_id AND stories.status = 'published'));
CREATE POLICY "featured_verses_published_select" ON public.featured_verses
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "catechism_courses_published_select" ON public.catechism_courses
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "catechism_lessons_published_select" ON public.catechism_lessons
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "lesson_panels_published_select" ON public.lesson_panels
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.catechism_lessons WHERE catechism_lessons.id = lesson_panels.lesson_id AND catechism_lessons.status = 'published'));
CREATE POLICY "glossary_terms_published_select" ON public.glossary_terms
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "prayers_published_select" ON public.prayers
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "rosary_mysteries_published_select" ON public.rosary_mysteries
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "sacraments_published_select" ON public.sacraments
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "mass_parts_published_select" ON public.mass_parts
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "puzzles_published_select" ON public.puzzles
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "puzzle_links_published_select" ON public.puzzle_links
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.puzzles WHERE puzzles.id = puzzle_links.puzzle_id AND puzzles.status = 'published'));
CREATE POLICY "quizzes_published_select" ON public.quizzes
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "quiz_questions_published_select" ON public.quiz_questions
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.status = 'published'));
CREATE POLICY "quiz_options_published_select" ON public.quiz_options
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.quiz_questions JOIN public.quizzes ON quizzes.id = quiz_questions.quiz_id WHERE quiz_questions.id = quiz_options.question_id AND quizzes.status = 'published'));
CREATE POLICY "journeys_published_select" ON public.journeys
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "journey_nodes_published_select" ON public.journey_nodes
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.journeys WHERE journeys.id = journey_nodes.journey_id AND journeys.status = 'published'));

-- 4. Open Reference and Catalog Tables
CREATE POLICY "bible_books_public_select" ON public.bible_books
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "bible_translations_public_select" ON public.bible_translations
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "bible_verses_public_select" ON public.bible_verses
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "liturgical_seasons_public_select" ON public.liturgical_seasons
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "patronages_public_select" ON public.patronages
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "saint_fun_facts_public_select" ON public.saint_fun_facts
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.saints WHERE saints.id = saint_fun_facts.saint_id AND saints.status = 'published'));
CREATE POLICY "saint_places_public_select" ON public.saint_places
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.saints WHERE saints.id = saint_places.saint_id AND saints.status = 'published'));
CREATE POLICY "saint_patronages_public_select" ON public.saint_patronages
  FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.saints WHERE saints.id = saint_patronages.saint_id AND saints.status = 'published'));
CREATE POLICY "saint_of_the_day_public_select" ON public.saint_of_the_day
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "verse_of_the_day_public_select" ON public.verse_of_the_day
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "story_kinds_public_select" ON public.story_kinds
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "topics_public_select" ON public.topics
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content_topics_public_select" ON public.content_topics
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "media_assets_public_select" ON public.media_assets
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "coin_rules_public_select" ON public.coin_rules
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "badges_public_select" ON public.badges
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "parishes_public_select" ON public.parishes
  FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "parish_posts_public_select" ON public.parish_posts
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "leaderboard_weekly_public_select" ON public.leaderboard_weekly
  FOR SELECT TO anon, authenticated USING (true);
