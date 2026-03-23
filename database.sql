-- Run this in your Supabase SQL Editor to create the appointments table

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Providers can view their own appointments
CREATE POLICY "Providers can view their own appointments" 
    ON public.appointments 
    FOR SELECT 
    USING (auth.uid() = profile_id);

-- Policy: Providers can update their own appointments
CREATE POLICY "Providers can update their own appointments" 
    ON public.appointments 
    FOR UPDATE 
    USING (auth.uid() = profile_id);

-- Policy: Providers can delete their own appointments
CREATE POLICY "Providers can delete their own appointments" 
    ON public.appointments 
    FOR DELETE 
    USING (auth.uid() = profile_id);

-- Note: The AI chat uses the service_role key, so it bypasses RLS and can insert freely.
