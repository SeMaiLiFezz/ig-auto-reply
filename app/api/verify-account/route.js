import { NextResponse } from 'next/server'

export async function POST(req) {
  const { accessToken, accountId } = await req.json()

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${accountId}?fields=name,username,profile_picture_url&access_token=${accessToken}`
    )
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({
      username: data.username,
      name: data.name,
      profilePicture: data.profile_picture_url || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to verify account' }, { status: 500 })
  }
}
