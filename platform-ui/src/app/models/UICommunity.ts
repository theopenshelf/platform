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

export interface UICommunityWithMembership extends UICommunity {
  membership: {
    isMember: boolean;
    role: 'admin' | 'member' | 'requestingJoin';
  };
}

export interface UIMember extends UIUser {
  role: 'admin' | 'member' | 'requestingJoin';
}

export interface UIMembersPagination extends UIPagination<UIMember> {
}

