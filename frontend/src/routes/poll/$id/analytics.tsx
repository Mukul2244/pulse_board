import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { apiClient } from '../../../api/client'
import { io, Socket } from 'socket.io-client'
import { GlassCard, ShimmerButton } from '@/components/ui/aceternity'
import { ChevronLeft, Users, Wifi, WifiOff, Share2, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/poll/$id/analytics')({ component: Analytics })

function Analytics() {
  const { id } = Route.useParams()
  const [poll, setPoll] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    apiClient.get(`/polls/${id}`).then(res => setPoll(res.data.data)).finally(() => setLoading(false))
    const socket: Socket = io('http://localhost:3000')
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.emit('subscribe_poll', id)
    socket.on('poll_updated', setPoll)
    return () => { socket.disconnect() }
  }, [id])

  const publishResults = async () => {
    setPublishing(true)
    try { await apiClient.put(`/polls/${id}/publish-results`); setPoll((p: any) => ({ ...p, resultsPublished: true })) }
    catch { alert('Failed to publish results') } finally { setPublishing(false) }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}
    </div>
  )
  if (!poll) return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Poll not found</div>

  const totalResponses = poll.responses?.length ?? 0
  const isOwner = !!localStorage.getItem('accessToken')

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-10">
      <Link to="/dashboard">
        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard glow="primary" className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">{poll.title}</h1>
                <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  connected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {connected ? 'Live' : 'Offline'}
                </span>
                {poll.resultsPublished && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary border border-primary/20">
                    <Trophy className="w-3 h-3" /> Published
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">Real-time voting results</p>
            </div>
            <div className="flex items-center gap-3">
              <GlassCard className="px-5 py-3 flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold leading-none">{totalResponses}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">responses</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Share + Publish row */}
      <div className="flex items-center gap-3 mb-6">
        <GlassCard className="flex-1 flex items-center gap-2 px-4 py-2.5">
          <Share2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate flex-1">{window.location.origin}/poll/{id}</span>
          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/poll/${id}`)}
            className="text-xs text-primary hover:text-primary/80 font-medium shrink-0 transition-colors">Copy</button>
        </GlassCard>
        {isOwner && !poll.resultsPublished && (
          <ShimmerButton onClick={publishResults} disabled={publishing} className="h-9 px-4 text-xs shrink-0">
            {publishing ? 'Publishing…' : '🏆 Publish Results'}
          </ShimmerButton>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {poll.questions?.map((q: any, i: number) => {
          const totalVotes = q.options?.reduce((s: number, o: any) => s + (o._count?.responses || 0), 0) || 0
          const maxVotes = Math.max(...(q.options?.map((o: any) => o._count?.responses || 0) ?? [0]))

          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-5">{i + 1}. {q.text}</h3>
                <div className="space-y-3">
                  {q.options?.map((opt: any) => {
                    const votes = opt._count?.responses || 0
                    const pct = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100)
                    const isLeading = totalVotes > 0 && votes === maxVotes

                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className={`font-medium ${isLeading ? 'text-primary' : 'text-foreground/80'}`}>
                            {isLeading && totalVotes > 0 && '🏆 '}{opt.text}
                          </span>
                          <span className="text-muted-foreground">{votes} · {pct}%</span>
                        </div>
                        <div className="h-7 w-full bg-muted rounded-xl overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
                            className={`h-full rounded-xl ${isLeading ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted-foreground/30'}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4">{totalVotes} total vote{totalVotes !== 1 ? 's' : ''}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
