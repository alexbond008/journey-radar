import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AlertTriangle, Camera, MapPin, MessageSquare } from 'lucide-react';

interface ReportButtonWithActionsProps {
  onReportDelay?: () => void;
  onReportAccident?: () => void;
  onReportCrowding?: () => void;
  onReportOther?: () => void;
}

/**
 * Alternative to ReportButton that shows action menu on click
 * Use this instead of the tooltip version if you want to display actions
 */
export function ReportButtonWithActions({
  onReportDelay,
  onReportAccident,
  onReportCrowding,
  onReportOther,
}: ReportButtonWithActionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-transform"
        >
          <AlertTriangle className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="end" className="w-56 p-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold px-2 py-1.5">Report Issue</p>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onReportDelay}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Delay
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onReportAccident}
          >
            <Camera className="w-4 h-4 mr-2" />
            Report Accident
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onReportCrowding}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Report Crowding
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onReportOther}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Other Issue
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

