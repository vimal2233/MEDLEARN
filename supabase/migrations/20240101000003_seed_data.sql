-- MedLearn Seed Data
-- Academic phases, subjects, achievements, and system flashcard decks

-- ============================================
-- ACADEMIC PHASES
-- ============================================

INSERT INTO public.academic_phases (id, name, year_label, display_order, color, description) VALUES
('phase1', 'Phase 1', '1st Year', 1, '#E11D48', 'Foundation sciences: Anatomy, Physiology, Biochemistry'),
('phase2', 'Phase 2', '2nd Year', 2, '#0891B2', 'Para-clinical sciences: Pathology, Pharmacology, Microbiology, Forensic Medicine'),
('phase3a', 'Phase 3 Part 1', '3rd Year', 3, '#7C3AED', 'Clinical foundations: Community Medicine, ENT, Ophthalmology'),
('phase3b', 'Phase 3 Part 2', 'Final Year', 4, '#DC2626', 'Major clinical rotations: Medicine, Surgery, OBG, Pediatrics, Orthopedics, Psychiatry, Dermatology')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    year_label = EXCLUDED.year_label,
    display_order = EXCLUDED.display_order,
    color = EXCLUDED.color,
    description = EXCLUDED.description;

-- ============================================
-- SUBJECTS
-- ============================================

-- Phase 1 Subjects
INSERT INTO public.subjects (id, name, academic_phase_id, display_order, color, icon, description, total_topics, estimated_hours) VALUES
('anatomy', 'Anatomy', 'phase1', 1, '#E11D48', 'dna', 'Gross anatomy, histology, embryology, and neuroanatomy', 120, 200),
('physiology', 'Physiology', 'phase1', 2, '#0891B2', 'heart-pulse', 'Body functions and mechanisms at cellular and systems level', 95, 180),
('biochemistry', 'Biochemistry', 'phase1', 3, '#7C3AED', 'flask-conical', 'Chemical processes in living organisms', 80, 150)

-- Phase 2 Subjects
INSERT INTO public.subjects (id, name, academic_phase_id, display_order, color, icon, description, total_topics, estimated_hours) VALUES
('pathology', 'Pathology', 'phase2', 1, '#DC2626', 'virus', 'Disease mechanisms, systemic and general pathology', 150, 220),
('pharmacology', 'Pharmacology', 'phase2', 2, '#EA580C', 'pill', 'Drug actions, pharmacokinetics, and clinical pharmacology', 130, 180),
('microbiology', 'Microbiology', 'phase2', 3, '#16A34A', 'bacteria', 'Bacteriology, virology, mycology, parasitology, immunology', 110, 160),
('forensic', 'Forensic Medicine & Toxicology', 'phase2', 4, '#4338CA', 'scale-balance', 'Legal aspects of medicine, toxicology, and medical jurisprudence', 60, 80)

-- Phase 3a Subjects
INSERT INTO public.subjects (id, name, academic_phase_id, display_order, color, icon, description, total_topics, estimated_hours) VALUES
('community', 'Community Medicine', 'phase3a', 1, '#059669', 'earth', 'Public health, epidemiology, biostatistics, health systems', 90, 120),
('ent', 'ENT', 'phase3a', 2, '#D97706', 'ear-hearing', 'Ear, nose, throat diseases and surgeries', 50, 70),
('ophthalmology', 'Ophthalmology', 'phase3a', 3, '#0284C7', 'eye', 'Eye anatomy, diseases, and surgical procedures', 45, 70)

-- Phase 3b Subjects
INSERT INTO public.subjects (id, name, academic_phase_id, display_order, color, icon, description, total_topics, estimated_hours) VALUES
('medicine', 'General Medicine', 'phase3b', 1, '#BE185D', 'stethoscope', 'Internal medicine: cardiology, neurology, gastroenterology, etc.', 200, 300),
('surgery', 'General Surgery', 'phase3b', 2, '#C2410C', 'scalpel', 'Surgical principles, trauma, and specialty surgeries', 180, 250),
('obg', 'Obstetrics & Gynaecology', 'phase3b', 3, '#DB2777', 'baby', 'Pregnancy, childbirth, and female reproductive health', 120, 180),
('pediatrics', 'Pediatrics', 'phase3b', 4, '#F97316', 'child', 'Child health, development, and pediatric diseases', 100, 150),
('orthopedics', 'Orthopedics', 'phase3b', 5, '#65A30D', 'bone', 'Musculoskeletal system, trauma, and orthopedic surgeries', 80, 120),
('psychiatry', 'Psychiatry', 'phase3b', 6, '#A855F7', 'brain', 'Mental health disorders and their management', 50, 80),
('dermatology', 'Dermatology', 'phase3b', 7, '#EC4899', 'skin', 'Skin diseases, STDs, and dermatological procedures', 40, 60)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    academic_phase_id = EXCLUDED.academic_phase_id,
    display_order = EXCLUDED.display_order,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    total_topics = EXCLUDED.total_topics,
    estimated_hours = EXCLUDED.estimated_hours;

