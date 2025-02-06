import { UILocation } from './UILocation';

export interface UILibrary {
  id: string;
  name: string;
  isCommunityAccessible: boolean;
  requiresApproval: boolean;
  freeAccess: boolean;
  admins: UIMember[];
  location: UILocation;
  instructions: string;
}

export interface UIMember {
  userId: string;
}

