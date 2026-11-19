-- MedLearn Database Schema
-- Initial migration for MBBS learning application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES & USER MANAGEMENT
-- ============================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    academic_year INTEGER NOT NULL DEFAULT 1 CHECK (academic_year BETWEEN 1 AND 5),
    academic_phase TEXT NOT NULL DEFAULT 'phase1' CHECK (academic_phase IN ('phase1', 'phase2', 'phase3a', 'phase3b')),
    institution TEXT,
    learning_goals TEXT[] DEFAULT '{}',
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi')),
    daily_study_target_minutes INTEGER NOT NULL DEFAULT 60 CHECK (daily_study_target_minutes BETWEEN 15 AND 480),
    avatar_url TEXT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme_mode TEXT NOT NULL DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
    notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    notification_time TIME NOT NULL DEFAULT '19:00',
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_summary BOOLEAN NOT NULL DEFAULT TRUE,
    daily_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    streak_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CURRICULUM STRUCTURE
-- ============================================

CREATE TABLE public.academic_phases (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year_label TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    academic_phase_id TEXT NOT NULL REFERENCES public.academic_phases(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL,
    color TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    total_topics INTEGER NOT NULL DEFAULT 0,
    estimated_hours INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    description TEXT,
    estimated_minutes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(subject_id, name)
);

CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    learning_objectives TEXT[],
    difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_minutes INTEGER NOT NULL DEFAULT 10,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'interactive', 'diagram')),
    content_md TEXT,
    content_html TEXT,
    video_url TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 5,
    display_order INTEGER NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('diagram', 'image', 'pdf', 'video', 'audio', 'link')),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    file_size_bytes BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('textbook', 'guideline', 'journal', 'website', 'custom')),
    reference TEXT,
    url TEXT,
    credibility_score INTEGER NOT NULL DEFAULT 5 CHECK (credibility_score BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- QUESTION BANK
-- ============================================

CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'mcq_single' CHECK (question_type IN ('mcq_single', 'mcq_multiple', 'image_based', 'clinical_scenario', 'matching', 'fill_blank', 'short_answer')),
    difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
    explanation TEXT NOT NULL,
    clinical_relevance TEXT,
    source_id UUID REFERENCES public.content_sources(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.question_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- QUIZZES & ATTEMPTS
-- ============================================

CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    quiz_type TEXT NOT NULL DEFAULT 'topic' CHECK (quiz_type IN ('topic', 'chapter', 'subject', 'mixed', 'timed', 'revision', 'mock', 'custom')),
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    time_limit_minutes INTEGER,
    question_count INTEGER NOT NULL DEFAULT 10,
    passing_score INTEGER NOT NULL DEFAULT 50,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quiz_questions (
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (quiz_id, question_id)
);

CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_taken_seconds INTEGER,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0,
    unanswered_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'timed_out')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_options UUID[] DEFAULT '{}',
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    marked_for_review BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FLASHCARDS & SPACED REPETITION
-- ============================================

CREATE TABLE public.flashcard_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    card_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    front_image_url TEXT,
    back_image_url TEXT,
    difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FSRS (Free Spaced Repetition Scheduler) fields
CREATE TABLE public.flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 4), -- 1=Again, 2=Hard, 3=Good, 4=Easy
    state INTEGER NOT NULL DEFAULT 0 CHECK (state BETWEEN 0 AND 3), -- 0=New, 1=Learning, 2=Review, 3=Relearning
    stability DOUBLE PRECISION NOT NULL DEFAULT 0,
    difficulty DOUBLE PRECISION NOT NULL DEFAULT 0,
    elapsed_days INTEGER NOT NULL DEFAULT 0,
    scheduled_days INTEGER NOT NULL DEFAULT 0,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CLINICAL CASES
-- ============================================

CREATE TABLE public.clinical_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    patient_age INTEGER,
    patient_gender TEXT CHECK (patient_gender IN ('male', 'female', 'other')),
    presenting_complaint TEXT NOT NULL,
    history TEXT NOT NULL,
    examination_findings TEXT,
    investigations TEXT,
    questions JSONB NOT NULL DEFAULT '[]',
    learning_points TEXT[] DEFAULT '{}',
    difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    is_daily_case BOOLEAN NOT NULL DEFAULT FALSE,
    daily_case_date DATE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_case_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}',
    score INTEGER,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_taken_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STUDY PLANNER
-- ============================================

CREATE TABLE public.study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.study_plan_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('lesson', 'quiz', 'flashcards', 'clinical_case', 'revision', 'mock_exam')),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'rescheduled')),
    completed_at TIMESTAMPTZ,
    priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROGRESS & ANALYTICS
-- ============================================

CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    progress_type TEXT NOT NULL CHECK (progress_type IN ('lesson', 'quiz', 'flashcard', 'clinical_case', 'topic', 'chapter', 'subject')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
    completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, progress_type, subject_id, chapter_id, topic_id, lesson_id)
);

CREATE TABLE public.daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    quizzes_attempted INTEGER NOT NULL DEFAULT 0,
    flashcards_reviewed INTEGER NOT NULL DEFAULT 0,
    clinical_cases_completed INTEGER NOT NULL DEFAULT 0,
    study_time_seconds INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    streak_maintained BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('learning', 'streak', 'quiz', 'flashcard', 'clinical', 'milestone', 'special')),
    requirement_type TEXT NOT NULL,
    requirement_value JSONB NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    progress JSONB DEFAULT '{}',
    PRIMARY KEY (user_id, achievement_id)
);

-- ============================================
-- BOOKMARKS & NOTES
-- ============================================

CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'question', 'flashcard', 'clinical_case', 'topic', 'chapter')),
    content_id UUID NOT NULL,
    note TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE public.personal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL,
    content_html TEXT,
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    daily_reminder_time TIME NOT NULL DEFAULT '19:00',
    flashcard_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    streak_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_summary BOOLEAN NOT NULL DEFAULT TRUE,
    achievement_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    new_content_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.device_push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    device_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- ============================================
-- AI TUTOR
-- ============================================

CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    mode TEXT NOT NULL DEFAULT 'simple' CHECK (mode IN ('simple', 'mbbs', 'exam', 'viva', 'clinical')),
    context_subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    context_topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tokens_used INTEGER,
    model_used TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- OFFLINE SYNC
-- ============================================

CREATE TABLE public.sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    operation_type TEXT NOT NULL CHECK (operation_type IN ('create', 'update', 'delete')),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_academic_phase ON public.profiles(academic_phase);
CREATE INDEX idx_profiles_onboarding ON public.profiles(onboarding_completed);

-- Curriculum
CREATE INDEX idx_subjects_phase ON public.subjects(academic_phase_id, display_order);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id, display_order);
CREATE INDEX idx_topics_chapter ON public.topics(chapter_id, display_order);
CREATE INDEX idx_lessons_topic ON public.lessons(topic_id, display_order);

-- Questions
CREATE INDEX idx_questions_subject ON public.questions(subject_id, is_published);
CREATE INDEX idx_questions_topic ON public.questions(topic_id, is_published);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_question_options_question ON public.question_options(question_id, display_order);

-- Quizzes
CREATE INDEX idx_quizzes_subject ON public.quizzes(subject_id, is_published);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id, created_at DESC);
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id, user_id);
CREATE INDEX idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);

-- Flashcards
CREATE INDEX idx_flashcard_decks_user ON public.flashcard_decks(user_id);
CREATE INDEX idx_flashcards_deck ON public.flashcards(deck_id);
CREATE INDEX idx_flashcard_reviews_user_next ON public.flashcard_reviews(user_id, next_review_at) WHERE next_review_at <= NOW();
CREATE INDEX idx_flashcard_reviews_flashcard ON public.flashcard_reviews(flashcard_id, reviewed_at DESC);

-- Clinical Cases
CREATE INDEX idx_clinical_cases_subject ON public.clinical_cases(subject_id, is_published);
CREATE INDEX idx_clinical_cases_daily ON public.clinical_cases(is_daily_case, daily_case_date);
CREATE INDEX idx_user_case_attempts_user ON public.user_case_attempts(user_id, completed_at DESC);

-- Study Plans
CREATE INDEX idx_study_plans_user ON public.study_plans(user_id, is_active);
CREATE INDEX idx_study_plan_tasks_plan ON public.study_plan_tasks(plan_id, scheduled_date);
CREATE INDEX idx_study_plan_tasks_user_date ON public.study_plan_tasks(plan_id, scheduled_date, status);

-- Progress
CREATE INDEX idx_user_progress_user_subject ON public.user_progress(user_id, subject_id, progress_type);
CREATE INDEX idx_user_progress_topic ON public.user_progress(user_id, topic_id);
CREATE INDEX idx_daily_activity_user_date ON public.daily_activity(user_id, activity_date DESC);

-- Achievements
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id, unlocked_at DESC);

-- Bookmarks & Notes
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id, created_at DESC);
CREATE INDEX idx_personal_notes_user ON public.personal_notes(user_id, updated_at DESC);

-- AI
CREATE INDEX idx_ai_conversations_user ON public.ai_conversations(user_id, updated_at DESC);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id, created_at);

-- Sync
CREATE INDEX idx_sync_queue_user_status ON public.sync_queue(user_id, status, created_at);