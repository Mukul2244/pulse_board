import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] font-sans flex flex-col">
      {/* Basic Nav / Header can go here later */}
      <div className="p-4 flex gap-4 text-blue-500 border-b border-[#334155]">
        <a href="/" className="font-bold text-blue-400">PulseBoard</a>
      </div>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 flex flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
