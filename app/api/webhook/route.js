import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/store'

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

  // Debug record so the user can preview activity at /api/debug (and Vercel logs).
  const debug = {
    receivedAt: new Date().toISOString(),
    object: body.object,
    fields: (body.entry || []).flatMap(e => (e.changes || []).map(c => c.field)),
    hasMessaging: (body.entry || []).some(e => Array.isArray(e.messaging)),
    raw: body,
    matched: false,
    commentText: null,
    dmResult: null,
  }
  console.log('Webhook received:', JSON.stringify(body))

  if (body.object === 'instagram') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'comments') {
          const comment = change.value
          const text = (comment.text || '').toLowerCase().trim()
          debug.commentText = comment.text || ''
          if (text.includes((triggerKeyword || 'AI').toLowerCase())) {
            debug.matched = true
            debug.dmResult = await sendDM(comment.id, dmMessage, accessToken)
          } else {
            debug.dmResult = `no keyword match (looking for "${triggerKeyword}")`
          }
        }
      }
    }
  }

  // Persist the last event for the debug viewer (best-effort).
  try {
    await saveSettings({ lastWebhook: debug })
  } catch (e) {
    console.error('Failed to save debug record:', e.message)
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
  const text = await res.text()
  if (!res.ok) {
    console.error('DM send failed:', text)
    return `ERROR ${res.status}: ${text}`
  }
  console.log('DM sent:', text)
  return `OK: ${text}`
}
