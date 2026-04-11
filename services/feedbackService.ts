/**
 * Feedback Service — Supabase REST API integration
 *
 * Submits user feedback signals (👍👎📌) with full RAG context
 * to a Supabase `generation_feedback` table for Bad Case analysis.
 *
 * DESIGN: Fire-and-forget. Never throws. User experience is never affected.
 */

import { FeedbackSignal, FeedbackContext } from '../types';

/**
 * Submit a feedback signal to Supabase.
 *
 * IMPORTANT: This function NEVER throws.
 * All failures are silently logged to console.
 */
export async function submitFeedback(
  signal: FeedbackSignal,
  context: FeedbackContext,
  supabaseUrl: string,
  supabaseAnonKey: string
): Promise<void> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Feedback] Supabase not configured, skipping feedback submission');
    return;
  }

  const cleanUrl = supabaseUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/v1/generation_feedback`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
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
