import { Button } from '@/components/ui/button';
import { Radar, Menu, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NotificationsDropdown } from './NotificationsDropdown';

interface HeaderProps {
  onMenuClick?: () => void;
  onRoutesClick?: () => void;
}

export function Header({ onMenuClick, onRoutesClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Radar className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">
              {user ? `Hi, ${user.name}` : 'Journey-Radar'}
            </h1>
            <p className="text-xs text-muted-foreground">Real-time Transit</p>
          </div>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        {user && <NotificationsDropdown />}
        {onRoutesClick && (
          <Button
            onClick={onRoutesClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Route className="w-4 h-4 mr-2" />
            Routes
          </Button>
        )}
      </div>
    </header>
  );
}


