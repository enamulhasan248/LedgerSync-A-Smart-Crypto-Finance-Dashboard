import { TrendingUp, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LandingNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">LedgerSync</span>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Button
            variant="ghost"
            className={(isActive('/') ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground")}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className={(isActive('/stocks') ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground")}
            onClick={() => navigate('/stocks')}
          >
            Stocks
          </Button>
          <Button
            variant="ghost"
            className={(isActive('/crypto') ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground")}
            onClick={() => navigate('/crypto')}
          >
            Crypto
          </Button>
          <Button
            variant="ghost"
            className={(isActive('/news') ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground")}
            onClick={() => navigate('/news')}
          >
            News
          </Button>
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Button variant="default" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name || 'My Account'}
                  {user?.email && <p className="text-xs font-normal text-muted-foreground">{user.email}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')}>
            Login / Sign Up
          </Button>
        )}
      </div>
    </header>
  );
}
