import { anthropic } from '@ai-sdk/anthropic';
import { streamText, Message, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { chatRateLimit } from '@/lib/rateLimit';

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rl = chatRateLimit(ip);
  if (!rl.allowed) {
    const retryAfterSecs = Math.ceil((rl.resetAt - Date.now()) / 1_000);
    return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } });
  }

  try {
    const { messages, profileId, conversationId } = await req.json();

    if (!profileId) return new Response('Missing profileId', { status: 400 });
    if (!conversationId) return new Response('Missing conversationId', { status: 400 });

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (!profile) return new Response('Profile not found', { status: 404 });
    
    // Securely hydrate past context from the database
    let verifiedMessages = [...messages];
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('transcript')
        .eq('id', conversationId)
        .single();
    
    if (existingConv && existingConv.transcript) {
        // We only trust the latest user message from the client payload
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
            verifiedMessages = [...existingConv.transcript, lastMessage];
        } else {
            verifiedMessages = existingConv.transcript;
        }
    }

    const companionName = profile.display_name || 'the VIP companion';
    const personaTone = profile.persona_tone || 'professional';
    const rates = profile.rates || {};
    const schedule = profile.schedule || {};
    const screeningReqs = profile.screening_reqs || [];
    const depositRequired = profile.deposit_required;
    const depositAmount = profile.deposit_amount;
    const hardLimits = profile.hard_limits || 'None specified.';
    const customScript = profile.custom_script || '';
    const serviceArea = profile.service_area || 'Not specified';

    const systemPrompt = `You are the exclusive personal booking assistant for ${companionName}.
Tone: ${personaTone}
Service Area: ${serviceArea}

CRITICAL RULES:
1. If the user asks "are you an AI?" or similar, you MUST respond exactly: "I'm ${companionName}'s scheduling assistant — I handle all her initial enquiries."
2. NEVER deviate from the rates or availability below.
3. DO NOT offer services listed in Hard Limits.
4. Your goal is to guide the user through the Conversation Flow step-by-step. Keep responses concise (1-2 sentences).

--- PROVIDER DATA ---
Rates: Hourly: ${rates.hourly || 'N/A'}, Multi-hour: ${rates.multi_hour || 'N/A'}, Overnight: ${rates.overnight || 'N/A'}
Schedule (Availability): ${JSON.stringify(schedule)}
Hard Limits (Do not offer): ${hardLimits}
Screening Requirements: ${screeningReqs.join(', ') || 'None'}
Deposit: ${depositRequired ? `Yes, $${depositAmount}` : 'No deposit required'}
Custom Script / Rules: ${customScript}
---------------------

CONVERSATION FLOW:
1. Warm greeting using the provider's tone. Collect client's first name.
2. Screening Phase: Ask for EACH verification item required in "Screening Requirements". Ask them one by one, not all at once.
3. Qualification Phase: Confirm requested date/time against Schedule, duration, and budget against Rates.
4. If qualified -> Tell them you will notify ${companionName} for manual confirmation. Provide deposit instructions if a deposit is required.
5. If not qualified or violates Hard Limits -> Decline warmly and gracefully.

Please ensure you strictly follow the flow and tone. DO NOT give away all information at once.`;

    const result = await streamText({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model: anthropic(process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022') as any,
      system: systemPrompt,
      messages: verifiedMessages,
      tools: {
        book_appointment: tool({
          description: 'Request to book an appointment. ONLY use this when the user has provided a specific date, start time, end time, and meets all screening and deposit requirements.',
          parameters: z.object({
            client_name: z.string().describe('The name of the client booking the appointment'),
            start_time: z.string().describe('ISO timestamp for the start of the appointment'),
            end_time: z.string().describe('ISO timestamp for the end of the appointment'),
          }),
          execute: async ({ client_name, start_time, end_time }) => {
            const { error } = await supabase.from('appointments').insert({
              profile_id: profileId,
              client_name,
              start_time,
              end_time,
              status: 'pending'
            });
            if (error) {
              console.error('Booking tool error:', error);
              return { success: false, message: 'Failed to request appointment due to an internal error.' };
            }
            return { success: true, message: 'Appointment requested successfully! State that it is pending manual review.' };
          }
        })
      },
      onFinish: async ({ text, toolCalls }) => {
        // We append the assistant response. For tool calls, the AI JS SDK includes them correctly in `messages`, but we simplify here.
        // Let's store the raw text as well. In a fully robust system, we would store the whole objects.
        const fullTranscript = [...verifiedMessages, { role: 'assistant', content: text || (toolCalls && toolCalls.length > 0 ? "Called booking tool." : "") }];
        
        let inferredName = "Client";
        const userMessages = fullTranscript.filter((m: Message) => m.role === 'user');
        if (userMessages.length > 0) {
           const firstMsg = userMessages[0].content;
           const nameMatch = firstMsg.match(/i am ([a-z]+)|i'm ([a-z]+)|my name is ([a-z]+)/i);
           if (nameMatch) inferredName = nameMatch[1] || nameMatch[2] || nameMatch[3];
        }

        // Use upsert to create or update the conversation
        await supabase.from('conversations').upsert({
            id: conversationId,
            profile_id: profileId,
            client_name: inferredName,
            status: "Booking Requested",
            transcript: fullTranscript
        });
      }
    });

    return result.toDataStreamResponse({
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.resetAt),
      },
    });
  } catch (err: unknown) {
    console.error("Chat API Error:", err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
