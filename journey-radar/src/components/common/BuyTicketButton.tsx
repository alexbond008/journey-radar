import { Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuyTicketButtonProps {
  onClick: () => void;
}

export function BuyTicketButton({ onClick }: BuyTicketButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="rounded-full shadow-lg h-14 px-6 bg-green-600 hover:bg-green-700 text-white"
    >
      <Ticket className="w-5 h-5 mr-2" />
      Buy Ticket
    </Button>
  );
}

