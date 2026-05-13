import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
    </div>
  ),
});
