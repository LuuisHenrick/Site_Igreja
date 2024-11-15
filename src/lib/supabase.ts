import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeldwsuhspwoqlcsbjhw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGR3c3Voc3B3b3FsY3Niamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTU0MjMsImV4cCI6MjA0NzAzMTQyM30.Vf5sAxkzDSclEQQjKjeMDYIN0VHIjkhpUB82jThRDks';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});