-- ============================================
-- CONTENT SOURCES
-- ============================================

INSERT INTO public.content_sources (id, name, type, reference, url, credibility_score) VALUES
('bd-chaurasia', 'BD Chaurasia Human Anatomy', 'textbook', 'BD Chaurasia, 8th Edition', null, 9),
('gray-anatomy', 'Gray''s Anatomy for Students', 'textbook', 'Drake et al., 4th Edition', null, 10),
('ganong', 'Ganong''s Review of Medical Physiology', 'textbook', 'Barrett et al., 26th Edition', null, 9),
('guyton', 'Guyton and Hall Textbook of Medical Physiology', 'textbook', 'Hall, 14th Edition', null, 10),
('harper', 'Harper''s Illustrated Biochemistry', 'textbook', 'Rodwell et al., 31st Edition', null, 9),
('lippincott-biochem', 'Lippincott''s Illustrated Reviews: Biochemistry', 'textbook', 'Ferrier, 7th Edition', null, 9),
('robbins', 'Robbins Basic Pathology', 'textbook', 'Kumar et al., 10th Edition', null, 10),
('harsh-mohan', 'Textbook of Pathology by Harsh Mohan', 'textbook', 'Harsh Mohan, 8th Edition', null, 9),
('kd-tripathi', 'Essentials of Medical Pharmacology', 'textbook', 'KD Tripathi, 8th Edition', null, 9),
('katzung', 'Basic & Clinical Pharmacology', 'textbook', 'Katzung, 15th Edition', null, 10),
('anathanarayanan', 'Textbook of Microbiology', 'textbook', 'Ananthanarayan & Paniker, 11th Edition', null, 9),
('parikh', 'Parikh''s Textbook of Medical Jurisprudence', 'textbook', 'Parikh, 7th Edition', null, 9),
('park', 'Park''s Textbook of Preventive and Social Medicine', 'textbook', 'Park, 27th Edition', null, 10),
('harrison', 'Harrison''s Principles of Internal Medicine', 'textbook', 'Loscalzo et al., 21st Edition', null, 10),
('bailey-love', 'Bailey & Love''s Short Practice of Surgery', 'textbook', 'Williams et al., 28th Edition', null, 10),
('dc-dutta', 'DC Dutta''s Textbook of Obstetrics', 'textbook', 'DC Dutta, 9th Edition', null, 9),
('op-ghai', 'Ghai Essential Pediatrics', 'textbook', 'Ghai, 9th Edition', null, 9),
('maheshwari', 'Essential Orthopaedics', 'textbook', 'Maheshwari, 6th Edition', null, 8),
('ahmed', 'Ahmed''s Essentials of Psychiatry', 'textbook', 'Ahmed, 2nd Edition', null, 8),
('roxburgh', 'Roxburgh''s Common Skin Diseases', 'textbook', 'Roxburgh, 19th Edition', null, 8)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ACHIEVEMENTS
-- ============================================

INSERT INTO public.achievements (id, name, description, icon, color, category, requirement_type, requirement_value, xp_reward) VALUES
-- Learning achievements
('first_lesson', 'First Steps', 'Complete your first lesson', 'play-circle', '#1A6BB8', 'learning', 'lessons_completed', '{"count": 1}', 50),
('lesson_10', 'Getting Started', 'Complete 10 lessons', 'book-open', '#14C9B0', 'learning', 'lessons_completed', '{"count": 10}', 100),
('lesson_50', 'Dedicated Learner', 'Complete 50 lessons', 'book', '#0891B2', 'learning', 'lessons_completed', '{"count": 50}', 250),
('lesson_100', 'Knowledge Seeker', 'Complete 100 lessons', 'graduation-cap', '#7C3AED', 'learning', 'lessons_completed', '{"count": 100}', 500),
('subject_master_anatomy', 'Anatomy Explorer', 'Complete all Anatomy topics', 'dna', '#E11D48', 'learning', 'subject_completed', '{"subject": "anatomy"}', 1000),
('subject_master_physiology', 'Physiology Pro', 'Complete all Physiology topics', 'heart-pulse', '#0891B2', 'learning', 'subject_completed', '{"subject": "physiology"}', 1000),
('subject_master_biochemistry', 'Biochemistry Brain', 'Complete all Biochemistry topics', 'flask-conical', '#7C3AED', 'learning', 'subject_completed', '{"subject": "biochemistry"}', 1000),

