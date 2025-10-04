import { Event } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { getIncidentColor, getIncidentIcon } from '@/utils/helpers';

interface IncidentCardProps {
  event: Event;
  onClick: () => void;
}

export function IncidentCard({ event, onClick }: IncidentCardProps) {
  const color = getIncidentColor(event.type);
  const icon = getIncidentIcon(event.type);

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: color + '33' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-card-foreground truncate">{event.title}</h3>
            {event.isResolved && (
              <Badge variant="secondary" className="text-xs">Resolved</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {event.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatRelativeTime(event.timestamp)}</span>
            <span>👍 {event.upvotes} 👎 {event.downvotes}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

