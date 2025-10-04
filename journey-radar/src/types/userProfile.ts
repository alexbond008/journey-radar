export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  incidentsReported: number;
  upvotesReceived: number;
  memberSince: Date;
}

