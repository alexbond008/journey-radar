import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle } from 'lucide-react';

interface ReportButtonProps {
  onClick: () => void;
}

export function ReportButton({ onClick }: ReportButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="lg"
          onClick={onClick}
          className="rounded-full w-14 h-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-transform"
        >
          <AlertTriangle className="w-6 h-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10}>
        <p>Report a Problem</p>
      </TooltipContent>
    </Tooltip>
  );
}


