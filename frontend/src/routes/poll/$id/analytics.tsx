import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { apiClient } from '../../../api/client'
import { io, Socket } from 'socket.io-client'

export const Route = createFileRoute('/poll/$id/analytics')({ component: Analytics })

function Analytics() {
  const { id } = Route.useParams()
  const [poll, setPoll] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch initial poll state
    apiClient.get(`/polls/${id}`).then(res => {
      setPoll(res.data.data)
      setLoading(false)
    })

    // 2. Setup WebSocket connection
    const socket: Socket = io('http://localhost:3000') // Replace with env variable in production
    
    socket.emit('subscribe_poll', id)

    socket.on('poll_updated', (updatedData) => {
      console.log('Real-time update received:', updatedData)
      setPoll(updatedData)
    })

    return () => {
      socket.disconnect()
    }
  }, [id])

  if (loading) return <div>Loading Analytics...</div>
  if (!poll) return <div>Data not found</div>

  return (
    <div className="max-w-4xl mx-auto w-full pt-10">
      <div className="bg-[#0f172a] p-8 rounded-xl border border-[#334155] shadow-lg mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{poll.title} - Analytics</h1>
          <p className="text-gray-400">Real-time voting results</p>
        </div>
        <div className="bg-[#1e293b] px-6 py-3 rounded-lg border border-[#334155] text-center">
          <span className="block text-sm text-gray-400 mb-1">Total Responses</span>
          <span className="text-3xl font-bold text-blue-400">{poll.responses?.length || 0}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {poll.questions?.map((q: any, i: number) => {
          // Calculate total votes for this specific question
          const totalVotes = q.options?.reduce((sum: number, opt: any) => sum + (opt._count?.responses || 0), 0) || 0

          return (
            <div key={q.id} className="bg-[#0f172a] p-6 rounded-xl border border-[#334155]">
              <h3 className="font-semibold text-xl mb-6">{i + 1}. {q.text}</h3>
              
              <div className="space-y-4">
                {q.options?.map((opt: any) => {
                  const votes = opt._count?.responses || 0
                  const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
                  
                  return (
                    <div key={opt.id} className="relative">
                      <div className="flex justify-between text-sm mb-1 z-10 relative">
                        <span className="font-medium px-2">{opt.text}</span>
                        <span className="text-gray-400 px-2">{votes} votes ({percentage}%)</span>
                      </div>
                      <div className="h-8 w-full bg-[#1e293b] rounded overflow-hidden">
                        <div 
                          className="h-full bg-blue-600/50 transition-all duration-500 ease-out" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
