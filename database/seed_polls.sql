-- Demo polls. Run after seed_users.sql because user_id references users(id).
-- Options are stored as a JSON array of strings; all polls stay open for the indicated
-- number of days from the time this seed runs.
INSERT INTO polls (id, user_id, title, options, poll_type, closing_date, comments)
VALUES
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9001',
    '9780bbca-382e-446e-bd23-2b252875e01e',
    'Which Seventeen title track are you replaying lately?',
    '["Super", "HOT", "Rock with you", "Very Nice"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    '[]'::json
),
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9002',
    '9294da19-6141-4af5-a07b-56d74e89a82a',
    'Pick the ultimate Stray Kids concert encore song',
    '["Haven", "Mixtape: Time Out", "Star Lost", "TOP"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '5 days',
    '[]'::json
),
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9003',
    '99b4e364-d1e2-4210-bfc5-c438fb164a7c',
    'Which comeback concept should TXT try next?',
    '["Retro city pop", "Dark fantasy", "Summer festival", "Rock band"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '10 days',
    '[]'::json
),
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9004',
    '14294cf1-0883-4b28-a765-3a6e3135afc3',
    'Which vocal collab would you most want to hear?',
    '["Wendy × Jungkook", "DK × Baekhyun", "IU × Rosé", "Taehyun × Seungmin"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '4 days',
    '[]'::json
),
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9005',
    'e87f9b3f-8cf1-4f5b-9881-92cb651cc8f5',
    'Choose the dance challenge you would learn first',
    '["WANNABE shoulder move", "Super Shy", "God''s Menu", "Magnetic"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '8 days',
    '[]'::json
),
(
    'b43f23e4-2e8a-47d8-94dd-70e074fd9006',
    'c2a81ad8-1d4c-4fbe-a8d3-2a3fcfc9be93',
    'What makes a K-pop album feel complete?',
    '["A standout title track", "A no-skip B-side run", "A cohesive concept", "Great physical inclusions"]'::jsonb,
    'single_choice',
    CURRENT_TIMESTAMP + INTERVAL '6 days',
    '[]'::json
)
ON CONFLICT (id) DO NOTHING;
