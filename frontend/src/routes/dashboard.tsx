import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 flex-1 py-10">
      <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      <p className="text-gray-400">View and manage all your polls here.</p>
      
      <Link 
        to="/poll/new" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Create New Poll
      </Link>
    </div>
  )
}
