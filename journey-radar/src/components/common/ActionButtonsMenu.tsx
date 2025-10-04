import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, MessageCircle, Plus, X } from 'lucide-react';

interface ActionButtonsMenuProps {
  onReportClick: () => void;
  onChatbotClick: () => void;
}

export function ActionButtonsMenu({ onReportClick, onChatbotClick }: ActionButtonsMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleReportClick = () => {
    setIsExpanded(false);
    onReportClick();
  };

  const handleChatbotClick = () => {
    setIsExpanded(false);
    onChatbotClick();
  };

  return (
    <div className="relative flex flex-col items-end gap-3">
      {/* Action Buttons - Shown when expanded */}
      {isExpanded && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* Report Event Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={handleReportClick}
                className="rounded-full w-14 h-14 shadow-lg bg-orange-600 text-white hover:bg-orange-700 hover:scale-110 transition-transform"
              >
                <AlertTriangle className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10}>
              <p>Report Event</p>
            </TooltipContent>
          </Tooltip>

          {/* Chatbot Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={handleChatbotClick}
                className="rounded-full w-14 h-14 shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10}>
              <p>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Main Toggle Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            onClick={toggleExpanded}
            className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
              isExpanded
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 rotate-45'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10}>
          <p>{isExpanded ? 'Close' : 'Actions'}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

