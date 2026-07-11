import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase && ENV.supabaseUrl && ENV.supabaseAnonKey) {
    _supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey);
  }
  return _supabase;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin && ENV.supabaseUrl && ENV.supabaseServiceRoleKey) {
    _supabaseAdmin = createClient(ENV.supabaseUrl, ENV.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}
