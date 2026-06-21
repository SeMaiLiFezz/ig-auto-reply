import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/store'

// Preview tool: shows whether the webhook has been called recently and what
// happened (keyword match + DM send result). Open in a browser to debug tests.
export async function GET() {
  const s = await getSettings()
  return NextResponse.json({
    configured: {
      triggerKeyword: s.triggerKeyword,
      dmMessageSet: !!s.dmMessage,
      accessTokenSet: !!s.accessToken,
      connectedUsername: s.connectedUsername || null,
    },
    lastWebhook: s.lastWebhook || 'No webhook events received yet.',
  })
}
