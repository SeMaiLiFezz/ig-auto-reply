import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/store'

export async function GET() {
  const settings = await getSettings()
  const { accessToken, ...safe } = settings
  return NextResponse.json({ ...safe, hasToken: !!accessToken })
}

export async function POST(req) {
  const data = await req.json()
  await saveSettings(data)
  return NextResponse.json({ ok: true })
}
