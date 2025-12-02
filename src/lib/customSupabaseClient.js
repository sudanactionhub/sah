import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krziguirzqciqqjbstrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyemlndWlyenFjaXFxamJzdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MjE5NTAsImV4cCI6MjA3OTA5Nzk1MH0.FVm4vdxrmk_4jg8HBN7YjNCXfDVVrAcQn2gBwu1IrDc';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
