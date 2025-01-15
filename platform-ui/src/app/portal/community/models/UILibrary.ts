import { UILocation } from './UILocation';

export interface UILibrary {
  id: string;
  name: string;
  isCommunityAccessible: boolean;
  members: UIMember[];
  location: UILocation;
  instructions: string;
}

export interface UIMember {
  id: string;
  userId: string;
  username: string;
  isAdmin: boolean;
}
