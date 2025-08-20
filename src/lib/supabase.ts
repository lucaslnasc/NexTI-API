import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://project-id.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('⚠️ Supabase environment variables not properly configured');
  console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  console.log('SUPABASE_KEY exists:', !!process.env.SUPABASE_KEY);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
