import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/store'

// ManyChat Dynamic Block endpoint
// ManyChat calls this URL to get the DM message content dynamically
export async function POST(req) {
  const { dmMessage } = await getSettings()

  return NextResponse.json({
    version: 'v2',
    content: {
      type: 'instagram_messages',
      messages: [
        {
          type: 'text',
          text: dmMessage || 'Thanks for commenting! Here is your guide.',
        },
      ],
      actions: [],
      quick_replies: [],
    },
  })
}

// ManyChat pings GET to verify the URL is reachable
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
