
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS location text;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
