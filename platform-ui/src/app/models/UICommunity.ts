import { UILocation } from './UILocation';
import { UIPagination } from './UIPagination';
import { UIUser } from './UIUser';

export interface UICommunity {
  id: string;
  name: string;
  requiresApproval: boolean;
  location: UILocation;
  picture?: string;
  description?: string;
}

export interface UIMember extends UIUser {
  isAdmin: boolean;
}

export interface UIMembersPagination extends UIPagination<UIMember> {
}

