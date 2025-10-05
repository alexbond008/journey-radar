import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

interface BuyTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyTicketModal({ isOpen, onClose }: BuyTicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Ticket className="w-6 h-6 text-green-600" />
            Buy Ticket
          </DialogTitle>
          <DialogDescription>
            Purchase your journey ticket quickly and easily
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-muted rounded-lg p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Ticket Purchase Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              This feature is currently under development. Soon you'll be able to purchase tickets directly from the app!
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button disabled className="bg-green-600 hover:bg-green-700">
            Continue (Coming Soon)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

