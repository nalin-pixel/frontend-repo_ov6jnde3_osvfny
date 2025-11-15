import React, { useEffect, useState } from 'react'

export default function Catalog() {
  const [q, setQ] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const resp = await fetch(`${baseUrl}/books${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      const data = await resp.json()
      setBooks(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, author, category..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={fetchBooks} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((b) => (
            <div key={b.id} className="border rounded p-4 bg-white">
              <div className="font-semibold text-gray-800">{b.title}</div>
              <div className="text-sm text-gray-600">{b.author}</div>
              {b.category && <div className="text-xs mt-1 text-gray-500">{b.category}</div>}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className={`${b.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {b.available_copies} available
                </span>
                {b.isbn && <span className="text-gray-500">ISBN: {b.isbn}</span>}
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No books found</div>
          )}
        </div>
      )}
    </div>
  )
}
