/**
 * Feedback Service — Supabase REST API integration
 *
 * Submits user feedback signals (👍👎📌) with full RAG context
 * to a Supabase `generation_feedback` table for Bad Case analysis.
 *
 * DESIGN: Fire-and-forget. Never throws. User experience is never affected.
 *
 * CONFIG: Supabase credentials are read from Vite environment variables
 * (.env file, NOT committed to git). See .env.example for setup.
 */

import { FeedbackSignal, FeedbackContext } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Submit a feedback signal to Supabase.
 *
 * IMPORTANT: This function NEVER throws.
 * All failures are silently logged to console.
 */
export async function submitFeedback(
  signal: FeedbackSignal,
  context: FeedbackContext
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Feedback] Supabase not configured, skipping feedback submission');
    return;
  }

  const cleanUrl = SUPABASE_URL.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/v1/generation_feedback`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        signal_type: signal,
        user_query: context.userQuery,
        query_rewritten: context.queryRewritten,
        retrieved_knowledge: context.retrievedKnowledge,
        generated_theme: context.generatedOutput,
        model_name: context.modelName,
        mode: context.mode,
      }),
    });

    if (!response.ok) {
      console.warn(`[Feedback] Supabase returned ${response.status}: ${await response.text()}`);
    } else {
      console.log(`[Feedback] ✅ Signal "${signal}" submitted successfully`);
    }
  } catch (error) {
    console.warn('[Feedback] Submission failed (network error):', error);
  }
}
