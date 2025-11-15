import React, { useEffect, useMemo, useState } from 'react'

export default function AdminDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [tab, setTab] = useState('books')

  // Shared state
  const [stats, setStats] = useState({ loading: true, activeLoans: 0 })

  const fetchActiveLoans = async () => {
    try {
      const resp = await fetch(`${baseUrl}/loans/active`)
      const data = await resp.json()
      setStats({ loading: false, activeLoans: data.length })
    } catch (e) {
      setStats({ loading: false, activeLoans: 0 })
    }
  }

  useEffect(() => { fetchActiveLoans() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Active Loans" value={stats.loading ? '...' : stats.activeLoans} />
        <StatCard label="Books" value={<Count endpoint={`${baseUrl}/books`} />} />
        <StatCard label="Members" value={<Count endpoint={`${baseUrl}/members`} />} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        {['books','members','loans'].map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded text-sm font-medium ${tab===k?'bg-blue-600 text-white':'bg-white border hover:bg-gray-50'}`}>{k[0].toUpperCase()+k.slice(1)}</button>
        ))}
      </div>

      {tab==='books' && <BooksManager baseUrl={baseUrl} onChange={fetchActiveLoans} />}
      {tab==='members' && <MembersManager baseUrl={baseUrl} />}
      {tab==='loans' && <LoansManager baseUrl={baseUrl} onChange={fetchActiveLoans} />}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
    </div>
  )
}

function Count({ endpoint }) {
  const [count, setCount] = useState('...')
  useEffect(() => { (async () => { try { const r = await fetch(endpoint); const d = await r.json(); setCount(Array.isArray(d)? d.length : (d?.length ?? 0)) } catch { setCount('0') } })() }, [endpoint])
  return <span>{count}</span>
}

function BooksManager({ baseUrl, onChange }) {
  const [form, setForm] = useState({ title: '', author: '', category: '', total_copies: 1, available_copies: 1, isbn: '' })
  const [books, setBooks] = useState([])

  const fetchBooks = async () => {
    const r = await fetch(`${baseUrl}/books`); setBooks(await r.json())
  }
  useEffect(() => { fetchBooks() }, [])

  const addBook = async () => {
    const payload = { ...form, total_copies: Number(form.total_copies||0), available_copies: Number(form.available_copies||0) }
    await fetch(`${baseUrl}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm({ title: '', author: '', category: '', total_copies: 1, available_copies: 1, isbn: '' })
    await fetchBooks(); onChange?.()
  }

  const remove = async (id) => { await fetch(`${baseUrl}/books/${id}`, { method: 'DELETE' }); await fetchBooks() }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white border rounded p-4 space-y-3">
        <div className="font-semibold text-gray-800">Add Book</div>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full border rounded px-3 py-2" />
        <input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author" className="w-full border rounded px-3 py-2" />
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="w-full border rounded px-3 py-2" />
        <input value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} placeholder="ISBN (optional)" className="w-full border rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" value={form.total_copies} onChange={e=>setForm({...form,total_copies:e.target.value})} placeholder="Total" className="w-full border rounded px-3 py-2" />
          <input type="number" min="0" value={form.available_copies} onChange={e=>setForm({...form,available_copies:e.target.value})} placeholder="Available" className="w-full border rounded px-3 py-2" />
        </div>
        <button onClick={addBook} className="w-full bg-blue-600 text-white rounded px-4 py-2">Add</button>
      </div>

      <div className="md:col-span-2 bg-white border rounded p-4">
        <div className="font-semibold text-gray-800 mb-3">Books</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {books.map(b => (
            <div key={b.id} className="border rounded p-3">
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">{b.author}</div>
              <div className="text-xs text-gray-500">{b.available_copies} / {b.total_copies} available</div>
              <button onClick={()=>remove(b.id)} className="mt-2 text-red-600 text-sm">Delete</button>
            </div>
          ))}
          {books.length===0 && <div className="text-gray-500">No books yet</div>}
        </div>
      </div>
    </div>
  )
}

function MembersManager({ baseUrl }) {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const fetchMembers = async () => { const r = await fetch(`${baseUrl}/members`); setMembers(await r.json()) }
  useEffect(()=>{ fetchMembers() },[])

  const addMember = async () => { await fetch(`${baseUrl}/members`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) }); setForm({ name:'', email:'', phone:'' }); await fetchMembers() }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white border rounded p-4 space-y-3">
        <div className="font-semibold text-gray-800">Add Member</div>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone (optional)" className="w-full border rounded px-3 py-2" />
        <button onClick={addMember} className="w-full bg-blue-600 text-white rounded px-4 py-2">Add</button>
      </div>

      <div className="md:col-span-2 bg-white border rounded p-4">
        <div className="font-semibold text-gray-800 mb-3">Members</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map(m => (
            <div key={m.id} className="border rounded p-3">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-600">{m.email}</div>
              {m.phone && <div className="text-xs text-gray-500">{m.phone}</div>}
            </div>
          ))}
          {members.length===0 && <div className="text-gray-500">No members yet</div>}
        </div>
      </div>
    </div>
  )
}

function LoansManager({ baseUrl, onChange }) {
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [loans, setLoans] = useState([])
  const [form, setForm] = useState({ member_id: '', book_id: '', days: 14 })

  const fetchAll = async () => {
    const [m, b, l] = await Promise.all([
      fetch(`${baseUrl}/members`).then(r=>r.json()),
      fetch(`${baseUrl}/books`).then(r=>r.json()),
      fetch(`${baseUrl}/loans`).then(r=>r.json()),
    ])
    setMembers(m); setBooks(b); setLoans(l)
  }
  useEffect(()=>{ fetchAll() },[])

  const borrow = async () => {
    await fetch(`${baseUrl}/loans/borrow`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, days: Number(form.days||14) }) })
    await fetchAll(); onChange?.()
  }
  const ret = async (id) => { await fetch(`${baseUrl}/loans/return`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ loan_id: id }) }); await fetchAll(); onChange?.() }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white border rounded p-4 space-y-3">
        <div className="font-semibold text-gray-800">Borrow Book</div>
        <select value={form.member_id} onChange={e=>setForm({...form,member_id:e.target.value})} className="w-full border rounded px-3 py-2">
          <option value="">Select Member</option>
          {members.map(m=> <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
        </select>
        <select value={form.book_id} onChange={e=>setForm({...form,book_id:e.target.value})} className="w-full border rounded px-3 py-2">
          <option value="">Select Book</option>
          {books.map(b=> <option key={b.id} value={b.id}>{b.title} — {b.available_copies} left</option>)}
        </select>
        <input type="number" min="1" value={form.days} onChange={e=>setForm({...form,days:e.target.value})} className="w-full border rounded px-3 py-2" />
        <button onClick={borrow} disabled={!form.member_id||!form.book_id} className="w-full bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">Borrow</button>
      </div>

      <div className="md:col-span-2 bg-white border rounded p-4">
        <div className="font-semibold text-gray-800 mb-3">All Loans</div>
        <div className="space-y-2">
          {loans.map(l => (
            <div key={l.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.book?.title || 'Book'} → {l.member?.name || 'Member'}</div>
                <div className="text-xs text-gray-500">Due: {l.due_date?.slice(0,10)} | Returned: {l.returned ? 'Yes' : 'No'}</div>
              </div>
              {!l.returned && <button onClick={()=>ret(l.id)} className="text-sm text-green-700">Mark Returned</button>}
            </div>
          ))}
          {loans.length===0 && <div className="text-gray-500">No loans yet</div>}
        </div>
      </div>
    </div>
  )
}
