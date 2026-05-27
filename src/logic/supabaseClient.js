import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ntuqdyhnzppntjqnsbcv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dXFkeWhuenBwbnRqcW5zYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjE4NTIsImV4cCI6MjA5NDczNzg1Mn0.SyfNnQ4OhD33iaw51FJ5i2T-tlmDPZe-aYK0HS-5tEQ';

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
    }
} else {
    console.info("Supabase credentials not configured. Online multiplayer is disabled (Running in local PVP mode).");
}

export const supabase = supabaseInstance;
