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
  const { triggerKeyword, dmMessage, accessToken } = await getSettings()

  if (body.object === 'instagram') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'comments') {
          const comment = change.value
          const text = (comment.text || '').toLowerCase().trim()
          if (text.includes((triggerKeyword || 'AI').toLowerCase())) {
            await sendDM(comment.id, dmMessage, accessToken)
          }
        }
      }
    }
  }

  return NextResponse.json({ status: 'ok' })
}

async function sendDM(commentId, message, accessToken) {
  // Instagram private reply: DM the author of a comment (valid up to 7 days
  // after the comment). Uses the Instagram Login API host (graph.instagram.com).
  const res = await fetch(`https://graph.instagram.com/v21.0/me/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message: { text: message },
    }),
  })
  if (!res.ok) console.error('DM send failed:', await res.text())
}
