
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Generic updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Hero
CREATE TABLE public.hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  button_one_label TEXT NOT NULL DEFAULT 'Apply Now',
  button_one_href TEXT NOT NULL DEFAULT '#contact',
  button_two_label TEXT NOT NULL DEFAULT 'Contact Us',
  button_two_href TEXT NOT NULL DEFAULT '#contact',
  stat_students INT NOT NULL DEFAULT 0,
  stat_courses INT NOT NULL DEFAULT 0,
  stat_seminars INT NOT NULL DEFAULT 0,
  stat_success_rate INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_section TO anon, authenticated;
GRANT ALL ON public.hero_section TO service_role;
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hero" ON public.hero_section FOR SELECT USING (true);
CREATE POLICY "Admin manage hero" ON public.hero_section FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER hero_updated BEFORE UPDATE ON public.hero_section FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Vision & Mission
CREATE TABLE public.vision_mission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vision_mission TO anon, authenticated;
GRANT ALL ON public.vision_mission TO service_role;
ALTER TABLE public.vision_mission ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vm" ON public.vision_mission FOR SELECT USING (true);
CREATE POLICY "Admin manage vm" ON public.vision_mission FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER vm_updated BEFORE UPDATE ON public.vision_mission FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- About
CREATE TABLE public.about_us (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_us TO anon, authenticated;
GRANT ALL ON public.about_us TO service_role;
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about" ON public.about_us FOR SELECT USING (true);
CREATE POLICY "Admin manage about" ON public.about_us FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER about_updated BEFORE UPDATE ON public.about_us FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Activities
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon, authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Admin manage activities" ON public.activities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER activities_updated BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Events / Seminars
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  fee TEXT NOT NULL,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admin manage courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Campus Gallery
CREATE TABLE public.campus_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campus_gallery TO anon, authenticated;
GRANT ALL ON public.campus_gallery TO service_role;
ALTER TABLE public.campus_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.campus_gallery FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery" ON public.campus_gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Settings (contact info + footer + socials)
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT,
  phone TEXT,
  email TEXT,
  working_hours TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  footer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Seed initial content
INSERT INTO public.hero_section (title, subtitle, stat_students, stat_courses, stat_seminars, stat_success_rate)
VALUES (
  'Shaping Tomorrow''s Leaders Through Modern Education',
  'MEPA — Modern Educational Proficiency Academy. A premier institution committed to academic excellence, innovation, and holistic student development.',
  2500, 45, 120, 98
);

INSERT INTO public.vision_mission (vision, mission) VALUES (
  'To be a globally recognized academy that empowers learners with knowledge, character, and proficiency to lead change in an evolving world.',
  'To deliver world-class education through innovative teaching, modern facilities, and a nurturing environment that develops critical thinking, creativity, and lifelong learners.'
);

INSERT INTO public.about_us (content) VALUES (
  'Founded with a vision to redefine modern education, MEPA — Modern Educational Proficiency Academy — has built a reputation for academic rigor, innovative pedagogy, and student-centered learning. Our experienced faculty, state-of-the-art campus, and comprehensive curriculum prepare students to excel academically and thrive professionally. From foundational learning to advanced specialization, MEPA is committed to nurturing confident, capable, and globally-minded individuals.'
);

INSERT INTO public.activities (title, description, sort_order) VALUES
('Workshops', 'Hands-on workshops led by industry experts covering modern technologies, languages, and creative disciplines.', 1),
('Educational Tours', 'Curated trips to museums, research centers, and historic sites that bring textbook learning to life.', 2),
('Competitions', 'Inter-school and national-level academic, sports, and arts competitions to challenge and inspire.', 3),
('Community Service', 'Programs that develop empathy and civic responsibility through meaningful community engagement.', 4),
('Student Clubs', 'Robotics, debate, music, art, and more — clubs that nurture passion beyond the classroom.', 5),
('Career Guidance', 'Personalized counseling, university prep, and mentorship from accomplished professionals.', 6);

INSERT INTO public.events (title, description, event_date) VALUES
('Annual Science Symposium 2026', 'A flagship gathering featuring guest scientists, student research showcases, and interactive labs.', '2026-09-15'),
('Leadership & Innovation Seminar', 'A full-day seminar with global thought leaders on innovation, entrepreneurship, and leadership.', '2026-08-02'),
('Career Pathways Conference', 'Industry leaders share insights on emerging careers, skills, and university admissions.', '2026-07-20');

INSERT INTO public.courses (title, description, duration, fee, sort_order) VALUES
('Advanced Sciences Program', 'Comprehensive physics, chemistry, and biology curriculum with laboratory practice.', '2 Years', '$1,200 / year', 1),
('Modern Mathematics', 'Pure and applied mathematics building strong analytical foundations.', '1 Year', '$800 / year', 2),
('Computer Science & AI', 'Programming, data structures, and an introduction to artificial intelligence.', '1 Year', '$1,000 / year', 3),
('Business & Economics', 'Foundational business principles, economics, and entrepreneurial thinking.', '1 Year', '$900 / year', 4),
('Languages & Literature', 'English, Arabic, and French — literary analysis and communication mastery.', '1 Year', '$700 / year', 5),
('Creative Arts Program', 'Visual arts, design, and music for creatively-driven students.', '1 Year', '$750 / year', 6);

INSERT INTO public.settings (address, phone, email, working_hours, facebook, instagram, linkedin, footer_text) VALUES (
  '123 Academy Avenue, Education District, City',
  '+1 (555) 123-4567',
  'info@mepa-academy.edu',
  'Mon – Fri: 8:00 AM – 5:00 PM',
  'https://facebook.com/mepa',
  'https://instagram.com/mepa',
  'https://linkedin.com/company/mepa',
  '© 2026 MEPA — Modern Educational Proficiency Academy. All rights reserved.'
);
