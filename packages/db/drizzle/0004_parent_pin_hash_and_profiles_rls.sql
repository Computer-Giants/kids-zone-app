-- Migration 0004: Parent PIN hash for households and ensure profiles RLS policies
ALTER TABLE public.households
  ADD COLUMN IF NOT EXISTS parent_pin_hash text;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_owner_select'
  ) THEN
    CREATE POLICY "profiles_owner_select" ON public.profiles
      FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_owner_insert'
  ) THEN
    CREATE POLICY "profiles_owner_insert" ON public.profiles
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_owner_update'
  ) THEN
    CREATE POLICY "profiles_owner_update" ON public.profiles
      FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;
