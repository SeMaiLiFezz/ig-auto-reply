import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/store'

// Long-lived Instagram access tokens expire ~60 days after issue. This cron
// refreshes the stored token (Vercel cron schedule defined in vercel.json).
// A token must be at least 24h old and not yet expired to be refreshable.
export async function GET(req) {
  // Vercel sets this Authorization header on cron invocations.
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { accessToken } = await getSettings()
  if (!accessToken) {
    return NextResponse.json({ status: 'skipped', reason: 'no token stored' })
  }

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
  )
  const data = await res.json()

  if (!res.ok || !data.access_token) {
    console.error('Token refresh failed:', data)
    return NextResponse.json({ status: 'error', detail: data }, { status: 502 })
  }

  await saveSettings({ accessToken: data.access_token })
  return NextResponse.json({ status: 'ok', expires_in: data.expires_in })
}
