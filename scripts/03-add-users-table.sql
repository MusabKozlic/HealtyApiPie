-- Adding users table to store Auth0 user information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth0_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth0_id = auth.jwt() ->> 'sub');

-- Update existing tables to reference the users table
ALTER TABLE recipes 
  DROP CONSTRAINT IF EXISTS recipes_user_id_fkey,
  ADD CONSTRAINT recipes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_saved_recipes 
  DROP CONSTRAINT IF EXISTS user_saved_recipes_user_id_fkey,
  ADD CONSTRAINT user_saved_recipes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_generation_limits 
  DROP CONSTRAINT IF EXISTS user_generation_limits_user_id_fkey,
  ADD CONSTRAINT user_generation_limits_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
