'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Conversation {
  id: string
  ig_sender_id: string
  ig_sender_name: string | null
  ig_sender_username: string | null
  last_message_at: string
  last_message_preview: string | null
  unread_count: number
  status: string
}

interface Message {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  is_ai_generated: boolean
  is_sent: boolean
  sent_at: string
}

interface Connection {
  ig_username: string | null
  ig_business_account_id: string
  token_expires_at: string | null
}

interface AgentConfig {
  mode: string
  brand_voice: string
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const MODE_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  auto:    { label: 'Auto', color: '#4ADE80', desc: 'AI replies instantly to all DMs' },
  suggest: { label: 'Suggest', color: '#F59E0B', desc: 'AI drafts replies for your review' },
  off:     { label: 'Off', color: '#6B7280', desc: 'No AI — you reply manually' },
}

export default function InboxPage() {
  const { slug } = useParams() as { slug: string }
  const searchParams = useSearchParams()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [connection, setConnection] = useState<Connection | null>(null)
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null)
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [savingMode, setSavingMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const igConnected = searchParams.get('ig_connected') === '1'

  useEffect(() => {
    fetch('/api/admin/instagram/conversations')
      .then(r => r.json())
      .then(d => {
        setConversations(d.conversations ?? [])
        setConnection(d.connection ?? null)
        setAgentConfig(d.agentConfig ?? null)
        setLoadingConvs(false)
      })
      .catch(() => setLoadingConvs(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function selectConversation(conv: Conversation) {
    setSelectedConv(conv)
    setLoadingMsgs(true)
    setMessages([])
    const res = await fetch(`/api/admin/instagram/messages?conversation_id=${conv.id}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
    setLoadingMsgs(false)
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c))
  }

  async function sendReply(messageId?: string, text?: string) {
    const content = text ?? replyText.trim()
    if (!content || !selectedConv) return
    setSending(true)

    await fetch('/api/admin/instagram/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selectedConv.id, message_id: messageId, text: content }),
    })

    setMessages(prev => messageId
      ? prev.map(m => m.id === messageId ? { ...m, is_sent: true } : m)
      : [...prev, {
          id: crypto.randomUUID(),
          direction: 'outbound',
          content,
          is_ai_generated: false,
          is_sent: true,
          sent_at: new Date().toISOString(),
        }]
    )
    setReplyText('')
    setSending(false)
  }

  async function updateMode(mode: string) {
    setSavingMode(true)
    await fetch('/api/admin/instagram/agent-config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
    setAgentConfig(prev => prev ? { ...prev, mode } : { mode, brand_voice: 'friendly, warm, and helpful' })
    setSavingMode(false)
  }

  // Not connected — show connect CTA
  if (!loadingConvs && !connection) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
        <div style={{ fontSize: 48 }}>📩</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Connect your Instagram</h2>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', maxWidth: 360, margin: 0 }}>
          Link your Instagram Business account to reply to DMs from your store — with AI drafting responses for you.
        </p>
        <a
          href={`/api/admin/instagram/connect?slug=${slug}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #F72585, #7209B7)',
            color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
          }}
        >
          <InstagramIcon /> Connect Instagram
        </a>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>
          Requires an Instagram Business account linked to a Facebook Page.
        </p>
      </div>
    )
  }

  const currentMode = agentConfig?.mode ?? 'suggest'
  const modeInfo = MODE_LABELS[currentMode]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', gap: 0 }}>

      {/* Left sidebar: conversation list */}
      <div style={{ width: 320, borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Instagram DMs</h2>
              {connection?.ig_username && (
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>@{connection.ig_username}</p>
              )}
            </div>
            <Link
              href={`/api/admin/instagram/disconnect`}
              onClick={async e => { e.preventDefault(); if (confirm('Disconnect Instagram?')) { await fetch('/api/admin/instagram/disconnect', { method: 'DELETE' }); setConnection(null) } }}
              style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'none' }}
            >
              Disconnect
            </Link>
          </div>

          {/* AI mode selector */}
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px', border: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontWeight: 600 }}>AI AGENT MODE</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.entries(MODE_LABELS).map(([mode, info]) => (
                <button
                  key={mode}
                  onClick={() => updateMode(mode)}
                  disabled={savingMode}
                  style={{
                    flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: `1.5px solid ${currentMode === mode ? info.color : '#E5E7EB'}`,
                    background: currentMode === mode ? `${info.color}15` : '#fff',
                    color: currentMode === mode ? info.color : '#9CA3AF',
                    transition: 'all 0.15s',
                  }}
                >
                  {info.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 10, color: '#9CA3AF', margin: '6px 0 0' }}>{modeInfo.desc}</p>
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {igConnected && conversations.length === 0 && !loadingConvs && (
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Instagram connected! DMs will appear here.</p>
            </div>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              style={{
                width: '100%', display: 'flex', gap: 12, padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                background: selectedConv?.id === conv.id ? '#FFF1F5' : 'transparent',
                border: 'none', borderBottom: '1px solid #F9FAFB',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: '#F472B6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>
                {(conv.ig_sender_username ?? conv.ig_sender_id).slice(0, 1).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.ig_sender_username ? `@${conv.ig_sender_username}` : conv.ig_sender_id.slice(0, 8)}
                  </span>
                  <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{timeAgo(conv.last_message_at)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {conv.last_message_preview ?? '...'}
                  </p>
                  {conv.unread_count > 0 && (
                    <span style={{ background: '#F72585', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 6px', marginLeft: 6, flexShrink: 0 }}>
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel: message thread */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedConv ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <span style={{ fontSize: 14 }}>Select a conversation to reply</span>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                {(selectedConv.ig_sender_username ?? selectedConv.ig_sender_id).slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                  {selectedConv.ig_sender_username ? `@${selectedConv.ig_sender_username}` : selectedConv.ig_sender_id.slice(0, 12)}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Instagram buyer</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loadingMsgs ? (
                <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Loading…</div>
              ) : messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.direction === 'inbound' ? 'row' : 'row-reverse', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{
                    maxWidth: '70%', padding: '10px 14px', borderRadius: msg.direction === 'inbound' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    background: msg.direction === 'inbound' ? '#F3F4F6' : (msg.is_ai_generated ? '#FFF1F5' : '#F72585'),
                    color: msg.direction === 'inbound' ? '#111827' : (msg.is_ai_generated ? '#9D174D' : '#fff'),
                    border: msg.is_ai_generated && msg.direction === 'outbound' ? '1.5px dashed #F9A8D4' : 'none',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    {msg.content}
                    {msg.is_ai_generated && !msg.is_sent && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 10, background: '#F9A8D4', color: '#9D174D', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>AI Draft</span>
                        <button
                          onClick={() => sendReply(msg.id, msg.content)}
                          disabled={sending}
                          style={{ fontSize: 10, background: '#F72585', color: '#fff', padding: '2px 10px', borderRadius: 99, border: 'none', cursor: 'pointer', fontWeight: 700 }}
                        >
                          Send
                        </button>
                        <button
                          onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                          style={{ fontSize: 10, background: '#F3F4F6', color: '#6B7280', padding: '2px 8px', borderRadius: 99, border: 'none', cursor: 'pointer' }}
                        >
                          Discard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                placeholder="Type a reply… (Enter to send)"
                rows={2}
                style={{
                  flex: 1, resize: 'none', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB',
                  fontSize: 13, outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
              <button
                onClick={() => sendReply()}
                disabled={!replyText.trim() || sending}
                style={{
                  padding: '10px 20px', borderRadius: 12, background: replyText.trim() ? '#F72585' : '#F3F4F6',
                  color: replyText.trim() ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 13, border: 'none',
                  cursor: replyText.trim() ? 'pointer' : 'default', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {sending ? '…' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}
