'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

interface Product {
  id: string
  name: string
  price_inr: number
  category: string | null
  garment_image_url: string
  is_active: boolean
  created_at: string
}

export default function ProductsPage() {
  const { slug } = useParams() as { slug: string }
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_inr: '',
    original_price_inr: '',
    category: '',
    sizes: '',
    tags: '',
  })
  const [garmentFile, setGarmentFile] = useState<File | null>(null)
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function loadProducts() {
    fetch(`/api/admin/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setProducts(data.products ?? []); setLoading(false) })
  }

  useEffect(loadProducts, [slug])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setGarmentFile(file)
    const reader = new FileReader()
    reader.onload = ev => setGarmentPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!garmentFile) return alert('Please upload a garment photo')
    setUploading(true)

    const formData = new FormData()
    formData.append('garment', garmentFile)
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    formData.append('slug', slug)

    const res = await fetch('/api/admin/products', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) { alert(data.error ?? 'Upload failed'); setUploading(false); return }

    setUploading(false)
    setShowForm(false)
    setGarmentFile(null)
    setGarmentPreview(null)
    setForm({ name: '', description: '', price_inr: '', original_price_inr: '', category: '', sizes: '', tags: '' })
    loadProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} product{products.length !== 1 ? 's' : ''} in your store</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add product form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-8 space-y-4">
          <h2 className="font-semibold text-gray-900">New Product</h2>

          {/* Garment upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Garment Photo (on hanger or flat lay)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-pink-300 transition-colors"
            >
              {garmentPreview ? (
                <img src={garmentPreview} alt="Garment preview" className="max-h-40 mx-auto rounded-lg object-cover" />
              ) : (
                <div className="text-gray-400">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm">Click to upload garment photo</p>
                  <p className="text-xs mt-1">JPG, PNG · Clear background preferred</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Floral Cotton Kurti"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Select category</option>
                {['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" required value={form.price_inr} onChange={e => setForm({ ...form, price_inr: e.target.value })}
                placeholder="999"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) — optional</label>
              <input type="number" value={form.original_price_inr} onChange={e => setForm({ ...form, original_price_inr: e.target.value })}
                placeholder="1499"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes (comma-separated)</label>
            <input type="text" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })}
              placeholder="XS, S, M, L, XL, XXL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Describe the fabric, fit, and occasion..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
          </div>

          <button type="submit" disabled={uploading}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50">
            {uploading ? 'Uploading & processing...' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">👗</div>
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm mt-1">Add your first product to make your store live</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                <img src={product.garment_image_url} alt={product.name}
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-900 truncate">{product.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">{product.category}</div>
                <div className="text-pink-600 font-bold mt-1">₹{product.price_inr.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
