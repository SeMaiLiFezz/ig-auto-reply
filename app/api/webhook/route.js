import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/store'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const { verifyToken } = await getSettings()

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req) {
  const body = await req.json()
  const { triggerKeyword, dmMessage, accessToken, accountId } = await getSettings()

  if (body.object === 'instagram') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'comments') {
          const comment = change.value
          const text = (comment.text || '').toLowerCase().trim()
          if (text.includes((triggerKeyword || 'AI').toLowerCase())) {
            await sendDM(comment.from.id, dmMessage, accountId, accessToken)
          }
        }
      }
    }
  }

  return NextResponse.json({ status: 'ok' })
}

async function sendDM(recipientId, message, accountId, accessToken) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${accountId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: message },
      messaging_type: 'RESPONSE',
    }),
  })
  if (!res.ok) console.error('DM send failed:', await res.text())
}
