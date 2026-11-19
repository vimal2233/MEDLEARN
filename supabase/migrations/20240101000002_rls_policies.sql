-- MedLearn Row Level Security Policies
-- This migration sets up RLS for all user-owned tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_case_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles are readable by all authenticated users (for social features if needed)
-- CREATE POLICY "Public profiles are readable" ON public.profiles
--     FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- USER PREFERENCES
-- ============================================

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FLASHCARD DECKS
-- ============================================

-- Users can read their own decks and public decks
CREATE POLICY "Users can read own and public decks" ON public.flashcard_decks
    FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_system = true);

-- Users can create their own decks
CREATE POLICY "Users can create own decks" ON public.flashcard_decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update own decks" ON public.flashcard_decks
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks" ON public.flashcard_decks
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FLASHCARDS
-- ============================================

-- Users can read flashcards from accessible decks
CREATE POLICY "Users can read flashcards from accessible decks" ON public.flashcards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.flashcard_decks d
            WHERE d.id = flashcards.deck_id
            AND (d.user_id = auth.uid() OR d.is_public = true OR d.is_system = true)
        )
    );

-- Users can manage flashcards in their own decks
CREATE POLICY "Users can manage own deck flashcards" ON public.flashcards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.flashcard_decks d
            WHERE d.id = flashcards.deck_id
            AND d.user_id = auth.uid()
        )
    );

-- ============================================
-- FLASHCARD REVIEWS
-- ============================================

CREATE POLICY "Users can manage own flashcard reviews" ON public.flashcard_reviews
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================

CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- QUIZ ANSWERS
-- ============================================

CREATE POLICY "Users can manage own quiz answers" ON public.quiz_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts a
            WHERE a.id = quiz_answers.attempt_id
            AND a.user_id = auth.uid()
        )
    );

-- ============================================
-- CLINICAL CASE ATTEMPTS
-- ============================================

CREATE POLICY "Users can manage own case attempts" ON public.user_case_attempts
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- STUDY PLANS
-- ============================================

CREATE POLICY "Users can manage own study plans" ON public.study_plans
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- STUDY PLAN TASKS
-- ============================================

CREATE POLICY "Users can manage own study plan tasks" ON public.study_plan_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.study_plans p
            WHERE p.id = study_plan_tasks.plan_id
            AND p.user_id = auth.uid()
        )
    );

-- ============================================
-- USER PROGRESS
-- ============================================

CREATE POLICY "Users can manage own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- DAILY ACTIVITY
-- ============================================

CREATE POLICY "Users can manage own daily activity" ON public.daily_activity
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- USER ACHIEVEMENTS
-- ============================================

CREATE POLICY "Users can read own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Achievements are granted by system, not directly by users
-- INSERT/UPDATE handled by backend functions

-- ============================================
-- BOOKMARKS
-- ============================================

CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PERSONAL NOTES
-- ============================================

CREATE POLICY "Users can manage own notes" ON public.personal_notes
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATION PREFERENCES
-- ============================================

CREATE POLICY "Users can manage own notification preferences" ON public.notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- DEVICE PUSH TOKENS
-- ============================================

CREATE POLICY "Users can manage own push tokens" ON public.device_push_tokens
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- AI CONVERSATIONS
-- ============================================

CREATE POLICY "Users can manage own AI conversations" ON public.ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- AI MESSAGES
-- ============================================

CREATE POLICY "Users can read own AI messages" ON public.ai_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_conversations c
            WHERE c.id = ai_messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own AI messages" ON public.ai_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ai_conversations c
            WHERE c.id = ai_messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

-- ============================================
-- SYNC QUEUE
-- ============================================

CREATE POLICY "Users can manage own sync queue" ON public.sync_queue
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PUBLIC READ ACCESS FOR CURRICULUM CONTENT
-- ============================================

-- Academic phases are public
ALTER TABLE public.academic_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic phases are publicly readable" ON public.academic_phases
    FOR SELECT USING (true);

-- Subjects are public
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects are publicly readable" ON public.subjects
    FOR SELECT USING (true);

-- Chapters are public
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are publicly readable" ON public.chapters
    FOR SELECT USING (true);

-- Topics are public
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are publicly readable" ON public.topics
    FOR SELECT USING (true);

-- Published lessons are public
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published lessons are publicly readable" ON public.lessons
    FOR SELECT USING (is_published = true);

-- Lesson resources for published lessons
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources for published lessons are readable" ON public.lesson_resources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = lesson_resources.lesson_id
            AND l.is_published = true
        )
    );

-- Published questions are public
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published questions are publicly readable" ON public.questions
    FOR SELECT USING (is_published = true);

-- Question options for published questions
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Options for published questions are readable" ON public.question_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.questions q
            WHERE q.id = question_options.question_id
            AND q.is_published = true
        )
    );

-- Question images for published questions
ALTER TABLE public.question_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images for published questions are readable" ON public.question_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.questions q
            WHERE q.id = question_images.question_id
            AND q.is_published = true
        )
    );

-- Published quizzes are public
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published quizzes are publicly readable" ON public.quizzes
    FOR SELECT USING (is_published = true);

-- Quiz questions for published quizzes
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions for published quizzes are readable" ON public.quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            WHERE q.id = quiz_questions.quiz_id
            AND q.is_published = true
        )
    );

-- Published clinical cases are public
ALTER TABLE public.clinical_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published clinical cases are publicly readable" ON public.clinical_cases
    FOR SELECT USING (is_published = true);

-- Content sources are public
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content sources are publicly readable" ON public.content_sources
    FOR SELECT USING (true);

-- Achievements are public
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are publicly readable" ON public.achievements
    FOR SELECT USING (true);

-- ============================================
-- ADMIN ACCESS (for content management)
-- ============================================

-- Admins can manage all curriculum content
-- This requires a custom claim or role check
-- Example: CREATE POLICY "Admins can manage curriculum" ON public.subjects
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- For now, we'll use service role for admin operations via Edge Functions
-- The service role bypasses RLS entirely

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's academic phase
CREATE OR REPLACE FUNCTION public.get_user_academic_phase()
RETURNS TEXT AS $$
DECLARE
    phase TEXT;
BEGIN
    SELECT academic_phase INTO phase
    FROM public.profiles
    WHERE id = auth.uid();
    RETURN COALESCE(phase, 'phase1');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcard_decks_updated_at BEFORE UPDATE ON public.flashcard_decks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON public.flashcards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinical_cases_updated_at BEFORE UPDATE ON public.clinical_cases
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_plan_tasks_updated_at BEFORE UPDATE ON public.study_plan_tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_activity_updated_at BEFORE UPDATE ON public.daily_activity
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_notes_updated_at BEFORE UPDATE ON public.personal_notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();