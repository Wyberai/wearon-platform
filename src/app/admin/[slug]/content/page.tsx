'use client'

import { useEffect, useRef, useState } from 'react'

interface ContentPost {
  id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string | null
  platforms: string[]
  status: 'draft' | 'publishing' | 'published' | 'failed'
  external_post_ids: Record<string, string>
  error_message: string | null
  created_at: string
}

interface AiStudioOutput {
  id: string
  result_image_url: string | null
  result_video_url: string | null
  output_type: string
  created_at: string
}

const PLATFORMS: { key: 'instagram' | 'facebook'; label: string; color: string; icon: string }[] = [
  { key: 'instagram', label: 'Instagram', color: '#F72585', icon: '📷' },
  { key: 'facebook', label: 'Facebook', color: '#0084FF', icon: '👍' },
]

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#9CA3AF' },
  publishing: { label: 'Publishing…', color: '#F59E0B' },
  published: { label: 'Published', color: '#22C55E' },
  failed: { label: 'Failed', color: '#EF4444' },
}

export default function ContentPage() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [aiOutputs, setAiOutputs] = useState<AiStudioOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedAiOutput, setSelectedAiOutput] = useState<AiStudioOutput | null>(null)
  const [caption, setCaption] = useState('')
  const [platforms, setPlatforms] = useState<string[]>(['instagram'])
  const fileRef = useRef<HTMLInputElement>(null)

  function load() {
    fetch('/api/admin/content').then(r => r.json()).then(d => {
      setPosts(d.posts ?? [])
      setAiOutputs(d.ai_studio_outputs ?? [])
      setLoading(false)
    })
  }

  useEffect(load, [])

  // Poll for status while any post is mid-publish
  useEffect(() => {
    if (!posts.some(p => p.status === 'publishing')) return
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [posts])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setSelectedAiOutput(null)
    const reader = new FileReader()
    reader.onload = ev => setFilePreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  function pickAiOutput(o: AiStudioOutput) {
    setSelectedAiOutput(o)
    setFile(null)
    setFilePreview(o.result_video_url ?? o.result_image_url)
  }

  function togglePlatform(key: string) {
    setPlatforms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file && !selectedAiOutput) return alert('Upload a photo/video or pick an AI Studio output')
    if (platforms.length === 0) return alert('Pick at least one platform')
    setUploading(true)

    const formData = new FormData()
    if (file) formData.append('media', file)
    if (selectedAiOutput) formData.append('ai_model_shot_id', selectedAiOutput.id)
    formData.append('caption', caption)
    formData.append('platforms', platforms.join(','))

    const res = await fetch('/api/admin/content', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(false)

    if (!res.ok) return alert(data.error ?? 'Failed to create post')

    setShowForm(false)
    setFile(null)
    setFilePreview(null)
    setSelectedAiOutput(null)
    setCaption('')
    setPlatforms(['instagram'])
    load()
  }

  async function publish(post: ContentPost) {
    setPublishingId(post.id)
    await fetch('/api/admin/content/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: post.id }),
    })
    setPublishingId(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content</h1>
          <p className="text-gray-500 text-sm">Upload a photo or reel and post it straight to Instagram &amp; Facebook</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-8 space-y-4">
          <h2 className="font-semibold text-gray-900">New Post</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-pink-300 transition-colors"
            >
              {filePreview ? (
                selectedAiOutput?.result_video_url || file?.type.startsWith('video/') ? (
                  <video src={filePreview} className="max-h-48 mx-auto rounded-lg" controls />
                ) : (
                  <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                )
              ) : (
                <div className="text-gray-400">
                  <div className="text-3xl mb-2">🎬</div>
                  <p className="text-sm">Click to upload a photo or video</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
          </div>

          {aiOutputs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or pick something from AI Studio</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {aiOutputs.map(o => (
                  <button
                    type="button"
                    key={o.id}
                    onClick={() => pickAiOutput(o)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedAiOutput?.id === o.id ? 'border-pink-500' : 'border-gray-200'}`}
                  >
                    <img src={o.result_image_url ?? ''} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              rows={3} placeholder="Write a caption... #fashion #ootd"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post to</label>
            <div className="flex gap-2">
              {PLATFORMS.map(p => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => togglePlatform(p.key)}
                  className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={platforms.includes(p.key)
                    ? { borderColor: p.color, backgroundColor: `${p.color}15`, color: p.color }
                    : { borderColor: '#E5E7EB', color: '#9CA3AF' }}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={uploading}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50">
            {uploading ? 'Saving...' : 'Save as Draft'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm mt-1">Upload a photo or reel to post to your socials</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {posts.map(post => {
            const status = STATUS_LABEL[post.status]
            return (
              <div key={post.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: status.color }}>
                    {status.label}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2 min-h-[2.5em]">{post.caption || <span className="text-gray-300">No caption</span>}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {post.platforms.map(pk => {
                      const meta = PLATFORMS.find(p => p.key === pk)
                      const published = !!post.external_post_ids?.[pk]
                      return (
                        <span key={pk} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${meta?.color}15`, color: meta?.color, opacity: post.status === 'published' && !published ? 0.4 : 1 }}>
                          {meta?.icon} {published ? '✓' : ''}
                        </span>
                      )
                    })}
                  </div>
                  {post.error_message && (
                    <p className="text-xs text-red-500 mb-2 line-clamp-2">{post.error_message}</p>
                  )}
                  {post.status === 'draft' && (
                    <button
                      onClick={() => publish(post)}
                      disabled={publishingId === post.id}
                      className="w-full text-xs bg-pink-600 text-white py-1.5 rounded hover:bg-pink-700 disabled:opacity-50"
                    >
                      {publishingId === post.id ? 'Publishing…' : 'Publish now'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
