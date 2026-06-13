import { NextResponse } from 'next/server'

export async function POST(req) {
  const { accessToken, accountId } = await req.json()

  try {
    // Instagram Login API: the token identifies the account, so query /me.
    // accountId is accepted for backward-compat but not required.
    const res = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=user_id,username,name,profile_picture_url&access_token=${accessToken}`
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
