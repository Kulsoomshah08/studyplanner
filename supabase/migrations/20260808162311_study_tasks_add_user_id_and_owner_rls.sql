/*
# Convert study_tasks to multi-user (owner-scoped) with auth

1. Schema Changes
- Add `user_id` column (uuid, NOT NULL, defaults to the authenticated user) to `study_tasks`.
- Add a foreign key from `study_tasks.user_id` to `auth.users(id)` with ON DELETE CASCADE, so deleting a user removes their tasks.
- Add an index on `user_id` for fast per-user queries.
2. Security Changes
- Row Level Security is already enabled on `study_tasks`; it stays enabled.
- Drop the previous single-tenant `anon_*` policies (they allowed public CRUD via the anon role).
- Create four new owner-scoped policies (SELECT / INSERT / UPDATE / DELETE) scoped `TO authenticated` using `auth.uid() = user_id`.
  - SELECT: users can only read their own tasks.
  - INSERT: WITH CHECK ensures the new row's user_id matches the authenticated user. The `DEFAULT auth.uid()` on the column means a client insert that omits user_id still satisfies this check.
  - UPDATE: USING + WITH CHECK both enforce ownership before and after the change.
  - DELETE: USING enforces ownership before deletion.
- After this migration, the `anon` role has NO access to `study_tasks`. Only authenticated users can access their own rows.
3. Data Notes
- The table currently has 0 rows, so adding a NOT NULL `user_id` column with a default is safe — there are no existing rows to backfill.
- No data is deleted or transformed.
*/

-- Add the owner column. Defaulting to auth.uid() means a client that omits user_id
-- on insert still gets the authenticated user's id filled in automatically.
ALTER TABLE study_tasks
  ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid()
  REFERENCES auth.users(id) ON DELETE CASCADE;

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS study_tasks_user_id_idx ON study_tasks(user_id);

-- Remove the old single-tenant policies
DROP POLICY IF EXISTS "anon_select_study_tasks" ON study_tasks;
DROP POLICY IF EXISTS "anon_insert_study_tasks" ON study_tasks;
DROP POLICY IF EXISTS "anon_update_study_tasks" ON study_tasks;
DROP POLICY IF EXISTS "anon_delete_study_tasks" ON study_tasks;

-- Owner-scoped SELECT: each user sees only their own tasks
DROP POLICY IF EXISTS "select_own_study_tasks" ON study_tasks;
CREATE POLICY "select_own_study_tasks"
  ON study_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Owner-scoped INSERT: new rows must belong to the authenticated user
DROP POLICY IF EXISTS "insert_own_study_tasks" ON study_tasks;
CREATE POLICY "insert_own_study_tasks"
  ON study_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Owner-scoped UPDATE: only own rows, and must stay owned by the same user
DROP POLICY IF EXISTS "update_own_study_tasks" ON study_tasks;
CREATE POLICY "update_own_study_tasks"
  ON study_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner-scoped DELETE: only own rows
DROP POLICY IF EXISTS "delete_own_study_tasks" ON study_tasks;
CREATE POLICY "delete_own_study_tasks"
  ON study_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
