import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { IncidentCard } from '@/components/incident/IncidentCard';
import { IncidentDetailModal } from '@/components/incident/IncidentDetailModal';
import { ReportIncidentModal } from '@/components/incident/ReportIncidentModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { useRoutes } from '@/hooks/useRoutes';
import { EventFilters } from '@/types';
import { AlertTriangle } from 'lucide-react';

export function IncidentsPage() {
  const { events, filterEvents, loading, error } = useEvents();
  const { routes } = useRoutes();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    status: 'all',
    sortBy: 'recent',
  });

  const filteredEvents = filterEvents(filters);
  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  console.log('IncidentsPage - events:', events);
  console.log('IncidentsPage - filteredEvents:', filteredEvents);
  console.log('IncidentsPage - loading:', loading);
  console.log('IncidentsPage - error:', error);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Incidents</h1>
            <Button onClick={() => setReportModalOpen(true)}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <Tabs
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value as 'all' | 'active' | 'resolved' })
              }
            >
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="flex-1">
                  Active
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex-1">
                  Resolved
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortBy: value as 'recent' | 'mostVoted' })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="mostVoted">Most Voted</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.routeId || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, routeId: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="All routes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All routes</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={String(route.id)}>
                      {route.number} - {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/20 text-destructive p-4 rounded-md">
              Error: {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading incidents...</p>
            </div>
          )}

          {/* Incidents List */}
          {!loading && (
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No incidents reported</p>
                  <Button onClick={() => setReportModalOpen(true)}>Report Incident</Button>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <IncidentCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEventId(event.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      {/* Modals */}
      <ReportIncidentModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        pinnedLocation={null}
      />
      <IncidentDetailModal
        event={selectedEvent}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </div>
  );
}

