import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // FIX: Replaced supabase.auth.getSession() with supabase.auth.getUser().
  // getSession() reads the session from the cookie without server-side
  // verification and can return a stale or forged session. getUser() always
  // performs a network round-trip to the Supabase Auth server to confirm the
  // session is valid, which is the correct approach per Supabase security docs.
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
