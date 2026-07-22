
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Audio category enum
CREATE TYPE public.audio_category AS ENUM (
  'campaign_tunes',
  'church_audio',
  'native_languages',
  'business_greetings',
  'hold_music',
  'voice_overs'
);

-- Audio tracks
CREATE TABLE public.audio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category public.audio_category NOT NULL,
  storage_path text NOT NULL,
  is_paid boolean NOT NULL DEFAULT false,
  skiza_code text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.audio_tracks TO anon, authenticated;
GRANT ALL ON public.audio_tracks TO service_role;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view audio tracks"
  ON public.audio_tracks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert audio tracks"
  ON public.audio_tracks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audio tracks"
  ON public.audio_tracks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update audio tracks"
  ON public.audio_tracks FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Ratings
CREATE TABLE public.track_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.audio_tracks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (track_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.track_ratings TO authenticated;
GRANT SELECT ON public.track_ratings TO anon;
GRANT ALL ON public.track_ratings TO service_role;
ALTER TABLE public.track_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON public.track_ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert their own rating"
  ON public.track_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rating"
  ON public.track_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rating"
  ON public.track_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage policies for audio-tracks bucket
CREATE POLICY "Anyone can view audio files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'audio-tracks');

CREATE POLICY "Admins can upload audio files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio-tracks' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audio files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'audio-tracks' AND public.has_role(auth.uid(), 'admin'));
