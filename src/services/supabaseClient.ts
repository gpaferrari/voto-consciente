import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper para carregar dados do Supabase com fallback seguro para os JSONs locais
 */
export async function fetchWithFallback<T>(
  supabaseQuery: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<T> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackData;
  }

  try {
    const { data, error } = await supabaseQuery();
    if (error || !data) {
      console.warn('[Supabase] Erro ao carregar dados remotos, utilizando fallback local:', error?.message);
      return fallbackData;
    }
    return data;
  } catch (err: any) {
    console.warn('[Supabase] Falha de conexão, utilizando fallback local:', err?.message);
    return fallbackData;
  }
}
