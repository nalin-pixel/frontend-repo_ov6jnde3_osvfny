import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Catalog from './components/Catalog'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [active, setActive] = useState('catalog')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={active} setActiveTab={setActive} />
      {active === 'catalog' && <Catalog />}
      {active === 'admin' && <AdminDashboard />}
      {active === 'test' && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white border rounded p-6">
            <h2 className="text-xl font-semibold mb-2">Connection Test</h2>
            <p className="text-gray-600 mb-4">Use the separate Test page to verify connectivity.</p>
            <a href="/test" className="inline-block bg-blue-600 text-white rounded px-4 py-2">Open Test Page</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
