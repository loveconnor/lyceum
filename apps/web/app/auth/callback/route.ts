import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists, if not create it
      const userId = data.user.id
      const email = data.user.email || ''
      const fullName = data.user.user_metadata?.full_name || ''
      const firstName = data.user.user_metadata?.first_name || fullName.split(' ')[0] || ''
      const lastName = data.user.user_metadata?.last_name || fullName.split(' ').slice(1).join(' ') || ''
      const avatarUrl = data.user.user_metadata?.avatar_url || null

      try {
        // Use service role to check and create profile if needed
        const admin = createAdminClient()
        const { data: existingProfile } = await admin
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()

        if (!existingProfile) {
          await admin.from('profiles').insert({
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName || null,
            avatar_url: avatarUrl,
            onboarding_complete: false,
            onboarding_data: null,
          })
        }
      } catch (error) {
        console.error('Error creating OAuth profile:', error)
        // Continue anyway - the auth is successful
      }

      return NextResponse.redirect(`${origin}/`)
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
}
