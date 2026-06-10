import { get, getAll } from '@vercel/edge-config'

const DEFAULTS = {
  triggerKeyword: 'AI',
  dmMessage: '',
  accessToken: '',
  accountId: '',
  verifyToken: '',
  connectedUsername: '',
  connectedPicture: '',
}

const EDGE_CONFIG_ID = 'ecfg_6wwsc9jj3sjpe47bwxhixownrsij'
const TEAM_ID = 'team_Zid5NYEnzOZyOApnQFApTJOZ'

export async function getSettings() {
  try {
    const stored = await getAll([
      'triggerKeyword', 'dmMessage', 'accessToken',
      'accountId', 'verifyToken', 'connectedUsername', 'connectedPicture',
    ])
    return { ...DEFAULTS, ...(stored || {}) }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function saveSettings(data) {
  const token = process.env.VERCEL_API_TOKEN
  const items = Object.entries(data).map(([key, value]) => ({
    operation: 'upsert',
    key,
    value,
  }))

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items?teamId=${TEAM_ID}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to save settings: ${err}`)
  }
}
