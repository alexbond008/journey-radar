import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MapPage } from '@/pages/MapPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { StopsProvider } from '@/context/StopsContext';
import { RoutesProvider } from '@/context/RoutesContext';
import { EventsProvider } from '@/context/EventsContext';
import { MapProvider } from '@/context/MapContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <StopsProvider>
            <RoutesProvider>
              <EventsProvider>
                <NotificationsProvider>
                  <MapProvider>
                    <AppRoutes />
                    <Toaster position="top-center" />
                  </MapProvider>
                </NotificationsProvider>
              </EventsProvider>
            </RoutesProvider>
          </StopsProvider>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

