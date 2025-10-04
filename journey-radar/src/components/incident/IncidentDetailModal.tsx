import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { getIncidentColor, getIncidentIcon } from '@/utils/helpers';
import { useEvents } from '@/hooks/useEvents';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface IncidentDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IncidentDetailModal({ event, isOpen, onClose }: IncidentDetailModalProps) {
  const { voteOnEvent } = useEvents();

  if (!event) return null;

  const color = getIncidentColor(event.type);
  const icon = getIncidentIcon(event.type);

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      await voteOnEvent(event.id, voteType);
      toast.success(`Vote recorded`);
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  const totalVotes = event.upvotes + event.downvotes;
  const upvotePercentage = totalVotes > 0 ? (event.upvotes / totalVotes) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: color + '33' }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(event.timestamp)}
                </span>
                {event.isResolved ? (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                    Resolved
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-600">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Location</h4>
            <p className="text-sm text-muted-foreground">
              {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Legitimacy Voting</h4>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote('up')}
                className="flex-1"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Upvote ({event.upvotes})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote('down')}
                className="flex-1"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Downvote ({event.downvotes})
              </Button>
            </div>
            {totalVotes > 0 && (
              <div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${upvotePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {upvotePercentage.toFixed(0)}% upvoted
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Reported by: {event.reportedBy}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