-- Streak achievements
('streak_3', 'Three Day Streak', 'Maintain a 3-day learning streak', 'zap', '#F59E0B', 'streak', 'streak_days', '{"count": 3}', 100),
('streak_7', 'Week Warrior', 'Maintain a 7-day learning streak', 'zap', '#EF4444', 'streak', 'streak_days', '{"count": 7}', 250),
('streak_14', 'Fortnight Fighter', 'Maintain a 14-day learning streak', 'calendar', '#DC2626', 'streak', 'streak_days', '{"count": 14}', 500),
('streak_30', 'Monthly Master', 'Maintain a 30-day learning streak', 'calendar', '#7C3AED', 'streak', 'streak_days', '{"count": 30}', 1000),
('streak_60', 'Habit Former', 'Maintain a 60-day learning streak', 'trophy', '#A855F7', 'streak', 'streak_days', '{"count": 60}', 2000),
('streak_100', 'Centurion', 'Maintain a 100-day learning streak', 'crown', '#F59E0B', 'streak', 'streak_days', '{"count": 100}', 5000),

-- Quiz achievements
('first_quiz', 'Quiz Novice', 'Complete your first quiz', 'quiz', '#1A6BB8', 'quiz', 'quizzes_completed', '{"count": 1}', 50),
('quiz_10', 'Quiz Taker', 'Complete 10 quizzes', 'help-circle', '#14C9B0', 'quiz', 'quizzes_completed', '{"count": 10}', 150),
('quiz_50', 'Quiz Enthusiast', 'Complete 50 quizzes', 'check-circle', '#0891B2', 'quiz', 'quizzes_completed', '{"count": 50}', 300),
('mcq_100', 'Quiz Master', 'Answer 100 MCQs correctly', 'target', '#7C3AED', 'quiz', 'correct_answers', '{"count": 100}', 500),
('mcq_500', 'MCQ Machine', 'Answer 500 MCQs correctly', 'target', '#DC2626', 'quiz', 'correct_answers', '{"count": 500}', 1000),
('mcq_1000', 'Question Conqueror', 'Answer 1000 MCQs correctly', 'trophy', '#A855F7', 'quiz', 'correct_answers', '{"count": 1000}', 2000),
('perfect_score', 'Perfectionist', 'Score 100% on any quiz', 'star', '#F59E0B', 'quiz', 'perfect_quiz', '{"count": 1}', 300),
('mock_exam', 'Exam Ready', 'Complete a full mock exam', 'clipboard-check', '#16A34A', 'quiz', 'mock_exams_completed', '{"count": 1}', 500),

-- Flashcard achievements
('flashcard_10', 'Card Collector', 'Review 10 flashcards', 'card', '#1A6BB8', 'flashcard', 'flashcards_reviewed', '{"count": 10}', 50),
('flashcard_50', 'Spaced Repetition Rookie', 'Review 50 flashcards', 'card', '#14C9B0', 'flashcard', 'flashcards_reviewed', '{"count": 50}', 150),
('flashcard_100', 'Memory Builder', 'Review 100 flashcards', 'card', '#0891B2', 'flashcard', 'flashcards_reviewed', '{"count": 100}', 300),
('flashcard_500', 'Retention Master', 'Review 500 flashcards', 'refresh-cw', '#7C3AED', 'flashcard', 'flashcards_reviewed', '{"count": 500}', 1000),
('flashcard_1000', 'Flashcard Champion', 'Review 1000 flashcards', 'award', '#A855F7', 'flashcard', 'flashcards_reviewed', '{"count": 1000}', 2000),
('mastered_100', 'Mastery Seeker', 'Master 100 flashcards', 'check-circle', '#22C55E', 'flashcard', 'flashcards_mastered', '{"count": 100}', 500),
('mastered_500', 'Revision Champion', 'Master 500 flashcards', 'refresh-cw', '#16A34A', 'flashcard', 'flashcards_mastered', '{"count": 500}', 1500),

