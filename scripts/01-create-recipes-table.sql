-- Create recipes table for storing generated recipes
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions TEXT NOT NULL,
  calories INTEGER,
  nutrition JSONB,
  category VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_language ON recipes(language);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- Enable Row Level Security (optional, for future user-specific recipes)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (can be restricted later)
CREATE POLICY "Allow all operations on recipes" ON recipes FOR ALL USING (true);
