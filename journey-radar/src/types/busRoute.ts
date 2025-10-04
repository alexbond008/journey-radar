import { Stop } from './stop';

export interface LineResponse {
  id: number;
  name: string;
  stops: Stop[];
}

