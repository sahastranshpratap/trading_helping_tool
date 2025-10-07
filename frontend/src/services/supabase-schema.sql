-- Profiles Table (extends the default auth.users table)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  risk_tolerance TEXT,
  trading_experience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update only their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Trades Table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  entry_price DECIMAL(12, 4) NOT NULL,
  exit_price DECIMAL(12, 4),
  quantity DECIMAL(12, 4) NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  exit_date TIMESTAMP WITH TIME ZONE,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  notes TEXT,
  profit_loss DECIMAL(12, 4),
  screenshot_url TEXT,
  tags TEXT[],
  risk_reward_ratio DECIMAL(8, 4),
  setup_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Policy: Users can perform all actions on their own trades
CREATE POLICY "Users can view their own trades" 
  ON public.trades 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades" 
  ON public.trades 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
  ON public.trades 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" 
  ON public.trades 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Journals Table
CREATE TABLE IF NOT EXISTS public.journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('GREAT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE')),
  market_outlook TEXT,
  lessons_learned TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can perform all actions on their own journals
CREATE POLICY "Users can view their own journals" 
  ON public.journals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journals" 
  ON public.journals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals" 
  ON public.journals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" 
  ON public.journals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT DEFAULT 'light',
  notifications BOOLEAN DEFAULT true,
  default_trade_size DECIMAL(12, 4),
  default_risk_percentage DECIMAL(5, 2),
  chart_timeframe TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can perform all actions on their own settings
CREATE POLICY "Users can view their own settings" 
  ON public.settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'username', 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile and settings when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 