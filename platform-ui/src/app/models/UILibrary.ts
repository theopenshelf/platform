import { UILocation } from './UILocation';
import { UIPagination } from './UIPagination';
import { UIUser } from './UIUser';

export interface UILibrary {
  id: string;
  name: string;
  communityId: string;
  isHubAccessible: boolean;
  requiresApproval: boolean;
  freeAccess: boolean;
  location: UILocation;
  instructions: string;
  isAdmin: boolean;
}

export interface UIMember extends UIUser {
  isAdmin: boolean;
}

export function isLibraryAdmin(user: UIUser, library: UILibrary): boolean {
  return library.isAdmin;
}

export interface UIMembersPagination extends UIPagination<UIMember> {
}

