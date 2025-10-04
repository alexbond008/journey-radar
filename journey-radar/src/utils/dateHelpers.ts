import { formatDistanceToNow, format } from 'date-fns';

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDate = (date: Date, formatString: string = 'PPP'): string => {
  return format(date, formatString);
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'PPP p');
};


