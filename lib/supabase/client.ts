import { createClient } from '@supabase/supabase-js';

let client: any = null;

export function getSupabaseClient() {
  if (client) return client;
  
  client = createClient(
    'https://fpwdoqocxkuwoweaxyqz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd2RvcW9jeGt1d293ZWF4eXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NzM0NzYsImV4cCI6MjEwNDQ0OTQ3Nn0.-WxVNppCgH6LJVdT9B7FmXyn0f0aFuaIj_WE15Tfeoc'
  );
  
  return client;
}
