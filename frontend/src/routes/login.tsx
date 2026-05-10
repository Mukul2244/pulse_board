import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { apiClient } from '../api/client'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await apiClient.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', data.data.accessToken)
      window.location.href = '/dashboard'
    } catch(err) {
      alert('Login failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm p-8 bg-[#0f172a] border border-[#334155] rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-md font-medium transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
