import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Ensure profile exists on fresh signup. Duplicate key errors are intentionally
      // silenced below (profile may already exist if the user signed up before hitting
      // the callback), but genuine DB errors are now logged.
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ 
            id: data.user.id, 
            display_name: data.user.email?.split('@')[0] || 'Unknown',
            slug: data.user.id.substring(0, 8) 
        })
        .select()
        .single();

      // FIX: Log insert errors that are NOT duplicate-key violations (code 23505).
      // Previously all errors were silently ignored, hiding real DB problems.
      if (insertError && insertError.code !== '23505') {
        console.error('[/auth/callback] Profile insert error:', insertError);
      }
        
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // FIX: Previously redirected to `/auth/auth-code-error` which does not exist
  // in this codebase, resulting in a 404 on login failure. Now redirects to
  // /login with an error query param that the login page can display.
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