-- Clinical case achievements
('first_case', 'Clinical Debut', 'Complete your first clinical case', 'stethoscope', '#1A6BB8', 'clinical', 'cases_completed', '{"count": 1}', 100),
('case_5', 'Case Solver', 'Complete 5 clinical cases', 'clipboard-list', '#14C9B0', 'clinical', 'cases_completed', '{"count": 5}', 300),
('case_10', 'Clinical Thinker', 'Complete 10 clinical cases', 'brain', '#0891B2', 'clinical', 'cases_completed', '{"count": 10}', 500),
('case_25', 'Diagnostic Ace', 'Complete 25 clinical cases', 'search', '#7C3AED', 'clinical', 'cases_completed', '{"count": 25}', 1000),

-- Viva achievements
('viva_10', 'Viva Practice', 'Complete 10 viva questions', 'mic', '#DC2626', 'special', 'viva_questions', '{"count": 10}', 200),
('viva_50', 'Oral Exam Ready', 'Complete 50 viva questions', 'message-circle', '#A855F7', 'special', 'viva_questions', '{"count": 50}', 500),

-- Milestone achievements
('xp_1000', 'Rising Star', 'Earn 1,000 XP', 'star', '#F59E0B', 'milestone', 'total_xp', '{"count": 1000}', 200),
('xp_5000', 'Scholar', 'Earn 5,000 XP', 'star', '#EF4444', 'milestone', 'total_xp', '{"count": 5000}', 500),
('xp_10000', 'Academic', 'Earn 10,000 XP', 'trophy', '#DC2626', 'milestone', 'total_xp', '{"count": 10000}', 1000),
('xp_25000', 'Expert', 'Earn 25,000 XP', 'crown', '#7C3AED', 'milestone', 'total_xp', '{"count": 25000}', 2500),
('study_10h', 'Dedicated', 'Study for 10 hours total', 'timer', '#1A6BB8', 'milestone', 'study_time_hours', '{"count": 10}', 200),
('study_50h', 'Marathoner', 'Study for 50 hours total', 'timer', '#14C9B0', 'milestone', 'study_time_hours', '{"count": 50}', 500),
('study_100h', 'Scholar', 'Study for 100 hours total', 'graduation-cap', '#0891B2', 'milestone', 'study_time_hours', '{"count": 100}', 1000),

-- Special achievements
('early_bird', 'Early Bird', 'Study before 7 AM', 'sunrise', '#F59E0B', 'special', 'early_study', '{"count": 1}', 100),
('night_owl', 'Night Owl', 'Study after 11 PM', 'moon', '#7C3AED', 'special', 'late_study', '{"count": 1}', 100),
('weekend_warrior', 'Weekend Warrior', 'Study on 10 weekends', 'calendar', '#16A34A', 'special', 'weekend_study', '{"count": 10}', 300),
('all_phase1', 'Phase 1 Complete', 'Complete all Phase 1 subjects', 'flag', '#E11D48', 'special', 'phase_completed', '{"phase": "phase1"}', 2000),
('all_phase2', 'Phase 2 Complete', 'Complete all Phase 2 subjects', 'flag', '#0891B2', 'special', 'phase_completed', '{"phase": "phase2"}', 3000),
('all_phase3', 'Phase 3 Complete', 'Complete all Phase 3 subjects', 'flag', '#DC2626', 'special', 'phase_completed', '{"phase": "phase3b"}', 5000),
('medlearn_graduate', 'MedLearn Graduate', 'Complete the entire MBBS curriculum', 'graduation-cap', '#A855F7', 'special', 'curriculum_completed', '{}', 10000)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    category = EXCLUDED.category,
    requirement_type = EXCLUDED.requirement_type,
    requirement_value = EXCLUDED.requirement_value,
    xp_reward = EXCLUDED.xp_reward;

-- ============================================
-- SYSTEM FLASHCARD DECKS (created for each subject)
-- These will be populated via application logic or admin interface
-- ============================================

-- Placeholder for system deck creation - actual cards added via content management
-- The application will create these on first run for each user

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify academic phases
-- SELECT * FROM public.academic_phases ORDER BY display_order;

-- Verify subjects
-- SELECT s.*, ap.name as phase_name FROM public.subjects s
-- JOIN public.academic_phases ap ON s.academic_phase_id = ap.id
-- ORDER BY ap.display_order, s.display_order;

-- Verify achievements
-- SELECT * FROM public.achievements ORDER BY category, xp_reward;