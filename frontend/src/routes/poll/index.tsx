import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

export const Route = createFileRoute('/poll/')({ component: PollIndex })

function PollIndex() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <BarChart3 className="w-12 h-12 text-slate-700 mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">No poll selected</h2>
      <p className="text-slate-400 mb-6">Go to your dashboard to view or create polls.</p>
      <Link to="/dashboard">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">Go to Dashboard</Button>
      </Link>
    </div>
  )
}
