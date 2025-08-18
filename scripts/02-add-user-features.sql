-- Add user-specific columns to recipes table
ALTER TABLE recipes ADD COLUMN user_id VARCHAR(255);
ALTER TABLE recipes ADD COLUMN budget DECIMAL(10,2);

-- Create user_saved_recipes table for saved recipes
CREATE TABLE user_saved_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Create user_generation_limits table for daily limits
CREATE TABLE user_generation_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, generation_date)
);

-- Create indexes for performance
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_user_saved_recipes_user_id ON user_saved_recipes(user_id);
CREATE INDEX idx_user_generation_limits_user_date ON user_generation_limits(user_id, generation_date);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow all operations on recipes" ON recipes;

-- Allow anyone to read recipes (browse functionality)
CREATE POLICY "Allow read access to all recipes" ON recipes FOR SELECT USING (true);

-- Allow users to insert their own recipes
CREATE POLICY "Allow users to insert their own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own recipes
CREATE POLICY "Allow users to update their own recipes" ON recipes FOR UPDATE USING (auth.uid()::text = user_id);

-- RLS for user_saved_recipes
ALTER TABLE user_saved_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved recipes" ON user_saved_recipes USING (auth.uid()::text = user_id);

-- RLS for user_generation_limits
ALTER TABLE user_generation_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own generation limits" ON user_generation_limits USING (auth.uid()::text = user_id);
