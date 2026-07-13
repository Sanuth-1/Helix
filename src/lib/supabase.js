import { createClient } from "@supabase/supabase-js";

// Supabase anon key — safe to expose client-side; actual access is
// controlled by Row Level Security policies on the Supabase project.
const SUPABASE_URL = "https://pxnamwqazasxmrhiwiou.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmFtd3FhemFzeG1yaGl3aW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MDMxNDQsImV4cCI6MjA3NTA3OTE0NH0.ne-TXJk7i86k34qATD2lpA2IxdQ4hVWonuY7FMfxMIU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);