import { UILocation } from './UILocation';
import { UIUser } from './UIUser';

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

export function isLibraryAdmin(user: UIUser, library: UILibrary): boolean {
  return library.admins.some((admin) => admin.userId === user.id);
}

