import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const url = 'https://igdswmsdtbaqvlycucum.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZHN3bXNkdGJhcXZseWN1Y3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3MzA2MTQsImV4cCI6MjA0MjMwNjYxNH0.Zk6JrobLHWFCnZYxewE10QDsI';
  return createClient(url, key);
}
