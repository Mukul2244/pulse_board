import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { apiClient } from '../api/client'

export const Route = createFileRoute('/register')({ component: Register })

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await apiClient.post('/auth/register', { email, password, name })
      localStorage.setItem('token', res.data.data.token)
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-[#0f172a] p-8 rounded-xl border border-[#334155] w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#1e293b] border border-[#334155] rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors mt-4">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <Link to="/" className="text-blue-400 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
