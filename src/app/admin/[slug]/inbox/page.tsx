'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Channel = 'instagram' | 'messenger' | 'whatsapp'
type ChannelFilter = 'all' | Channel

// Unified shape so IG, Messenger, and WhatsApp conversations render in one
// list — Instagram/Messenger come from the instagram_* tables (tagged with a
// channel column), WhatsApp from its own tables.
interface UnifiedConversation {
  id: string
  channel: Channel
  sender_id: string
  sender_name: string | null
  last_message_at: string
  last_message_preview: string | null
  unread_count: number
}

interface Message {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  is_ai_generated: boolean
  is_sent: boolean
  sent_at: string
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
  auto:    { label: 'Auto', color: '#4ADE80', desc: 'AI replies instantly' },
  suggest: { label: 'Suggest', color: '#F59E0B', desc: 'AI drafts replies for your review' },
  off:     { label: 'Off', color: '#6B7280', desc: 'No AI — you reply manually' },
}

const CHANNEL_META: Record<Channel, { label: string; color: string; icon: string }> = {
  instagram: { label: 'Instagram', color: '#F72585', icon: '📷' },
  messenger: { label: 'Messenger', color: '#0084FF', icon: '💬' },
  whatsapp:  { label: 'WhatsApp', color: '#25D366', icon: '📱' },
}

// Which admin API a conversation's channel routes to
function apiBase(channel: Channel) {
  return channel === 'whatsapp' ? '/api/admin/whatsapp' : '/api/admin/instagram'
}

