import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhkpssqjopqorujbjdws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoa3Bzc3Fqb3Bxb3J1amJqZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTE2NzMsImV4cCI6MjA3NDIyNzY3M30.QO-Wlyn57byLoyg5M2pKsJ-baOwf-g5QfOzIWuSCw_A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);