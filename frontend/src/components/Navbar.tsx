import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useTheme } from 'next-themes';
import { FloatingNav } from './ui/aceternity';
import { Activity, LayoutDashboard, LogOut, Moon, PlusCircle, Sun } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { theme, setTheme } = useTheme();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate({ to: '/' });
  };

  const isActive = (p: string) => location.pathname === p;

  return (
    <FloatingNav>
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[15px] tracking-tight">PulseBoard</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <NavBtn to="/poll/new" active={isActive('/poll/new')}>
                <PlusCircle className="w-3.5 h-3.5" /> New Poll
              </NavBtn>
              <NavBtn to="/dashboard" active={isActive('/dashboard')}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </NavBtn>
              <div className="w-px h-4 bg-border mx-1" />
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavBtn to="/login" active={isActive('/login')}>Log in</NavBtn>
              <Link to="/register">
                <button className="ml-1 px-4 h-8 rounded-lg text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                  Sign up
                </button>
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 dark:hidden" />
          </button>
        </div>
      </div>
    </FloatingNav>
  );
}

function NavBtn({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <button className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-[13px] transition-colors ${
        active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}>
        {children}
      </button>
    </Link>
  );
}
