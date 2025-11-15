import React from 'react'

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'catalog', label: 'Explore Library' },
    { key: 'admin', label: 'Admin Dashboard' },
    { key: 'test', label: 'Connection Test' },
  ]

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-blue-600 text-white grid place-items-center font-bold">L</div>
          <span className="font-semibold text-gray-800">Library Manager</span>
        </div>
        <nav className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
