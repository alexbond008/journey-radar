import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/usersService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fetch available users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersService.getAllUsers();
        setAvailableUsers(users.map(u => u.name));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users. Please try again.');
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      // Verify user exists in backend
      const user = await usersService.verifyUserByName(trimmedName);

      if (user) {
        login(user);
        toast.success(`Welcome, ${user.name}!`);
        navigate('/');
      } else {
        toast.error(
          availableUsers.length > 0
            ? `Invalid name. Available users: ${availableUsers.join(', ')}`
            : 'Invalid name. Please try again.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Radar className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Journey-Radar</CardTitle>
            <CardDescription className="text-base mt-2">
              Real-time Transit Tracking
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Enter your name
            </label>
            <Input
              id="name"
              type="text"
              placeholder={availableUsers.length > 0 ? availableUsers.join(', ') : 'Enter your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          {availableUsers.length > 0 && (
            <div className="text-xs text-center text-muted-foreground">
              Available users: {availableUsers.join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

