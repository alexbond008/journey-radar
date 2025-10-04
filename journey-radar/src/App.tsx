import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MapPage } from '@/pages/MapPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { StopsProvider } from '@/context/StopsContext';
import { RoutesProvider } from '@/context/RoutesContext';
import { EventsProvider } from '@/context/EventsContext';
import { MapProvider } from '@/context/MapContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <StopsProvider>
        <RoutesProvider>
          <EventsProvider>
            <MapProvider>
              <Routes>
                <Route path="/" element={<MapPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
              <Toaster position="top-center" />
            </MapProvider>
          </EventsProvider>
        </RoutesProvider>
      </StopsProvider>
    </BrowserRouter>
  );
}

export default App;