export default function InboxPage() {
  const { slug } = useParams() as { slug: string }
  const searchParams = useSearchParams()

  const [conversations, setConversations] = useState<UnifiedConversation[]>([])
  const [igConnected, setIgConnected] = useState<{ ig_username: string | null } | null>(null)
  const [waConnected, setWaConnected] = useState<{ display_number: string | null } | null>(null)
  const [igAgentConfig, setIgAgentConfig] = useState<AgentConfig | null>(null)
  const [waAgentConfig, setWaAgentConfig] = useState<AgentConfig | null>(null)
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all')
  const [selectedConv, setSelectedConv] = useState<UnifiedConversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [savingMode, setSavingMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const justConnectedIg = searchParams.get('ig_connected') === '1'

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/instagram/conversations').then(r => r.json()).catch(() => null),
      fetch('/api/admin/whatsapp/conversations').then(r => r.json()).catch(() => null),
    ]).then(([ig, wa]) => {
      const igConvs: UnifiedConversation[] = (ig?.conversations ?? []).map((c: { id: string; channel?: Channel; ig_sender_id: string; ig_sender_username: string | null; last_message_at: string; last_message_preview: string | null; unread_count: number }) => ({
        id: c.id,
        channel: c.channel ?? 'instagram',
        sender_id: c.ig_sender_id,
        sender_name: c.ig_sender_username ? `@${c.ig_sender_username}` : null,
        last_message_at: c.last_message_at,
        last_message_preview: c.last_message_preview,
        unread_count: c.unread_count,
      }))
      const waConvs: UnifiedConversation[] = (wa?.conversations ?? []).map((c: { id: string; buyer_phone: string; buyer_name: string | null; last_message_at: string; last_message_preview: string | null; unread_count: number }) => ({
        id: c.id,
        channel: 'whatsapp' as const,
        sender_id: c.buyer_phone,
        sender_name: c.buyer_name,
        last_message_at: c.last_message_at,
        last_message_preview: c.last_message_preview,
        unread_count: c.unread_count,
      }))

      setConversations([...igConvs, ...waConvs].sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()))
      setIgConnected(ig?.connection ?? null)
      setWaConnected(wa?.connection ?? null)
      setIgAgentConfig(ig?.agentConfig ?? null)
      setWaAgentConfig(wa?.agentConfig ?? null)
      setLoadingConvs(false)
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredConversations = conversations.filter(c => channelFilter === 'all' || c.channel === channelFilter)

  async function selectConversation(conv: UnifiedConversation) {
    setSelectedConv(conv)
    setLoadingMsgs(true)
    setMessages([])
    const res = await fetch(`${apiBase(conv.channel)}/messages?conversation_id=${conv.id}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
    setLoadingMsgs(false)
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c))
  }

  async function sendReply(messageId?: string, text?: string) {
    const content = text ?? replyText.trim()
    if (!content || !selectedConv) return
    setSending(true)

    await fetch(`${apiBase(selectedConv.channel)}/messages`, {
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

  async function updateMode(channel: 'instagram' | 'whatsapp', mode: string) {
    setSavingMode(true)
    await fetch(`${apiBase(channel)}/agent-config`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
    if (channel === 'whatsapp') {
      setWaAgentConfig(prev => prev ? { ...prev, mode } : { mode, brand_voice: 'friendly, warm, and helpful' })
    } else {
      setIgAgentConfig(prev => prev ? { ...prev, mode } : { mode, brand_voice: 'friendly, warm, and helpful' })
    }
    setSavingMode(false)
  }

  const selectedChannelMeta = selectedConv ? CHANNEL_META[selectedConv.channel] : null

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', gap: 0 }}>

      {/* Left sidebar: conversation list */}
      <div style={{ width: 340, borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Inbox</h2>

          {/* Channel tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {(['all', 'instagram', 'messenger', 'whatsapp'] as ChannelFilter[]).map(ch => {
              const meta = ch === 'all' ? { label: 'All', color: '#111827', icon: '' } : CHANNEL_META[ch]
              const count = ch === 'all' ? conversations.length : conversations.filter(c => c.channel === ch).length
              return (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  style={{
                    flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: `1.5px solid ${channelFilter === ch ? meta.color : '#E5E7EB'}`,
                    background: channelFilter === ch ? `${meta.color}15` : '#fff',
                    color: channelFilter === ch ? meta.color : '#9CA3AF',
                  }}
                >
                  {meta.icon} {meta.label}{count > 0 ? ` (${count})` : ''}
                </button>
              )
            })}
          </div>

          {/* Connection status + AI mode, per channel */}
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px', border: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Instagram / Messenger share one connection + agent config */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>📷💬 INSTAGRAM & MESSENGER</span>
                {igConnected ? (
                  <Link
                    href="/api/admin/instagram/disconnect"
                    onClick={async e => { e.preventDefault(); if (confirm('Disconnect Instagram & Messenger?')) { await fetch('/api/admin/instagram/disconnect', { method: 'DELETE' }); setIgConnected(null) } }}
                    style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'none' }}
                  >
                    Disconnect
                  </Link>
                ) : (
                  <a href={`/api/admin/instagram/connect?slug=${slug}`} style={{ fontSize: 10, color: '#F72585', fontWeight: 700, textDecoration: 'none' }}>
                    Connect →
                  </a>
                )}
              </div>
              {igConnected && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(MODE_LABELS).map(([mode, info]) => (
                    <button
                      key={mode}
                      onClick={() => updateMode('instagram', mode)}
                      disabled={savingMode}
                      style={{
                        flex: 1, padding: '5px 4px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        border: `1.5px solid ${(igAgentConfig?.mode ?? 'suggest') === mode ? info.color : '#E5E7EB'}`,
                        background: (igAgentConfig?.mode ?? 'suggest') === mode ? `${info.color}15` : '#fff',
                        color: (igAgentConfig?.mode ?? 'suggest') === mode ? info.color : '#9CA3AF',
                      }}
                    >
                      {info.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp — platform-assigned, no self-serve connect button */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>📱 WHATSAPP</span>
                <span style={{ fontSize: 10, color: waConnected ? '#25D366' : '#9CA3AF', fontWeight: 700 }}>
                  {waConnected ? (waConnected.display_number ?? 'Connected') : 'Not assigned yet'}
                </span>
              </div>
              {waConnected ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(MODE_LABELS).map(([mode, info]) => (
                    <button
                      key={mode}
                      onClick={() => updateMode('whatsapp', mode)}
                      disabled={savingMode}
                      style={{
                        flex: 1, padding: '5px 4px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        border: `1.5px solid ${(waAgentConfig?.mode ?? 'suggest') === mode ? info.color : '#E5E7EB'}`,
                        background: (waAgentConfig?.mode ?? 'suggest') === mode ? `${info.color}15` : '#fff',
                        color: (waAgentConfig?.mode ?? 'suggest') === mode ? info.color : '#9CA3AF',
                      }}
                    >
                      {info.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>Contact support to get a WhatsApp number set up.</p>
              )}
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {justConnectedIg && conversations.length === 0 && !loadingConvs && (
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Instagram connected! DMs will appear here.</p>
            </div>
          )}
          {!loadingConvs && filteredConversations.length === 0 && conversations.length > 0 && (
            <div style={{ padding: '24px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No conversations on this channel yet.</div>
          )}
          {filteredConversations.map(conv => {
            const meta = CHANNEL_META[conv.channel]
            return (
              <button
                key={`${conv.channel}-${conv.id}`}
                onClick={() => selectConversation(conv)}
                style={{
                  width: '100%', display: 'flex', gap: 12, padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                  background: selectedConv?.id === conv.id ? '#FFF1F5' : 'transparent',
                  border: 'none', borderBottom: '1px solid #F9FAFB',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0, position: 'relative',
                }}>
                  {(conv.sender_name ?? conv.sender_id).replace('@', '').slice(0, 1).toUpperCase()}
                  <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 11 }}>{meta.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.sender_name ?? conv.sender_id.slice(0, 10)}
                    </span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{timeAgo(conv.last_message_at)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {conv.last_message_preview ?? '...'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span style={{ background: meta.color, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 6px', marginLeft: 6, flexShrink: 0 }}>
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right panel: message thread */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedConv || !selectedChannelMeta ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <span style={{ fontSize: 14 }}>Select a conversation to reply</span>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: selectedChannelMeta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
                {(selectedConv.sender_name ?? selectedConv.sender_id).replace('@', '').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                  {selectedConv.sender_name ?? selectedConv.sender_id.slice(0, 14)}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{selectedChannelMeta.icon} {selectedChannelMeta.label} buyer</div>
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
                    background: msg.direction === 'inbound' ? '#F3F4F6' : (msg.is_ai_generated ? '#FFF1F5' : selectedChannelMeta.color),
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
                          style={{ fontSize: 10, background: selectedChannelMeta.color, color: '#fff', padding: '2px 10px', borderRadius: 99, border: 'none', cursor: 'pointer', fontWeight: 700 }}
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
                  padding: '10px 20px', borderRadius: 12, background: replyText.trim() ? selectedChannelMeta.color : '#F3F4F6',
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
