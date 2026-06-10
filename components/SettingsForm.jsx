'use client'
import { useState } from 'react'

const KEYWORD_PRESETS = ['AI', 'GUIDE', 'LINK', 'YES', 'FREE', 'INFO']

export default function SettingsForm({ initial }) {
  const [form, setForm] = useState({
    triggerKeyword: initial.triggerKeyword || 'AI',
    dmMessage: initial.dmMessage || '',
    accessToken: '',
    accountId: initial.accountId || '',
    verifyToken: initial.verifyToken || '',
  })
  const [account, setAccount] = useState(
    initial.connectedUsername ? { username: initial.connectedUsername, profilePicture: initial.connectedPicture } : null
  )
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : ''

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form }
      if (account) {
        payload.connectedUsername = account.username
        payload.connectedPicture = account.profilePicture || ''
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleVerify() {
    if (!form.accessToken || !form.accountId) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch('/api/verify-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: form.accessToken, accountId: form.accountId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAccount(data)
    } catch (err) {
      setError(err.message || 'Could not verify account')
      setAccount(null)
    } finally {
      setVerifying(false)
    }
  }

  function copyWebhook() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">IG Auto Reply</h1>
        </div>
        <p className="text-gray-400 text-sm">Comment → DM Automation Dashboard</p>
      </div>

      {/* Webhook URL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">Webhook URL</h2>
        <div className="flex gap-2">
          <input
            readOnly
            value={webhookUrl}
            className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm font-mono text-gray-500 border border-gray-100 select-all"
          />
          <button
            type="button"
            onClick={copyWebhook}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Paste this into your Meta Developer app → Webhooks</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Trigger Keyword */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">Trigger Keyword</h2>
          <input
            type="text"
            value={form.triggerKeyword}
            onChange={e => setForm({ ...form, triggerKeyword: e.target.value })}
            placeholder="e.g. AI"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {KEYWORD_PRESETS.map(kw => (
              <button
                key={kw}
                type="button"
                onClick={() => setForm({ ...form, triggerKeyword: kw })}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  form.triggerKeyword === kw
                    ? 'bg-purple-500 text-white border-purple-500 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-500'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* DM Message */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">DM Message</h2>
          <textarea
            value={form.dmMessage}
            onChange={e => setForm({ ...form, dmMessage: e.target.value })}
            placeholder="Here is your free guide: https://your-link.com"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1.5">{form.dmMessage.length} / 1000 characters</p>
        </div>

        {/* Verify Token */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">Webhook Verify Token</h2>
          <input
            type="text"
            value={form.verifyToken}
            onChange={e => setForm({ ...form, verifyToken: e.target.value })}
            placeholder="Any secret string, e.g. mysecret123"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1.5">Must match the verify token you set in your Meta app</p>
        </div>

        {/* Connected Account */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">Connected Account</h2>

          {account && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-4 border border-green-100">
              {account.profilePicture ? (
                <img src={account.profilePicture} alt="" className="w-10 h-10 rounded-full ring-2 ring-white shadow" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                  {account.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-sm">@{account.username}</p>
                <p className="text-xs text-green-600 font-medium">✓ Verified & connected</p>
              </div>
              <button
                type="button"
                onClick={() => setAccount(null)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600"
              >
                Change
              </button>
            </div>
          )}

          {!account && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Instagram Account ID</label>
                <input
                  type="text"
                  value={form.accountId}
                  onChange={e => setForm({ ...form, accountId: e.target.value })}
                  placeholder="Numeric IG Business Account ID"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Meta Access Token</label>
                <input
                  type="password"
                  value={form.accessToken}
                  onChange={e => setForm({ ...form, accessToken: e.target.value })}
                  placeholder="Your long-lived Meta access token"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleVerify}
                disabled={!form.accessToken || !form.accountId || verifying}
                className="w-full py-2.5 border-2 border-dashed border-purple-200 text-purple-500 rounded-xl text-sm font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {verifying ? 'Verifying...' : '+ Verify & Connect Account'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-purple-200 text-sm"
        >
          {saving ? 'Saving...' : saved ? '✓ Settings Saved!' : 'Save Settings'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-300 pb-4">IG Auto Reply · Powered by Meta Graph API</p>
    </div>
  )
}
