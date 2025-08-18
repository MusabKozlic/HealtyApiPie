-- Update existing user_id columns to use UUID instead of VARCHAR
-- This will work better with our users table

-- First, add the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth0_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth0_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow inserting new users (for registration)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true);

-- Update existing tables to use UUID for user_id and reference users table
-- Note: This assumes existing data can be migrated or is empty

-- Update recipes table
ALTER TABLE recipes ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE recipes ADD CONSTRAINT recipes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update user_saved_recipes table  
ALTER TABLE user_saved_recipes ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE user_saved_recipes ADD CONSTRAINT user_saved_recipes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update user_generation_limits table
ALTER TABLE user_generation_limits ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE user_generation_limits ADD CONSTRAINT user_generation_limits_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update RLS policies to work with the new user system
DROP POLICY IF EXISTS "Allow users to insert their own recipes" ON recipes;
DROP POLICY IF EXISTS "Allow users to update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can manage their own saved recipes" ON user_saved_recipes;
DROP POLICY IF EXISTS "Users can manage their own generation limits" ON user_generation_limits;

-- Create new RLS policies that work with the users table
CREATE POLICY "Allow users to insert their own recipes" ON recipes 
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE auth0_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Allow users to update their own recipes" ON recipes 
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users 
      WHERE auth0_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can manage their own saved recipes" ON user_saved_recipes 
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE auth0_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can manage their own generation limits" ON user_generation_limits 
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE auth0_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );
