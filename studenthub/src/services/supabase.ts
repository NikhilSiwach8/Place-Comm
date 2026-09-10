import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Storage keys for in-browser credential persistence
const CUSTOM_URL_KEY = 'studenthub_custom_supabase_url';
const CUSTOM_ANON_KEY = 'studenthub_custom_supabase_anon_key';

/**
 * Normalizes any Supabase URL variant:
 * - Full URL: "https://npwkmxyrzzfaylbzwukm.supabase.co"
 * - Domain only: "npwkmxyrzzfaylbzwukm.supabase.co"
 * - Project ref only: "npwkmxyrzzfaylbzwukm"
 * - Quoted strings: "\"https://...\""
 */
export function normalizeSupabaseUrl(urlRaw?: string): string {
  if (!urlRaw) return '';
  let trimmed = urlRaw.trim().replace(/^["']|["']$/g, '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }
  if (trimmed.includes('.')) {
    return `https://${trimmed}`.replace(/\/+$/, '');
  }
  return `https://${trimmed}.supabase.co`;
}

/**
 * Strips quotes and whitespace from anon key
 */
export function sanitizeAnonKey(keyRaw?: string): string {
  if (!keyRaw) return '';
  return keyRaw.trim().replace(/^["']|["']$/g, '').trim();
}

/**
 * Security check: Detect if a service-role secret key was entered on the client
 */
export function containsServiceRolePayload(key: string): boolean {
  try {
    const parts = key.split('.');
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = atob(base64);
      const parsed = JSON.parse(jsonStr);
      if (parsed.role === 'service_role' || parsed.iss === 'supabase-service-role') {
        return true;
      }
    }
  } catch {
    // If not parseable as JWT, fall back to string check
  }
  return key.toLowerCase().includes('service_role');
}

/**
 * Retrieve raw environment variables safely across bundlers
 */
function getRawEnvVars() {
  const envUrl =
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || (import.meta.env as any).SUPABASE_URL)) ||
    (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    '';

  const envKey =
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).SUPABASE_ANON_KEY)) ||
    (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
    '';

  return { envUrl, envKey };
}

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  projectRef: string;
  isConfigured: boolean;
  isCustom: boolean;
  isServiceRole: boolean;
}

/**
 * Returns current effective configuration from environment or localStorage
 */
export function getActiveSupabaseConfig(): SupabaseConfigState {
  let customUrl = '';
  let customKey = '';
  if (typeof window !== 'undefined') {
    try {
      customUrl = localStorage.getItem(CUSTOM_URL_KEY) || '';
      customKey = localStorage.getItem(CUSTOM_ANON_KEY) || '';
    } catch {
      // ignore
    }
  }

  const { envUrl, envKey } = getRawEnvVars();

  const isCustom = Boolean(customUrl && customKey);
  const effectiveUrl = normalizeSupabaseUrl(isCustom ? customUrl : envUrl);
  const rawKey = isCustom ? customKey : envKey;
  const effectiveKey = sanitizeAnonKey(rawKey);
  const isServiceRole = containsServiceRolePayload(effectiveKey);

  let projectRef = '';
  try {
    if (effectiveUrl) {
      projectRef = new URL(effectiveUrl).hostname.split('.')[0] || '';
    }
  } catch {
    projectRef = '';
  }

  const isConfigured = Boolean(
    !isServiceRole &&
    effectiveUrl &&
    effectiveKey &&
    effectiveUrl.startsWith('https://') &&
    effectiveKey.length > 20
  );

  return {
    url: effectiveUrl,
    anonKey: isServiceRole ? '' : effectiveKey,
    projectRef,
    isConfigured,
    isCustom,
    isServiceRole,
  };
}

/**
 * Save user-provided Supabase credentials to localStorage for this browser session
 */
export function saveCustomSupabaseConfig(rawUrl: string, rawKey: string): { success: boolean; error?: string } {
  const normUrl = normalizeSupabaseUrl(rawUrl);
  const cleanKey = sanitizeAnonKey(rawKey);

  if (!normUrl || !normUrl.startsWith('https://')) {
    return { success: false, error: 'Invalid Supabase URL. Please provide a valid project URL like https://xyz.supabase.co' };
  }
  if (!cleanKey || cleanKey.length < 20) {
    return { success: false, error: 'Invalid anon public key. The key must be a valid Supabase anon key.' };
  }
  if (containsServiceRolePayload(cleanKey)) {
    return {
      success: false,
      error: 'CRITICAL: You entered a secret service_role key! Never enter the service_role key in the browser. Use your project anon public key instead.',
    };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_URL_KEY, normUrl);
    localStorage.setItem(CUSTOM_ANON_KEY, cleanKey);
  }

  // Invalidate cached client to force re-instantiation
  clientInstance = null;
  return { success: true };
}

/**
 * Reset to default environment configuration
 */
export function clearCustomSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CUSTOM_URL_KEY);
    localStorage.removeItem(CUSTOM_ANON_KEY);
  }
  clientInstance = null;
}

// Client singleton
let clientInstance: SupabaseClient | null = null;
let lastConfigHash: string = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getActiveSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const currentHash = `${config.url}::${config.anonKey}`;
  if (clientInstance && lastConfigHash === currentHash) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: {
          'x-client-info': 'studenthub-portal/1.2.0',
        },
      },
    });
    lastConfigHash = currentHash;
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    clientInstance = null;
    return null;
  }
}

// Proxy export so `supabase` always points to the active client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      return undefined;
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});

// Getter helpers for compatibility
export const supabaseUrl = getActiveSupabaseConfig().url;
export const supabaseAnonKey = getActiveSupabaseConfig().anonKey;
export const supabaseProjectRef = getActiveSupabaseConfig().projectRef;
export const isSupabaseConfigured = getActiveSupabaseConfig().isConfigured;

export interface ConnectionTestResult {
  success: boolean;
  timestamp: string;
  projectRef: string;
  url: string;
  latencyMs?: number;
  auth: {
    status: 'connected' | 'error' | 'unconfigured';
    message: string;
    hasActiveSession?: boolean;
    sessionUserEmail?: string;
  };
  database: {
    status: 'connected' | 'needs_schema' | 'error' | 'unconfigured';
    message: string;
    tablesFound?: string[];
  };
}

/**
 * Diagnostic utility to verify the Supabase client, auth endpoint, and database connectivity.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString();
  const config = getActiveSupabaseConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      timestamp,
      projectRef: config.projectRef || 'Not configured',
      url: config.url || 'No Supabase URL set',
      auth: {
        status: 'unconfigured',
        message: config.isServiceRole
          ? 'Service-role key entered. Please replace it with the public anon key.'
          : 'Supabase URL or Anon key is missing. Configure via Environment or Connection Settings.',
      },
      database: {
        status: 'unconfigured',
        message: 'Database query skipped because credentials are not configured.',
      },
    };
  }

  const startTime = performance.now();
  const result: ConnectionTestResult = {
    success: false,
    timestamp,
    projectRef: config.projectRef,
    url: config.url,
    auth: { status: 'error', message: 'Testing authentication service...' },
    database: { status: 'error', message: 'Testing database service...' },
  };

  const activeClient = getSupabaseClient();
  if (!activeClient) {
    result.auth.message = 'Supabase client instance could not be created.';
    result.database.message = 'Supabase client instance could not be created.';
    return result;
  }

  // 1. Verify Authentication Service
  try {
    const { data: sessionData, error: authError } = await activeClient.auth.getSession();
    if (authError) {
      result.auth = {
        status: 'error',
        message: `Auth API error: ${authError.message}`,
      };
    } else {
      result.auth = {
        status: 'connected',
        message: 'Auth service reachable & responding.',
        hasActiveSession: !!sessionData.session,
        sessionUserEmail: sessionData.session?.user?.email,
      };
    }
  } catch (err: any) {
    result.auth = {
      status: 'error',
      message: `Auth connection failed: ${err?.message || 'Network unreachable'}`,
    };
  }

  // 2. Verify Database PostgREST Service & Schema
  try {
    // Attempt querying public student_profiles or opportunities table
    const { data: tableData, error: dbError } = await activeClient
      .from('student_profiles')
      .select('id')
      .limit(1);

    if (dbError) {
      if (
        dbError.code === 'PGRST205' ||
        dbError.message?.includes('schema cache') ||
        dbError.message?.includes('Could not find the table') ||
        dbError.message?.includes('relation "public.student_profiles" does not exist')
      ) {
        result.database = {
          status: 'needs_schema',
          message: 'PostgreSQL instance is connected, but application tables have not been created yet in the public schema. Run schema.sql in your Supabase SQL editor.',
          tablesFound: [],
        };
      } else {
        // Table exists or permission check
        result.database = {
          status: 'connected',
          message: `Connected to PostgREST (${dbError.message})`,
        };
      }
    } else {
      result.database = {
        status: 'connected',
        message: `Database connected and operational (${tableData?.length ?? 0} profile records verified).`,
        tablesFound: ['student_profiles'],
      };
    }
  } catch (err: any) {
    result.database = {
      status: 'error',
      message: `Database query failed: ${err?.message || 'Network unreachable'}`,
    };
  }

  result.latencyMs = Math.round(performance.now() - startTime);
  result.success = result.auth.status === 'connected';

  return result;
}
