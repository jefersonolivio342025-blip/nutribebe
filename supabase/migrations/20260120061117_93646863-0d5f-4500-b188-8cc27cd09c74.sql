-- Create table for tracking conversion clicks
CREATE TABLE public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL DEFAULT 'paywall_click',
  source_page TEXT NOT NULL,
  button_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  is_premium BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can insert their own events
CREATE POLICY "Users can insert their own events"
ON public.conversion_events
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Only admins can view all events
CREATE POLICY "Admins can view all events"
ON public.conversion_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create index for analytics queries
CREATE INDEX idx_conversion_events_created_at ON public.conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_source_page ON public.conversion_events(source_page);