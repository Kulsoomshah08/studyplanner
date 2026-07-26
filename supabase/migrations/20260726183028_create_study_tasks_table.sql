/*
# Create study_tasks table (single-tenant, no auth)

1. New Tables
- `study_tasks`
  - `id` (uuid, primary key)
  - `title` (text, not null) - the name of the study task
  - `subject` (text, not null) - the subject/course the task belongs to
  - `priority` (text, not null) - 'low', 'medium', or 'high'
  - `due_date` (date, nullable) - when the task is due
  - `status` (text, not null, default 'todo') - 'todo', 'in-progress', or 'done'
  - `notes` (text, nullable) - optional extra details
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `study_tasks`.
- Allow anon + authenticated CRUD because this is a single-tenant app with no sign-in, so data is intentionally shared/public.
3. Notes
- No user_id column because the user did not request accounts/sign-in.
- Priority and status are constrained to fixed allowed values via CHECK constraints.
*/

CREATE TABLE IF NOT EXISTS study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date date,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_study_tasks" ON study_tasks;
CREATE POLICY "anon_select_study_tasks"
ON study_tasks FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_study_tasks" ON study_tasks;
CREATE POLICY "anon_insert_study_tasks"
ON study_tasks FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_study_tasks" ON study_tasks;
CREATE POLICY "anon_update_study_tasks"
ON study_tasks FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_study_tasks" ON study_tasks;
CREATE POLICY "anon_delete_study_tasks"
ON study_tasks FOR DELETE
TO anon, authenticated USING (true);
